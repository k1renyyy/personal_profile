import {createHmac} from "node:crypto";
import {mkdtemp, readFile, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {afterEach, describe, expect, it} from "vitest";
import {createLocalSanityWebhookServer} from "./local-sanity-webhook.mts";

const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, {recursive: true})));
});

function signatureFor(body: string, secret: string): string {
  const timestamp = Date.now();
  const digest = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");
  return `t=${timestamp},v1=${digest}`;
}

async function fixtureDirectory(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "phase3e-webhook-"));
  temporaryDirectories.push(directory);
  await writeFile(path.join(directory, "index.html"), "previous static site");
  return directory;
}

async function listen(server: ReturnType<typeof createLocalSanityWebhookServer>): Promise<string> {
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Expected a local TCP address");
  return `http://127.0.0.1:${address.port}/webhook`;
}

async function close(server: ReturnType<typeof createLocalSanityWebhookServer>): Promise<void> {
  await new Promise<void>((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve())),
  );
}

describe("local signed Sanity webhook", () => {
  it("rejects a missing or invalid signature without running a build", async () => {
    const outputDirectory = await fixtureDirectory();
    let builds = 0;
    const server = createLocalSanityWebhookServer({
      secret: "local-test-secret-at-least-32-characters",
      outputDirectory,
      build: async () => {
        builds += 1;
      },
    });
    const url = await listen(server);

    try {
      const missing = await fetch(url, {method: "POST", body: "{}"});
      const invalid = await fetch(url, {
        method: "POST",
        body: "{}",
        headers: {"sanity-webhook-signature": "t=1700000000000,v1=invalid"},
      });

      expect([missing.status, invalid.status]).toEqual([401, 401]);
      expect(builds).toBe(0);
      expect(await readFile(path.join(outputDirectory, "index.html"), "utf8")).toBe(
        "previous static site",
      );
    } finally {
      await close(server);
    }
  });

  it("accepts a valid Sanity signature and completes the local static build", async () => {
    const outputDirectory = await fixtureDirectory();
    const body = JSON.stringify({_id: "project-poc-1", _type: "project"});
    const secret = "local-test-secret-at-least-32-characters";
    const server = createLocalSanityWebhookServer({
      secret,
      outputDirectory,
      build: async () => {
        await writeFile(path.join(outputDirectory, "index.html"), "rebuilt static site");
      },
    });
    const url = await listen(server);

    try {
      const response = await fetch(url, {
        method: "POST",
        body,
        headers: {"sanity-webhook-signature": signatureFor(body, secret)},
      });

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ok: true, build: "completed"});
      expect(await readFile(path.join(outputDirectory, "index.html"), "utf8")).toBe(
        "rebuilt static site",
      );
    } finally {
      await close(server);
    }
  });

  it("restores the previous static output when a signed build fails", async () => {
    const outputDirectory = await fixtureDirectory();
    const body = JSON.stringify({_id: "project-poc-1", _type: "project"});
    const secret = "local-test-secret-at-least-32-characters";
    const server = createLocalSanityWebhookServer({
      secret,
      outputDirectory,
      build: async () => {
        await writeFile(path.join(outputDirectory, "index.html"), "partial failed build");
        throw new Error("build failed");
      },
    });
    const url = await listen(server);

    try {
      const response = await fetch(url, {
        method: "POST",
        body,
        headers: {"sanity-webhook-signature": signatureFor(body, secret)},
      });

      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ok: false, error: "build failed"});
      expect(await readFile(path.join(outputDirectory, "index.html"), "utf8")).toBe(
        "previous static site",
      );
    } finally {
      await close(server);
    }
  });
});
