/**
 * Recebe as indicações do site e grava uma linha por indicação na planilha.
 *
 * COMO INSTALAR (uma vez só):
 * 1. Crie uma planilha no Google Sheets (ex.: "Indicações - Prosperar").
 * 2. Menu Extensões > Apps Script. Apague o que estiver lá e cole este arquivo.
 * 3. Clique em Implantar > Nova implantação > engrenagem > "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 *    Autorize o acesso quando o Google pedir.
 * 4. Copie a "URL do app da Web" (termina em /exec) e cadastre na hospedagem
 *    do site como INDICACAO_WEBHOOK_URL.
 *
 * Se alterar este código depois, use Implantar > Gerenciar implantações >
 * lápis > Versão: "Nova versão" para a URL continuar a mesma.
 *
 * Para aplicar a formatação numa planilha que já tem dados, escolha a função
 * "configurarPlanilha" na barra de cima do editor e clique em Executar.
 */
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

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (aba.getLastRow() === 0) configurarPlanilha();

    const dados = JSON.parse(e.postData.contents);
    const linha = COLUNAS.map(([campo]) =>
      campo === "data" ? new Date() : seguro(dados[campo]),
    );
    aba.appendRow(linha.concat("Nova"));
    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  } finally {
    trava.releaseLock();
  }
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
