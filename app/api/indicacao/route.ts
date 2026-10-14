import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { validarIndicacao, type Indicacao } from "@/lib/indicacao";
import { site } from "@/lib/site";

export const runtime = "nodejs";

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

const rotulos: [keyof Indicacao, string][] = [
  ["indicadorNome", "Nome"],
  ["indicadorTelefone", "Telefone / WhatsApp"],
  ["indicadorEmail", "E-mail"],
  ["indicadorPix", "Chave Pix"],
  ["proprietarioNome", "Nome do proprietário"],
  ["proprietarioTelefone", "Telefone do proprietário"],
  ["imovelEndereco", "Endereço"],
  ["imovelTipo", "Tipo"],
  ["imovelValor", "Valor desejado"],
  ["observacoes", "Observações"],
];

const secoes: { titulo: string; campos: (keyof Indicacao)[] }[] = [
  {
    titulo: "Quem indicou",
    campos: ["indicadorNome", "indicadorTelefone", "indicadorEmail", "indicadorPix"],
  },
  { titulo: "Proprietário", campos: ["proprietarioNome", "proprietarioTelefone"] },
  {
    titulo: "Imóvel",
    campos: ["imovelEndereco", "imovelTipo", "imovelValor", "observacoes"],
  },
];

function escaparHtml(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rotulo(campo: keyof Indicacao) {
  return rotulos.find(([c]) => c === campo)?.[1] ?? campo;
}

function montarEmail(d: Indicacao, recebidaEm: string) {
  const texto = secoes
    .map(
      (s) =>
        `${s.titulo.toUpperCase()}\n` +
        s.campos.map((c) => `${rotulo(c)}: ${d[c] || "-"}`).join("\n"),
    )
    .join("\n\n");

  const html = `
    <div style="font-family:Arial,sans-serif;color:#3f3f3f;max-width:600px">
      <h2 style="color:#009cb4;margin:0 0 4px">Nova indicação de imóvel</h2>
      <p style="margin:0 0 20px;color:#777;font-size:13px">Recebida em ${recebidaEm}</p>
      ${secoes
        .map(
          (s) => `
        <h3 style="margin:20px 0 8px;font-size:15px">${s.titulo}</h3>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          ${s.campos
            .map(
              (c) => `<tr>
                <td style="padding:6px 8px;border-bottom:1px solid #eee;color:#777;width:180px">${rotulo(c)}</td>
                <td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:pre-wrap">${escaparHtml(d[c] as string) || "-"}</td>
              </tr>`,
            )
            .join("")}
        </table>`,
        )
        .join("")}
    </div>`;

  return { texto: `Nova indicação de imóvel (${recebidaEm})\n\n${texto}`, html };
}

async function enviarEmail(d: Indicacao, recebidaEm: string) {
  const port = Number(process.env.SMTP_PORT || 465);
  const transporte = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  const { texto, html } = montarEmail(d, recebidaEm);
  await transporte.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.INDICACAO_EMAIL_DESTINO || site.email,
    replyTo: d.indicadorEmail || undefined,
    subject: `Nova indicação: ${d.imovelTipo} – ${d.imovelEndereco}`.slice(0, 150),
    text: texto,
    html,
  });
}

async function enviarWebhook(d: Indicacao, recebidaEm: string) {
  const resposta = await fetch(process.env.INDICACAO_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recebidaEm, ...d }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!resposta.ok) throw new Error(`Webhook respondeu ${resposta.status}`);
  // O Apps Script responde 200 mesmo quando falha (o erro vem no corpo) e,
  // se a implantação não estiver pública, devolve uma página de login em HTML.
  // Só conta como entregue se vier o JSON { ok: true } do script.
  const texto = await resposta.text();
  let json: { ok?: boolean; erro?: string } | null = null;
  try {
    json = JSON.parse(texto);
  } catch {}
  if (!json || json.ok !== true) {
    throw new Error(
      `Webhook não confirmou o recebimento: ${json?.erro ?? texto.slice(0, 200)}`,
    );
  }
}

export async function POST(request: Request) {
  let corpo: Record<string, unknown>;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ erro: "Requisição inválida." }, { status: 400 });
  }

  // Campo invisível: só robôs preenchem. Fingimos sucesso e descartamos.
  if (typeof corpo.empresa === "string" && corpo.empresa.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (excedeuLimite(ip)) {
    return NextResponse.json(
      { erro: "Muitas indicações em pouco tempo. Aguarde alguns minutos e tente novamente." },
      { status: 429 },
    );
  }

  const { dados, erros } = validarIndicacao(corpo);
  if (Object.keys(erros).length > 0) {
    return NextResponse.json(
      { erro: "Confira os campos destacados.", erros },
      { status: 422 },
    );
  }

  const recebidaEm = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const destinos: Promise<void>[] = [];
  if (process.env.SMTP_HOST) destinos.push(enviarEmail(dados, recebidaEm));
  if (process.env.INDICACAO_WEBHOOK_URL) destinos.push(enviarWebhook(dados, recebidaEm));

  if (destinos.length === 0) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[indicação] Nenhum destino configurado. Dados recebidos:", dados);
      return NextResponse.json({ ok: true });
    }
    console.error("[indicação] Configure SMTP_HOST ou INDICACAO_WEBHOOK_URL.");
    return NextResponse.json(
      { erro: "Não foi possível enviar agora. Tente novamente mais tarde." },
      { status: 500 },
    );
  }

  const resultados = await Promise.allSettled(destinos);
  const falhas = resultados.filter((r) => r.status === "rejected");
  falhas.forEach((f) => console.error("[indicação] Falha no envio:", f.reason));

  // Basta um destino ter recebido para a indicação não se perder.
  if (falhas.length === resultados.length) {
    return NextResponse.json(
      { erro: "Não foi possível enviar agora. Tente novamente ou fale com a gente pelo WhatsApp." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
