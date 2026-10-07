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

Usar os dois é o mais seguro: se um falhar, a indicação não se perde.

## Trocar a foto da casa

Salve a foto em `public/images/` (ex.: `casa.jpg`) e altere `imagemCasa` em
`lib/site.ts`. Ela aparece na seção "A Prosperar" e no fundo do bloco do
formulário.

## Hospedagem

Como existe a parte de servidor (`/api/indicacao`), o site não pode mais ser
exportado como HTML estático. Publique em um serviço que rode Next.js, como a
Vercel (é só importar o repositório).
