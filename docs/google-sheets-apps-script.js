/**
 * Recebe as indicações do site, grava uma linha por indicação na planilha e
 * envia um e-mail com os dados para a imobiliária (EMAIL_DESTINO).
 *
 * COMO INSTALAR (uma vez só, logado na conta Google da imobiliária):
 * 1. Crie uma planilha no Google Sheets (ex.: "Indicações - Prosperar").
 * 2. Menu Extensões > Apps Script. Apague o que estiver lá e cole este arquivo.
 *    Confira o EMAIL_DESTINO logo abaixo.
 * 3. Escolha a função "testarEmail" na barra de cima e clique em Executar.
 *    Autorize o acesso quando o Google pedir (planilha e envio de e-mail).
 *    Deve chegar um e-mail de teste no EMAIL_DESTINO.
 * 4. Clique em Implantar > Nova implantação > engrenagem > "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 5. Copie a "URL do app da Web" (termina em /exec) e cadastre na hospedagem
 *    do site como INDICACAO_WEBHOOK_URL.
 *
 * Se alterar este código depois, use Implantar > Gerenciar implantações >
 * lápis > Versão: "Nova versão" para a URL continuar a mesma.
 *
 * Para aplicar a formatação numa planilha que já tem dados, escolha a função
 * "configurarPlanilha" na barra de cima do editor e clique em Executar.
 */
// Quem recebe o e-mail de cada indicação (mais de um: separe por vírgula).
const EMAIL_DESTINO = "contato@imoveisprosperar.com.br";
const NOME_REMETENTE = "Site Prosperar Imóveis";

const COLUNAS = [
  // [campo enviado pelo site, título da coluna, largura em pixels]
  ["data", "Data", 125],
  ["indicadorNome", "Quem indicou", 170],
  ["indicadorTelefone", "Telefone de quem indicou", 150],
  ["proprietarioNome", "Proprietário", 170],
  ["proprietarioTelefone", "Telefone do proprietário", 150],
  ["imovelEndereco", "Endereço", 250],
  ["imovelTipo", "Tipo de imóvel", 120],
  ["imovelValor", "Valor desejado", 120],
  ["observacoes", "Observações", 250],
  ["indicadorPix", "Chave Pix", 180],
  ["indicadorEmail", "E-mail de quem indicou", 210],
];

const SITUACOES = [
  // [opção, cor de fundo, cor do texto]
  ["Nova", "#d9f2f6", "#007585"],
  ["Em contato", "#fff4cc", "#8a6d00"],
  ["Captado", "#dcf5e3", "#1e7b3a"],
  ["Pago", "#1e7b3a", "#ffffff"],
  ["Não captado", "#eeeeee", "#777777"],
];

const AZUL = "#009cb4";
const TOTAL_COLUNAS = COLUNAS.length + 1; // + Situação

// Grava como texto, do jeito que foi digitado: impede que vire fórmula
// e que números (CPF na chave Pix, valores) percam zeros ou formatação.
function seguro(valor) {
  const texto = String(valor || "");
  return /^[=+\-@]/.test(texto) || /^[\d\s.,()\/-]+$/.test(texto)
    ? "'" + texto
    : texto;
}

function configurarPlanilha() {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  aba.setName("Indicações");

  // Cabeçalho
  aba
    .getRange(1, 1, 1, TOTAL_COLUNAS)
    .setValues([COLUNAS.map((c) => c[1]).concat("Situação")])
    .setBackground(AZUL)
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setVerticalAlignment("middle")
    .setWrap(true);
  aba.setRowHeight(1, 40);
  aba.setFrozenRows(1);

  // Larguras
  COLUNAS.forEach((c, i) => aba.setColumnWidth(i + 1, c[2]));
  aba.setColumnWidth(TOTAL_COLUNAS, 130);

  // Linhas de dados: texto quebra em vez de cortar, alinhado ao centro da altura
  const linhas = aba.getMaxRows() - 1;
  const dados = aba.getRange(2, 1, linhas, TOTAL_COLUNAS);
  dados
    .setVerticalAlignment("middle")
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setFontWeight("normal");
  aba.getRange(2, 1, linhas, 1).setNumberFormat("dd/MM/yyyy HH:mm");
  aba.getRange(2, 1, linhas, 1).setHorizontalAlignment("center");
  aba.getRange(2, TOTAL_COLUNAS, linhas, 1).setHorizontalAlignment("center");

  // Linhas zebradas
  aba.getBandings().forEach((b) => b.remove());
  aba
    .getRange(1, 1, aba.getMaxRows(), TOTAL_COLUNAS)
    .applyRowBanding()
    .setHeaderRowColor(AZUL)
    .setFirstRowColor("#ffffff")
    .setSecondRowColor("#f1f9fb");

  // Situação: lista de opções com uma cor para cada
  const situacao = aba.getRange(2, TOTAL_COLUNAS, linhas, 1);
  situacao.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(SITUACOES.map((s) => s[0]), true)
      .setAllowInvalid(true)
      .build(),
  );
  aba.setConditionalFormatRules(
    SITUACOES.map(([texto, fundo, cor]) =>
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(texto)
        .setBackground(fundo)
        .setFontColor(cor)
        .setBold(true)
        .setRanges([situacao])
        .build(),
    ),
  );

  aba.setHiddenGridlines(true);
}

