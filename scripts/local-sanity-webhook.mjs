import {spawn} from "node:child_process";
import path from "node:path";
import {createLocalSanityWebhookServer} from "../lib/webhook/local-sanity-webhook.mts";

const secret = process.env.SANITY_WEBHOOK_SECRET;
if (!secret) {
  throw new Error("Set SANITY_WEBHOOK_SECRET before starting the local webhook receiver");
}

const projectDirectory = process.cwd();
const port = Number.parseInt(process.env.LOCAL_SANITY_WEBHOOK_PORT ?? "8787", 10);

function buildPortfolio() {
  return new Promise((resolve, reject) => {
    const child = spawn("npm", ["run", "build"], {
      cwd: projectDirectory,
      env: {...process.env, CONTENT_SOURCE: "sanity-poc"},
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Static build exited with code ${code ?? "unknown"}`));
    });
  });
}

const server = createLocalSanityWebhookServer({
  secret,
  outputDirectory: path.join(projectDirectory, "out"),
  build: buildPortfolio,
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Local signed Sanity webhook listening at http://127.0.0.1:${port}/webhook`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
