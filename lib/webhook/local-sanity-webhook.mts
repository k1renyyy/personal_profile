import {SIGNATURE_HEADER_NAME, isValidSignature} from "@sanity/webhook";
import {createServer, type IncomingMessage, type Server, type ServerResponse} from "node:http";
import {cp, mkdtemp, rm, stat} from "node:fs/promises";
import path from "node:path";

type LocalWebhookOptions = {
  secret: string;
  outputDirectory: string;
  build: () => Promise<void>;
};

async function exists(target: string): Promise<boolean> {
  try {
    await stat(target);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function runProtectedBuild(options: LocalWebhookOptions): Promise<void> {
  const parentDirectory = path.dirname(options.outputDirectory);
  const backupDirectory = await mkdtemp(path.join(parentDirectory, ".phase3e-static-backup-"));
  const backupOutput = path.join(backupDirectory, "out");
  const hadPreviousOutput = await exists(options.outputDirectory);

  if (hadPreviousOutput) {
    await cp(options.outputDirectory, backupOutput, {recursive: true});
  }

  try {
    await options.build();
  } catch (error) {
    await rm(options.outputDirectory, {recursive: true, force: true});
    if (hadPreviousOutput) {
      await cp(backupOutput, options.outputDirectory, {recursive: true});
    }
    throw error;
  } finally {
    await rm(backupDirectory, {recursive: true, force: true});
  }
}

function respond(response: ServerResponse<IncomingMessage>, status: number, body: object) {
  response.writeHead(status, {"content-type": "application/json; charset=utf-8"});
  response.end(JSON.stringify(body));
}

export function createLocalSanityWebhookServer(options: LocalWebhookOptions): Server {
  if (options.secret.length < 32) {
    throw new Error("SANITY_WEBHOOK_SECRET must contain at least 32 characters");
  }

  return createServer(async (request, response) => {
    if (request.method !== "POST" || request.url !== "/webhook") {
      respond(response, 404, {ok: false, error: "not found"});
      return;
    }

    const rawBody = await readBody(request);
    const signature = request.headers[SIGNATURE_HEADER_NAME];
    const valid =
      typeof signature === "string" &&
      (await isValidSignature(rawBody, signature, options.secret));

    if (!valid) {
      respond(response, 401, {ok: false, error: "invalid signature"});
      return;
    }

    try {
      JSON.parse(rawBody);
    } catch {
      respond(response, 400, {ok: false, error: "invalid JSON"});
      return;
    }

    try {
      await runProtectedBuild(options);
      respond(response, 200, {ok: true, build: "completed"});
    } catch (error) {
      const message = error instanceof Error ? error.message : "build failed";
      respond(response, 500, {ok: false, error: message});
    }
  });
}