function gravarNaPlanilha(dados) {
  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (aba.getLastRow() === 0) configurarPlanilha();
    const linha = COLUNAS.map(([campo]) =>
      campo === "data" ? new Date() : seguro(dados[campo]),
    );
    aba.appendRow(linha.concat("Nova"));
  } finally {
    trava.releaseLock();
  }
}

const SECOES_EMAIL = [
  ["Quem indicou", [
    ["indicadorNome", "Nome"],
    ["indicadorTelefone", "Telefone / WhatsApp"],
    ["indicadorEmail", "E-mail"],
    ["indicadorPix", "Chave Pix"],
  ]],
  ["Proprietário", [
    ["proprietarioNome", "Nome do proprietário"],
    ["proprietarioTelefone", "Telefone do proprietário"],
  ]],
  ["Imóvel", [
    ["imovelEndereco", "Endereço"],
    ["imovelTipo", "Tipo"],
    ["imovelValor", "Valor desejado"],
    ["observacoes", "Observações"],
  ]],
];

function escaparHtml(texto) {
  return String(texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function enviarEmail(dados) {
  const recebidaEm = dados.recebidaEm || new Date().toLocaleString("pt-BR");
  const texto = SECOES_EMAIL.map(([titulo, campos]) =>
    titulo.toUpperCase() + "\n" +
    campos.map(([c, rotulo]) => rotulo + ": " + (dados[c] || "-")).join("\n"),
  ).join("\n\n");
  const html =
    '<div style="font-family:Arial,sans-serif;color:#3f3f3f;max-width:600px">' +
    '<h2 style="color:' + AZUL + ';margin:0 0 4px">Nova indicação de imóvel</h2>' +
    '<p style="margin:0 0 20px;color:#777;font-size:13px">Recebida em ' + escaparHtml(recebidaEm) + "</p>" +
    SECOES_EMAIL.map(([titulo, campos]) =>
      '<h3 style="margin:20px 0 8px;font-size:15px">' + titulo + "</h3>" +
      '<table style="border-collapse:collapse;width:100%;font-size:14px">' +
      campos.map(([c, rotulo]) =>
        '<tr><td style="padding:6px 8px;border-bottom:1px solid #eee;color:#777;width:180px">' + rotulo + "</td>" +
        '<td style="padding:6px 8px;border-bottom:1px solid #eee;white-space:pre-wrap">' + (escaparHtml(dados[c]) || "-") + "</td></tr>",
      ).join("") +
      "</table>",
    ).join("") +
    '<p style="margin:24px 0 0;color:#777;font-size:12px">Esta indicação também foi gravada na planilha.</p>' +
    "</div>";

  const opcoes = {
    to: EMAIL_DESTINO,
    subject: ("Nova indicação: " + dados.imovelTipo + " – " + dados.imovelEndereco).slice(0, 150),
    body: "Nova indicação de imóvel (" + recebidaEm + ")\n\n" + texto,
    htmlBody: html,
    name: NOME_REMETENTE,
  };
  if (dados.indicadorEmail) opcoes.replyTo = dados.indicadorEmail;
  MailApp.sendEmail(opcoes);
}

function doPost(e) {
  let dados;
  try {
    dados = JSON.parse(e.postData.contents);
  } catch (erro) {
    return resposta({ ok: false, erro: "Dados inválidos." });
  }

  // Basta um dos dois funcionar para a indicação não se perder.
  const erros = [];
  try {
    gravarNaPlanilha(dados);
  } catch (erro) {
    erros.push("planilha: " + erro);
  }
  try {
    enviarEmail(dados);
  } catch (erro) {
    erros.push("e-mail: " + erro);
  }
  if (erros.length) console.error(erros.join(" | "));
  return resposta(erros.length < 2 ? { ok: true, avisos: erros } : { ok: false, erro: erros.join(" | ") });
}

// Rode pelo editor (Executar) para autorizar e conferir o e-mail.
function testarEmail() {
  enviarEmail({
    recebidaEm: new Date().toLocaleString("pt-BR"),
    indicadorNome: "Teste do site",
    indicadorTelefone: "(14) 99999-9999",
    proprietarioNome: "Proprietário de teste",
    proprietarioTelefone: "(14) 98888-8888",
    imovelEndereco: "Rua de Teste, 123",
    imovelTipo: "Casa",
    observacoes: "E-mail de teste. Pode apagar.",
  });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
