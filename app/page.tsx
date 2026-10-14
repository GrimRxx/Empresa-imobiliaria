import Image from "next/image";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiCheck } from "react-icons/fi";
import IndicacaoForm from "@/components/IndicacaoForm";
import { site } from "@/lib/site";

const passos = [
  {
    titulo: "Indique",
    texto:
      "Preencha o formulário com seus dados, os dados de quem está vendendo o imóvel e as informações do imóvel.",
  },
  {
    titulo: "Nós entramos em contato",
    texto:
      "Em até 48h nossa equipe fala com o proprietário, apresenta a proposta e busca a autorização para anunciar (captação) o imóvel.",
  },
  {
    titulo: "Captação confirmada, você recebe",
    texto:
      "Se o proprietário autorizar a Prosperar Imóveis a anunciar o imóvel, sua indicação é paga — mesmo que a venda ainda não tenha acontecido.",
  },
];

const valores = ["Séria", "Moderna", "Sólida", "Sábia"];

const vantagens = [
  "Você não precisa vender nada, só indicar",
  "Pagamento garantido após a captação",
  "Sem limite de indicações",
];

const duvidas = [
  {
    pergunta: "Preciso ser corretor para indicar um imóvel?",
    resposta:
      "Não. Qualquer pessoa pode indicar um imóvel que um amigo, parente ou conhecido esteja vendendo.",
  },
  {
    pergunta: "Quando eu recebo a comissão?",
    resposta: `Você recebe assim que o proprietário autorizar formalmente a ${site.nome} a anunciar o imóvel para venda (captação). Não é necessário esperar a venda ser concluída.`,
  },
  {
    pergunta: "E se o proprietário não quiser fechar com vocês?",
    resposta:
      "Se não conseguirmos autorização para anunciar o imóvel, a indicação não gera pagamento. Por isso é importante que o proprietário esteja de fato buscando vender e aberto ao contato.",
  },
  {
    pergunta: "Posso indicar mais de um imóvel?",
    resposta:
      "Sim, não há limite. Cada imóvel captado a partir da sua indicação gera uma nova comissão.",
  },
  {
    pergunta: "Como vou saber se minha indicação virou captação?",
    resposta:
      "Nossa equipe entra em contato com você pelo telefone ou e-mail informado no formulário assim que houver retorno do proprietário.",
  },
];

