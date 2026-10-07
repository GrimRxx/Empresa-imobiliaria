export const tiposImovel = [
  { value: "Casa", label: "Casa" },
  { value: "Apartamento", label: "Apartamento" },
  { value: "Cobertura", label: "Cobertura" },
  { value: "Terreno", label: "Terreno" },
  { value: "Comercial", label: "Imóvel comercial" },
  { value: "Rural", label: "Imóvel rural" },
] as const;

export type Indicacao = {
  indicadorNome: string;
  indicadorTelefone: string;
  indicadorEmail: string;
  indicadorPix: string;
  proprietarioNome: string;
  proprietarioTelefone: string;
  imovelEndereco: string;
  imovelTipo: string;
  imovelValor: string;
  observacoes: string;
  consentimento: boolean;
};

export const indicacaoVazia: Indicacao = {
  indicadorNome: "",
  indicadorTelefone: "",
  indicadorEmail: "",
  indicadorPix: "",
  proprietarioNome: "",
  proprietarioTelefone: "",
  imovelEndereco: "",
  imovelTipo: "",
  imovelValor: "",
  observacoes: "",
  consentimento: false,
};

const limites: Record<Exclude<keyof Indicacao, "consentimento">, number> = {
  indicadorNome: 120,
  indicadorTelefone: 20,
  indicadorEmail: 160,
  indicadorPix: 160,
  proprietarioNome: 120,
  proprietarioTelefone: 20,
  imovelEndereco: 250,
  imovelTipo: 30,
  imovelValor: 40,
  observacoes: 2000,
};

export function formatarTelefone(valor: string) {
  const d = valor.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function telefoneValido(valor: string) {
  const d = valor.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
}

export type ErrosIndicacao = Partial<Record<keyof Indicacao, string>>;

/** Normaliza e valida os dados. Usado no navegador e no servidor. */
export function validarIndicacao(entrada: unknown): {
  dados: Indicacao;
  erros: ErrosIndicacao;
} {
  const bruto = (entrada ?? {}) as Record<string, unknown>;
  const dados = { ...indicacaoVazia };

  for (const campo of Object.keys(limites) as (keyof typeof limites)[]) {
    const v = bruto[campo];
    dados[campo] = typeof v === "string" ? v.trim().slice(0, limites[campo]) : "";
  }
  dados.consentimento = bruto.consentimento === true;

  const erros: ErrosIndicacao = {};
  if (dados.indicadorNome.length < 3) erros.indicadorNome = "Informe seu nome.";
  if (!telefoneValido(dados.indicadorTelefone))
    erros.indicadorTelefone = "Informe um telefone com DDD.";
  if (dados.indicadorEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.indicadorEmail))
    erros.indicadorEmail = "E-mail inválido.";
  if (dados.proprietarioNome.length < 2)
    erros.proprietarioNome = "Informe o nome do proprietário.";
  if (!telefoneValido(dados.proprietarioTelefone))
    erros.proprietarioTelefone = "Informe um telefone com DDD.";
  if (dados.imovelEndereco.length < 5)
    erros.imovelEndereco = "Informe o endereço do imóvel.";
  if (!tiposImovel.some((t) => t.value === dados.imovelTipo))
    erros.imovelTipo = "Selecione o tipo de imóvel.";
  if (!dados.consentimento)
    erros.consentimento = "É preciso confirmar para enviar.";

  return { dados, erros };
}
