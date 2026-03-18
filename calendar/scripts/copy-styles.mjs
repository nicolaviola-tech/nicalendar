import { cp, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const source = new URL("../src/styles.css", import.meta.url);
const destination = new URL("../dist/styles.css", import.meta.url);
const sourcePath = fileURLToPath(source);
const destinationPath = fileURLToPath(destination);

await mkdir(dirname(destinationPath), { recursive: true });
await cp(sourcePath, destinationPath);
