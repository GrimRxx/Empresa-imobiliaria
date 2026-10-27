// Política de Privacidade do Programa de Indicação.
// Texto escrito a partir do que o site faz de fato (dados do formulário,
// envio por e-mail e Google Planilhas, hospedagem na Netlify, sem cookies de
// rastreamento). Deve ser revisado pela imobiliária antes de publicar.
import { site } from "@/lib/site";

export const politica = {
  titulo: "Política de Privacidade do Programa de Indicação",
  vigencia: "Vigência: a partir de outubro de 2026",
  secoes: [
    {
      id: "quem-somos",
      titulo: "1. Quem é o responsável pelos seus dados",
      itens: [
        `1.1. O controlador dos dados pessoais tratados no Programa de Indicação "Indique um Imóvel e Ganhe" é a ${site.razaoSocial}, nome empresarial da ${site.nome}, inscrita no CNPJ ${site.cnpj}, CRECI/SP ${site.creci}, com endereço na ${site.endereco}.`,
        `1.2. Para qualquer assunto sobre seus dados pessoais, fale com a gente pelo e-mail ${site.email} ou pelo telefone/WhatsApp ${site.telefone}. Esse é o nosso canal de atendimento ao titular de dados.`,
        "1.3. Esta Política explica, de forma simples, quais dados coletamos no Programa, por que coletamos, com quem compartilhamos, por quanto tempo guardamos e quais são os seus direitos, conforme a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD). Ela complementa o Regulamento do Programa.",
      ],
    },
    {
      id: "dados-coletados",
      titulo: "2. Quais dados coletamos",
      itens: [
        "2.1. Do indicador (quem faz a indicação): nome completo, telefone/WhatsApp e, se informados, e-mail e chave Pix. No momento do pagamento, também solicitamos o CPF, necessário para emitir o recibo da bonificação.",
        "2.2. Do proprietário do imóvel indicado: nome e telefone, informados pelo indicador.",
        "2.3. Do imóvel: endereço, tipo, valor aproximado desejado e eventuais observações escritas no formulário.",
        "2.4. Dados técnicos: para proteger o formulário contra envios automáticos (spam), o endereço IP de quem envia é usado temporariamente, apenas em memória, por até 10 minutos, e não é gravado por nós. O provedor de hospedagem pode manter registros técnicos de acesso por questões de segurança e funcionamento.",
        "2.5. Não usamos cookies de publicidade nem ferramentas de rastreamento ou de análise de navegação nesta página.",
        "2.6. O Programa não é destinado a menores de 18 anos, e não coletamos intencionalmente dados de menores.",
      ],
    },
    {
      id: "finalidades",
      titulo: "3. Para que usamos os dados e com qual base legal",
      itens: [
        "3.1. Dados do indicador: para registrar a indicação, entrar em contato com você sobre ela, verificar se ela é válida conforme o Regulamento, pagar a bonificação e emitir o recibo. Base legal: execução do Regulamento do Programa, do qual você participa ao enviar a indicação (art. 7º, V, da LGPD), e cumprimento de obrigações legais e fiscais ligadas ao pagamento (art. 7º, II).",
        "3.2. Dados do proprietário: exclusivamente para entrar em contato com ele e apresentar a proposta de captação do imóvel indicado. Base legal: legítimo interesse da Prosperar Imóveis (art. 7º, IX), considerando que o indicador declara ter a autorização do proprietário para compartilhar esses dados. Se o proprietário não quiser ser contatado, basta nos avisar, e o contato é encerrado.",
        "3.3. Dados do imóvel: para avaliar a captação e preparar a proposta ao proprietário. Base legal: legítimo interesse (art. 7º, IX).",
        "3.4. Dados técnicos: para segurança do formulário e prevenção de fraudes. Base legal: legítimo interesse (art. 7º, IX).",
        "3.5. Não usamos os dados para outras finalidades, não os vendemos e não os usamos para enviar publicidade de terceiros.",
      ],
    },
    {
      id: "compartilhamento",
      titulo: "4. Com quem compartilhamos",
      itens: [
        "4.1. Os dados são acessados apenas pela equipe da Prosperar Imóveis envolvida no Programa, incluindo os corretores responsáveis pelo contato com o proprietário.",
        "4.2. Para o funcionamento do Programa, usamos serviços de terceiros que tratam os dados em nosso nome, seguindo nossas instruções: a Netlify, que hospeda a página e processa o envio do formulário, e o Google, por meio do Gmail e do Google Planilhas, onde as indicações são recebidas e organizadas.",
        "4.3. Esses provedores podem armazenar dados em servidores fora do Brasil, especialmente nos Estados Unidos. Essa transferência internacional é feita com fornecedores que adotam padrões de segurança e proteção de dados compatíveis com a LGPD (art. 33).",
        "4.4. Para o pagamento da bonificação, a chave Pix e os dados necessários são usados junto à instituição financeira que processa a transferência, e o recibo pode ser compartilhado com a nossa contabilidade.",
        "4.5. Também podemos compartilhar dados quando a lei exigir ou por ordem de autoridade competente.",
      ],
    },
    {
      id: "retencao",
      titulo: "5. Por quanto tempo guardamos",
      itens: [
        "5.1. Indicações que não resultarem em captação: guardamos por até 12 meses após o encerramento da análise, para evitar indicações duplicadas e resolver eventuais dúvidas, e depois excluímos.",
        "5.2. Indicações que resultarem em captação e pagamento: os dados do indicador e os recibos são guardados por até 5 anos após o pagamento, para cumprimento de obrigações legais e fiscais.",
        "5.3. Se o proprietário pedir para não ser contatado, seus dados são excluídos, e podemos manter apenas o registro mínimo necessário para respeitar esse pedido.",
        "5.4. Você pode pedir a exclusão dos seus dados antes desses prazos, salvo quando a lei exigir que sejam mantidos.",
      ],
    },
    {
      id: "direitos",
      titulo: "6. Seus direitos",
      itens: [
        "6.1. Como titular dos dados, indicador ou proprietário, você pode, a qualquer momento: a) confirmar se tratamos seus dados; b) acessar seus dados; c) corrigir dados incompletos, inexatos ou desatualizados; d) pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a LGPD; e) pedir a portabilidade dos dados; f) saber com quem compartilhamos seus dados; g) se opor a um tratamento feito com base no legítimo interesse; h) pedir a eliminação dos dados tratados com base no seu consentimento e revogar esse consentimento.",
        `6.2. Para exercer seus direitos, entre em contato pelo e-mail ${site.email} ou pelo telefone/WhatsApp ${site.telefone}. Podemos pedir informações para confirmar sua identidade antes de atender o pedido.`,
        "6.3. Respondemos em até 15 dias a partir do recebimento do pedido.",
        "6.4. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).",
      ],
    },
    {
      id: "seguranca",
      titulo: "7. Segurança",
      itens: [
        "7.1. A página usa conexão criptografada (HTTPS), o formulário tem proteção contra envios automáticos, e o acesso às indicações é restrito à equipe responsável, em contas protegidas por senha.",
        "7.2. Nenhum sistema é totalmente imune a incidentes. Se ocorrer um incidente de segurança que possa trazer risco ou dano relevante aos titulares, comunicaremos os afetados e a ANPD, conforme a LGPD.",
      ],
    },
    {
      id: "alteracoes",
      titulo: "8. Alterações desta Política",
      itens: [
        "8.1. Esta Política pode ser atualizada, por exemplo, se mudarmos a forma de funcionamento do Programa ou os fornecedores que usamos. A versão em vigor é sempre a publicada nesta página, com a data de vigência indicada no topo.",
      ],
    },
  ],
} as const;
