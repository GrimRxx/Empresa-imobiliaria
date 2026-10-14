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
 * editar > "Nova versão" para a URL continuar a mesma.
 */
const COLUNAS = [
  ["data", "Data"],
  ["indicadorNome", "Quem indicou"],
  ["indicadorTelefone", "Telefone de quem indicou"],
  ["proprietarioNome", "Proprietário"],
  ["proprietarioTelefone", "Telefone do proprietário"],
  ["imovelEndereco", "Endereço"],
  ["imovelTipo", "Tipo de imóvel"],
  ["imovelValor", "Valor desejado"],
  ["observacoes", "Observações"],
  ["indicadorPix", "Chave Pix"],
  ["indicadorEmail", "E-mail de quem indicou"],
];

// Impede que um texto digitado no formulário vire fórmula na planilha.
function seguro(valor) {
  const texto = String(valor || "");
  return /^[=+\-@]/.test(texto) ? "'" + texto : texto;
}

function doPost(e) {
  const trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    const aba = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (aba.getLastRow() === 0) {
      aba.appendRow(COLUNAS.map((c) => c[1]).concat("Situação"));
      aba.getRange(1, 1, 1, COLUNAS.length + 1).setFontWeight("bold");
      aba.setFrozenRows(1);
    }
    const dados = JSON.parse(e.postData.contents);
    const linha = COLUNAS.map(([campo]) =>
      campo === "data" ? new Date() : seguro(dados[campo]),
    );
    aba.appendRow(linha.concat("Nova"));
    aba.getRange(aba.getLastRow(), 1).setNumberFormat("dd/MM/yyyy HH:mm");
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
