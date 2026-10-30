// Worker do Cloudflare: serve as páginas estáticas (pasta out/) e recebe o
// formulário em /api/indicacao.
import { receberIndicacao, type Env } from "./indicacao";

export default {
  async fetch(request: Request, env: Env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/indicacao") {
      if (request.method !== "POST") {
        return new Response("Método não permitido.", { status: 405, headers: { Allow: "POST" } });
      }
      return receberIndicacao(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
