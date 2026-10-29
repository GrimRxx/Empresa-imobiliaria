# Prosperar Imóveis – Página de indicação

Página "Indique um imóvel e ganhe R$ 100", feita em Next.js + Tailwind CSS.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Em modo de desenvolvimento, se nenhum destino
estiver configurado, as indicações aparecem só no terminal.

## Para onde vão as indicações

O formulário envia os dados para `app/api/indicacao/route.ts`, que valida tudo
de novo no servidor, bloqueia spam (campo invisível + limite por IP) e entrega a
indicação em **um ou nos dois** destinos abaixo. Configure as variáveis na
hospedagem (ex.: Vercel → Settings → Environment Variables) ou num arquivo
`.env.local` (modelo em `.env.example`).

1. **E-mail** – `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
   `INDICACAO_EMAIL_DESTINO`. Cada indicação chega como um e-mail organizado.
2. **Planilha Google** – `INDICACAO_WEBHOOK_URL`. Passo a passo em
   `docs/google-sheets-apps-script.js`.

Configurado com os dois, cada indicação chega no e-mail **e** vira uma linha na
planilha (Data, quem indicou, telefone, proprietário, telefone, endereço, tipo,
valor desejado, observações e chave Pix). Se um dos dois falhar, o outro ainda
recebe e a falha fica registrada no log do servidor.

Depois de enviar, a pessoa vê na tela: "Indicação enviada! Entraremos em contato
em até 2 dias úteis."

## Trocar a foto da casa

A foto atual é `public/images/casa.jpg`. Para trocar, salve a nova foto em
`public/images/` e altere `imagemCasa` em `lib/site.ts`. Fotos largas
(panorâmicas) ficam melhores, porque a seção mostra a imagem numa faixa larga. Ela aparece na seção "A Prosperar" e no fundo do bloco do
formulário.

## Hospedagem

Como existe a parte de servidor (`/api/indicacao`), o site não pode mais ser
exportado como HTML estático. Ele está publicado na Netlify, que publica de novo a
cada envio para este branch. Commits com `[skip netlify]` na mensagem não são
publicados (economiza créditos); o próximo envio sem essa marca publica tudo.
