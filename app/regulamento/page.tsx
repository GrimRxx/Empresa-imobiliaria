import type { Metadata } from "next";
import DocumentoLegal from "@/components/DocumentoLegal";
import { regulamento } from "@/lib/regulamento";

export const metadata: Metadata = {
  title: "Regulamento | Prosperar Imóveis",
  description:
    "Regras do programa de indicação da Prosperar Imóveis: quem pode participar, valores, pagamento e proteção de dados.",
};

export default function Regulamento() {
  return (
    <DocumentoLegal
      selo="Regulamento"
      titulo={regulamento.titulo}
      info={regulamento.info}
      secoes={regulamento.secoes}
    />
  );
}
