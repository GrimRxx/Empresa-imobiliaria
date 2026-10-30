# Prosperar Imóveis – Página de indicação

Página "Indique um imóvel e ganhe", feita em Next.js + Tailwind CSS e publicada como
Worker no Cloudflare.

## Rodar no computador

```bash
npm install
npm run dev          # só as páginas, em http://localhost:3000
```

Para testar também o envio do formulário, gere o site e rode com o wrangler
(ferramenta do Cloudflare), com a URL da planilha no arquivo `.dev.vars`
(modelo em `.env.example`):

```bash
npm run build
npx wrangler dev
```

## Para onde vão as indicações

O site é estático (pasta `out/`), servido pelo Worker `worker/index.ts`
(configuração em `wrangler.jsonc`). O formulário envia os dados para
`/api/indicacao` (`worker/indicacao.ts`), que valida tudo de novo, bloqueia spam (campo invisível + limite por IP) e repassa a indicação para
o **Apps Script da planilha Google** (`INDICACAO_WEBHOOK_URL`).

O Apps Script (`docs/google-sheets-apps-script.js`, instalado na conta Google da
imobiliária) grava uma linha na planilha (data, quem indicou, telefone,
proprietário, telefone, endereço, tipo, valor desejado, observações e chave Pix)
**e** envia um e-mail com os dados para `EMAIL_DESTINO`. Se um dos dois falhar,
o outro ainda acontece.

Depois de enviar, a pessoa vê na tela: "Indicação enviada! Entraremos em contato
em até 2 dias úteis."

## Trocar a foto da casa

A foto atual é `public/images/casa.jpg`. Para trocar, salve a nova foto em
`public/images/` e altere `imagemCasa` em `lib/site.ts`. Fotos largas
(panorâmicas) ficam melhores, porque a seção mostra a imagem numa faixa larga. Ela aparece na seção "A Prosperar" e no fundo do bloco do
formulário.

## Hospedagem

Cloudflare Workers, ligado a este repositório (Workers & Pages > projeto >
Settings > Build): cada envio para o branch de produção publica o site sozinho.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Node: versão 22 (arquivo `.node-version`)
- Variável (Settings > Variables and Secrets): `INDICACAO_WEBHOOK_URL`, a URL
  do Apps Script
