import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { regulamento } from "@/lib/regulamento";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Regulamento e Política de Privacidade | Prosperar Imóveis",
  description:
    "Regras do programa de indicação da Prosperar Imóveis, valores, pagamento e proteção de dados (LGPD).",
};

// Itens como "a) ..." ficam recuados, como no documento.
const ehSubitem = (texto: string) => /^[a-z]\)/.test(texto);

export default function Regulamento() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-neutral-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-2.5">
          <Link href="/" aria-label="Voltar para a página inicial">
            <Image src="/logo-prosperar-imoveis.png" alt={site.nome} width={305} height={90} priority className="h-10 w-auto" />
          </Link>
          <Link href="/" className="text-sm font-semibold text-[#007585] hover:underline">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="bg-white">
        <article className="mx-auto max-w-3xl px-6 py-10 md:py-14">
          <span className="inline-block rounded-full bg-[#009cb4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#007585]">
            Regulamento e privacidade
          </span>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight text-[#3f3f3f] sm:text-3xl">
            {regulamento.titulo}
          </h1>

          <div className="mt-6 space-y-1 rounded-2xl bg-[#f6f6f5] p-5 text-sm text-neutral-600">
            {regulamento.info.map((linha) => (
              <p key={linha}>{linha}</p>
            ))}
          </div>

          <nav aria-label="Índice" className="mt-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#009cb4]">Índice</p>
            <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {regulamento.secoes.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-[#007585] hover:underline">
                    {s.titulo}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-10 space-y-10">
            {regulamento.secoes.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-20 target:rounded-2xl target:bg-[#009cb4]/5 target:p-5 target:ring-1 target:ring-[#009cb4]/20"
              >
                <h2 className="text-lg font-bold text-[#3f3f3f]">{s.titulo}</h2>
                <div className="mt-3 space-y-3 leading-relaxed text-neutral-700">
                  {s.itens.map((item) => (
                    <p key={item} className={ehSubitem(item) ? "pl-5" : undefined}>
                      {item}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-[#009cb4]/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-semibold text-[#3f3f3f]">Conhece alguém vendendo um imóvel?</p>
            <Link href="/#indicar" className="rounded-full bg-[#009cb4] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#007585]">
              Indicar um imóvel
            </Link>
          </div>
        </article>
      </main>

      <footer className="border-t-4 border-[#009cb4] bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-x-4 gap-y-1 px-6 text-sm text-neutral-500">
          <span>© {new Date().getFullYear()} {site.nome}</span>
          <a href={`mailto:${site.email}`} className="hover:text-[#009cb4]">{site.email}</a>
          <span>CRECI {site.creci}</span>
        </div>
      </footer>
    </>
  );
}
