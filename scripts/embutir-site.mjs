// Gera worker/site-embutido.gen.js com todos os arquivos de out/ dentro do
// código, para publicar sem o upload de "assets" do Cloudflare (usado por
// wrangler.kangoo.jsonc). Rode depois de "npm run build".
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, extname } from "node:path";

const RAIZ = new URL("../out/", import.meta.url).pathname;
const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
};
const TEXTO = new Set([".html", ".js", ".css", ".txt", ".json", ".svg"]);

function listar(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome);
    return statSync(caminho).isDirectory() ? listar(caminho) : [caminho];
  });
}

const arquivos = {};
for (const caminho of listar(RAIZ)) {
  const ext = extname(caminho).toLowerCase();
  const tipo = TIPOS[ext];
  if (!tipo) throw new Error(`Tipo de arquivo sem mapeamento: ${caminho}`);
  const bytes = readFileSync(caminho);
  arquivos["/" + relative(RAIZ, caminho)] = TEXTO.has(ext)
    ? { tipo, texto: bytes.toString("utf8") }
    : { tipo, base64: bytes.toString("base64") };
}

writeFileSync(
  new URL("../worker/site-embutido.gen.js", import.meta.url),
  `// Gerado por scripts/embutir-site.mjs. Não edite.\nexport default ${JSON.stringify(arquivos)};\n`,
);
console.log(`${Object.keys(arquivos).length} arquivos embutidos`);
