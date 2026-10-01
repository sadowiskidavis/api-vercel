
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_DIR = __dirname;
const OUTPUT_FILE = path.join(PROJECT_DIR, "project-content.txt");

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".cache",
  "project-content.txt",
]);

const IGNORE_FILES = new Set([
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
]);

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".mp3",
  ".mp4",
  ".wav",
  ".avi",
  ".mov",
  ".pdf",
  ".zip",
  ".rar",
  ".7z",
  ".exe",
  ".dll",
  ".woff",
  ".woff2",
  ".ttf",
  ".otf",
]);

function isBinary(filePath) {
  return BINARY_EXTENSIONS.has(
    path.extname(filePath).toLowerCase()
  );
}

function getFiles(dir) {
  const files = [];

  for (const entry of fs.readdirSync(dir, {
    withFileTypes: true,
  })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        files.push(...getFiles(fullPath));
      }

      continue;
    }

    if (IGNORE_FILES.has(entry.name)) {
      continue;
    }

    if (isBinary(fullPath)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

function main() {
  console.log("Lendo projeto...");
  console.log(`Diretório: ${PROJECT_DIR}`);

  const files = getFiles(PROJECT_DIR);

  let output = "";

  for (const file of files) {
    const relativePath = path.relative(PROJECT_DIR, file);

    try {
      const content = fs.readFileSync(file, "utf8");

      output += "\n";
      output += "=".repeat(100);
      output += "\n";
      output += `ARQUIVO: ${relativePath}`;
      output += "\n";
      output += "=".repeat(100);
      output += "\n\n";
      output += content;
      output += "\n\n";
    } catch (error) {
      console.warn(`Não foi possível ler: ${relativePath}`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, output, "utf8");

  console.log("");
  console.log("========================================");
  console.log("PROJETO EXPORTADO COM SUCESSO!");
  console.log("========================================");
  console.log(`Arquivos lidos: ${files.length}`);
  console.log(`Arquivo gerado: ${OUTPUT_FILE}`);
}

main();
