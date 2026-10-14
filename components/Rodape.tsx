import Image from "next/image";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FiMail, FiMapPin } from "react-icons/fi";
import { site } from "@/lib/site";

// Rodapé no estilo do site da Prosperar Construtora: fundo azul-petróleo,
// mapa do site e contatos em cartões.
const mapaDoSite = [
  { href: "/#como-funciona", texto: "Como funciona" },
  { href: "/#sobre", texto: "A Prosperar" },
  { href: "/#indicar", texto: "Indicar imóvel" },
  { href: "/#duvidas", texto: "Dúvidas" },
  { href: site.regulamento, texto: "Regulamento" },
  { href: site.politicaPrivacidade, texto: "Política de Privacidade" },
];

const redes = [
  { href: site.instagram, rotulo: "Instagram", Icone: FaInstagram },
  { href: site.facebook, rotulo: "Facebook", Icone: FaFacebookF },
  { href: site.whatsapp, rotulo: "WhatsApp", Icone: FaWhatsapp },
];

const contatos = [
  { href: site.whatsapp, rotulo: "WhatsApp", valor: site.telefone, Icone: FaWhatsapp, externo: true },
  { href: `mailto:${site.email}`, rotulo: "E-mail", valor: site.email, Icone: FiMail, externo: false },
  { href: site.mapa, rotulo: "Endereço", valor: site.endereco, Icone: FiMapPin, externo: true },
];

const titulo = "text-sm font-bold uppercase tracking-[0.2em] text-white";

export default function Rodape() {
  return (
    <footer className="bg-linear-to-b from-[#245a6b] to-[#173b48] text-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 md:grid-cols-[1.2fr_0.8fr_1.2fr] md:gap-10 md:py-16">
        <div>
          <Image src="/logo-prosperar-imoveis-dark.png" alt={site.nome} width={305} height={90} className="h-12 w-auto" />
          <p className="mt-6 text-xl font-medium italic">Prosperar é crescer junto.</p>
          <p className="mt-4 leading-relaxed text-white/70">
            A {site.nome} faz parte do Grupo Prosperar, de Botucatu, SP. Com o
            programa de indicação, quem está perto da gente também prospera.
          </p>
          <div className="mt-6 flex gap-3">
            {redes.map(({ href, rotulo, Icone }) => (
              <a
                key={rotulo}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={rotulo}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:border-[#17c3d6] hover:text-[#17c3d6]"
              >
                <Icone className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Mapa do site">
          <p className={titulo}>Mapa do site</p>
          <ul className="mt-6 space-y-4">
            {mapaDoSite.map(({ href, texto }) => (
              <li key={href}>
                <a href={href} className="text-sm font-semibold uppercase tracking-[0.12em] text-white/60 transition hover:text-white">
                  {texto}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          <p className={titulo}>Contato</p>
          <ul className="mt-6 space-y-3">
            {contatos.map(({ href, rotulo, valor, Icone, externo }) => (
              <li key={rotulo}>
                <a
                  href={href}
                  {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:gap-4 sm:px-5 transition hover:border-white/25 hover:bg-white/10"
                >
                  <Icone className="mt-1 h-5 w-5 shrink-0 text-[#e3c48a]" />
                  <span className="min-w-0">
                    <span className="block text-xs font-bold uppercase tracking-[0.15em] text-white/50">{rotulo}</span>
                    <span className="mt-0.5 block text-[13px] font-medium [overflow-wrap:anywhere] min-[380px]:text-sm sm:text-base">{valor}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nome} · {site.razaoSocial} CNPJ {site.cnpj}. CRECI {site.creci}.
            Todos os direitos reservados.
          </p>
          <a href={site.politicaPrivacidade} className="shrink-0 hover:text-white">
            Política de Privacidade
          </a>
        </div>
      </div>
    </footer>
  );
}
