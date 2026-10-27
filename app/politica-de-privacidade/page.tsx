import type { Metadata } from "next";
import DocumentoLegal from "@/components/DocumentoLegal";
import { politica } from "@/lib/politica";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade | Prosperar Imóveis",
  description:
    "Como a Prosperar Imóveis trata os dados pessoais do programa de indicação, conforme a LGPD.",
};

export default function PoliticaDePrivacidade() {
  return (
    <DocumentoLegal
      selo="Privacidade · LGPD"
      titulo={politica.titulo}
      info={[politica.vigencia, `${site.razaoSocial} · CNPJ ${site.cnpj}`, `Contato: ${site.email} | ${site.telefone}`]}
      secoes={politica.secoes}
    />
  );
}
