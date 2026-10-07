/**
 * Salvar as indicações numa planilha do Google (opcional).
 *
 * 1. Crie uma planilha no Google Sheets.
 * 2. Menu Extensões > Apps Script, apague o conteúdo e cole este arquivo.
 * 3. Clique em Implantar > Nova implantação > tipo "App da Web".
 *    - Executar como: Eu
 *    - Quem pode acessar: Qualquer pessoa
 * 4. Copie a URL gerada e coloque na variável INDICACAO_WEBHOOK_URL.
 */
const COLUNAS = [
  ["recebidaEm", "Recebida em"],
  ["indicadorNome", "Quem indicou"],
  ["indicadorTelefone", "Telefone de quem indicou"],
  ["indicadorEmail", "E-mail de quem indicou"],
  ["indicadorPix", "Chave Pix"],
  ["proprietarioNome", "Proprietário"],
  ["proprietarioTelefone", "Telefone do proprietário"],
  ["imovelEndereco", "Endereço do imóvel"],
  ["imovelTipo", "Tipo"],
  ["imovelValor", "Valor desejado"],
  ["observacoes", "Observações"],
];

function doPost(e) {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS.map((c) => c[1]).concat("Status"));
  }
  const dados = JSON.parse(e.postData.contents);
  aba.appendRow(COLUNAS.map((c) => dados[c[0]] || "").concat("Nova"));
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}