function Selo({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-[#009cb4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#007585]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-30">
        <div className="bg-[#ececea] text-sm text-neutral-700">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2">
            <div className="flex items-center gap-5">
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-[#009cb4]">
                <FaWhatsapp className="h-4 w-4" />
                {site.telefone}
              </a>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-[#009cb4]">
                <FaInstagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium hover:text-[#009cb4]">
                <FaFacebook className="h-4 w-4" />
                <span className="hidden sm:inline">Facebook</span>
              </a>
            </div>
            <span className="font-bold text-[#009cb4]">CRECI {site.creci}</span>
          </div>
        </div>
        <div className="border-b border-neutral-100 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
            <a href="#topo" aria-label="Início">
              <Image src="/logo-prosperar-imoveis.png" alt={site.nome} width={305} height={90} priority className="h-10 w-auto sm:h-12" />
            </a>
            <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-600 md:flex">
              <a href="#como-funciona" className="hover:text-neutral-900">Como funciona</a>
              <a href="#sobre" className="hover:text-neutral-900">A Prosperar</a>
              <a href="#duvidas" className="hover:text-neutral-900">Dúvidas</a>
            </nav>
            <a href="#indicar" className="rounded-full bg-[#009cb4] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#007585]">
              Indicar imóvel
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Primeira tela: só o essencial */}
        <section id="topo" className="relative scroll-mt-32 overflow-hidden bg-linear-to-b from-[#eaf7f9] to-white">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#009cb4]/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#17c3d6]/10 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-2 md:py-24">
            <div>
              <Selo>Programa de indicação</Selo>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[#3f3f3f] sm:text-5xl">
                Conhece alguém vendendo um imóvel? Indique e ganhe{" "}
                <span className="text-[#009cb4]">{site.valorIndicacao}</span>.
              </h1>
              <p className="mt-5 text-lg text-neutral-600">
                Você indica e a gente cuida de tudo. Recebe assim que o imóvel
                for autorizado para anúncio — sem esperar a venda.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <a href="#indicar" className="rounded-full bg-[#009cb4] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#009cb4]/25 transition hover:bg-[#007585]">
                  Indicar um imóvel agora
                </a>
                <a href="#como-funciona" className="text-base font-semibold text-[#007585] underline-offset-4 hover:underline">
                  Como funciona
                </a>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-tl-[4rem] rounded-br-[4rem] rounded-tr-2xl rounded-bl-2xl shadow-2xl shadow-[#007585]/15">
                <Image src="/images/hero-interior.jpg" alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white px-5 py-4 shadow-xl shadow-black/10 ring-1 ring-neutral-100">
                <p className="text-2xl font-extrabold text-[#009cb4]">{site.valorIndicacao}</p>
                <p className="text-sm text-neutral-600">por captação confirmada</p>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="relative scroll-mt-32 overflow-hidden bg-white py-16 md:py-24">
          <div className="relative mx-auto max-w-6xl px-6">
            {/* Foto em faixa larga, no formato panorâmico dela */}
            <div className="relative">
              <div aria-hidden="true" className="absolute -inset-3 rounded-tl-[4.5rem] rounded-br-[4.5rem] rounded-tr-3xl rounded-bl-3xl border border-[#009cb4]/25 sm:-inset-5" />
              <div className="relative aspect-[16/10] overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-2xl rounded-bl-2xl shadow-2xl shadow-[#007585]/15 sm:aspect-[762/258] sm:rounded-tl-[4rem] sm:rounded-br-[4rem]">
                <Image src={site.imagemCasa} unoptimized={site.imagemCasa.endsWith(".svg")} alt="Casas de alto padrão com fachada em tijolinho e jardim" fill quality={90} sizes="(min-width: 1152px) 1104px, 100vw" className="object-cover object-[30%_50%]" />
                <div className="absolute inset-0 bg-linear-to-t from-[#007585]/25 via-transparent to-transparent" />
              </div>
            </div>
            <div className="mt-12 grid items-start gap-10 md:mt-16 md:grid-cols-2 md:gap-14">
              <div>
                <Selo>A Prosperar Imóveis</Selo>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#3f3f3f] sm:text-4xl">
                  Melhor que enriquecer,{" "}
                  <span className="text-[#009cb4]">prosperar é crescer junto</span>
                </h2>
                <p className="mt-4 text-neutral-600">
                  Fazemos parte do Grupo Prosperar, que administra patrimônio,
                  empreendimentos e negócios com solidez e visão de longo prazo.
                  Nosso programa de indicação é uma forma de fazer quem está perto
                  da gente prosperar também.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 md:mt-12">
                {valores.map((v) => (
                  <div key={v} className="rounded-xl border border-[#009cb4]/15 bg-[#009cb4]/5 px-4 py-3 text-sm font-semibold text-[#007585]">
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-32 bg-[#f6f6f5] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#009cb4]">Passo a passo</span>
              <h2 className="mt-2 text-3xl font-extrabold text-[#3f3f3f] sm:text-4xl">Como funciona a indicação</h2>
              <p className="mt-3 text-neutral-600">
                Simples assim: você indica, a gente cuida do resto. O pagamento é
                garantido pela captação — a venda em si não precisa ter sido concluída.
              </p>
            </div>
            <div className="relative mt-14 grid gap-8 md:grid-cols-3">
              <div aria-hidden="true" className="absolute left-0 right-0 top-8 hidden h-px bg-linear-to-r from-transparent via-neutral-300 to-transparent md:block" />
              {passos.map((p, i) => (
                <div key={p.titulo} className="relative">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#009cb4] text-2xl font-extrabold text-white shadow-lg shadow-[#009cb4]/25">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-[#3f3f3f]">{p.titulo}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{p.texto}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-white p-6 text-sm text-[#3f3f3f] sm:flex-row sm:items-center">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#009cb4]/10 text-base font-bold text-[#009cb4]">!</span>
              <p>
                <strong>Importante:</strong> este programa é destinado a pessoas
                físicas que queiram indicar imóveis para a {site.nome} captar para
                venda. Não é necessário ser corretor para indicar — basta conhecer
                alguém que esteja vendendo um imóvel.
              </p>
            </div>
          </div>
        </section>

        <section id="indicar" className="scroll-mt-32 bg-white py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid overflow-hidden rounded-[2rem] shadow-xl shadow-black/5 ring-1 ring-neutral-100 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
              <div className="relative overflow-hidden bg-[#007585] p-8 sm:p-10">
                <Image src={site.imagemCasa} unoptimized={site.imagemCasa.endsWith(".svg")} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-linear-to-br from-[#009cb4]/95 via-[#00879c]/92 to-[#005d6b]/95" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10" />
                <div className="relative flex h-full flex-col justify-center">
                  <h2 className="text-3xl font-extrabold text-white">Indicação simples</h2>
                  <span className="mt-3 inline-block w-fit rounded-full bg-white px-4 py-1.5 text-sm font-bold text-[#007585]">
                    {site.valorIndicacao} por captação confirmada
                  </span>
                  <ul className="mt-8 space-y-4">
                    {vantagens.map((v) => (
                      <li key={v} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                          <FiCheck className="h-3.5 w-3.5 text-white" />
                        </span>
                        <span className="text-white">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative bg-white p-6 sm:p-10">
                <IndicacaoForm />
              </div>
            </div>
          </div>
        </section>

        <section id="duvidas" className="scroll-mt-32 bg-[#f6f6f5] py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#009cb4]">Tire suas dúvidas</span>
            <h2 className="mt-2 text-3xl font-extrabold text-[#3f3f3f]">Dúvidas frequentes</h2>
            <div className="mt-8 space-y-3">
              {duvidas.map((d) => (
                <details key={d.pergunta} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200 open:ring-[#009cb4]/30">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-[#3f3f3f] marker:content-none">
                    {d.pergunta}
                    <span className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#009cb4]/10 text-base text-[#009cb4] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-neutral-600">{d.resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-[#009cb4] bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
          <Image src="/logo-prosperar-imoveis.png" alt={site.nome} width={305} height={90} className="h-11 w-auto" />
          <div className="flex flex-col gap-1 text-sm text-neutral-500 sm:items-end">
            <p>© {new Date().getFullYear()} {site.nome}. Todos os direitos reservados.</p>
            <div className="flex flex-wrap gap-4">
              <span>{site.telefone}</span>
              <span>{site.email}</span>
              <span>CRECI {site.creci}</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
