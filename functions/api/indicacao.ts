// Recebe o formulário do site (Cloudflare Pages Function em /api/indicacao).
// A indicação é repassada para o Apps Script da planilha Google, que grava a
// linha e envia o e-mail para a imobiliária (docs/google-sheets-apps-script.js).
import { validarIndicacao } from "../../lib/indicacao";

type Contexto = {
  request: Request;
  env: { INDICACAO_WEBHOOK_URL?: string };
};

// Limite simples por IP para evitar spam (por instância do servidor).
const JANELA_MS = 10 * 60 * 1000;
const MAX_POR_JANELA = 5;
const envios = new Map<string, number[]>();

function excedeuLimite(ip: string) {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  recentes.push(agora);
  envios.set(ip, recentes);
  return recentes.length > MAX_POR_JANELA;
}

function json(corpo: unknown, status = 200) {
  return Response.json(corpo, { status });
}

async function enviarWebhook(url: string, dados: object) {
  const resposta = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
    signal: AbortSignal.timeout(20_000),
  });
  if (!resposta.ok) throw new Error(`Webhook respondeu ${resposta.status}`);
  // O Apps Script responde 200 mesmo quando falha (o erro vem no corpo) e,
  // se a implantação não estiver pública, devolve uma página de login em HTML.
  // Só conta como entregue se vier o JSON { ok: true } do script.
  const texto = await resposta.text();
  let retorno: { ok?: boolean; erro?: string } | null = null;
  try {
    retorno = JSON.parse(texto);
  } catch {}
  if (!retorno || retorno.ok !== true) {
    throw new Error(
      `Webhook não confirmou o recebimento: ${retorno?.erro ?? texto.slice(0, 200)}`,
    );
  }
}

export async function onRequestPost({ request, env }: Contexto) {
  let corpo: Record<string, unknown>;
  try {
    corpo = await request.json();
  } catch {
    return json({ erro: "Requisição inválida." }, 400);
  }

  // Campo invisível: só robôs preenchem. Fingimos sucesso e descartamos.
  if (typeof corpo.empresa === "string" && corpo.empresa.trim() !== "") {
    return json({ ok: true });
  }

  const ip = request.headers.get("CF-Connecting-IP") || "local";
  if (excedeuLimite(ip)) {
    return json(
      { erro: "Muitas indicações em pouco tempo. Aguarde alguns minutos e tente novamente." },
      429,
    );
  }

  const { dados, erros } = validarIndicacao(corpo);
  if (Object.keys(erros).length > 0) {
    return json({ erro: "Confira os campos destacados.", erros }, 422);
  }

  if (!env.INDICACAO_WEBHOOK_URL) {
    console.error("[indicação] Configure INDICACAO_WEBHOOK_URL.");
    return json({ erro: "Não foi possível enviar agora. Tente novamente mais tarde." }, 500);
  }

  const recebidaEm = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  try {
    await enviarWebhook(env.INDICACAO_WEBHOOK_URL, { recebidaEm, ...dados });
  } catch (erro) {
    console.error("[indicação] Falha no envio:", erro);
    return json(
      { erro: "Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp." },
      502,
    );
  }

  return json({ ok: true });
}
