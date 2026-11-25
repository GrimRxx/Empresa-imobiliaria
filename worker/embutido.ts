// Worker da conta onde está o domínio (wrangler.kangoo.jsonc): serve as
// páginas embutidas por scripts/embutir-site.mjs e recebe o formulário em
// /api/indicacao, como worker/index.ts faz com a pasta out/.
import { receberIndicacao, type Env } from "./indicacao";
// @ts-expect-error arquivo gerado no deploy
import arquivos from "./site-embutido.gen.js";

type Arquivo = { tipo: string; texto?: string; base64?: string };
const site = arquivos as Record<string, Arquivo>;

function corpo(a: Arquivo) {
  if (a.texto !== undefined) return a.texto;
  return Uint8Array.from(atob(a.base64!), (c) => c.charCodeAt(0));
}

function responder(a: Arquivo, caminho: string, status = 200) {
  const cache = caminho.startsWith("/_next/static/")
    ? "public, max-age=31536000, immutable"
    : "public, max-age=0, must-revalidate";
  return new Response(corpo(a), {
    status,
    headers: { "Content-Type": a.tipo, "Cache-Control": cache },
  });
}

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/indicacao") {
      if (request.method !== "POST") {
        return new Response("Método não permitido.", { status: 405, headers: { Allow: "POST" } });
      }
      return receberIndicacao(request, env);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Método não permitido.", { status: 405 });
    }
    const limpo = pathname.replace(/\/+$/, "") || "/";
    const candidatos = limpo === "/" ? ["/index.html"] : [limpo, `${limpo}.html`, `${limpo}/index.html`];
    for (const c of candidatos) {
      if (site[c]) return responder(site[c], c);
    }
    return responder(site["/404.html"], "/404.html", 404);
  },
};
