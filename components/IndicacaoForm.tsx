"use client";

import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";
import {
  formatarTelefone,
  indicacaoVazia,
  tiposImovel,
  validarIndicacao,
  type ErrosIndicacao,
  type Indicacao,
} from "@/lib/indicacao";
import { site } from "@/lib/site";

type Status = "idle" | "enviando" | "sucesso" | "erro";

const inputBase =
  "w-full rounded-lg border px-3.5 py-2.5 text-sm text-[#3f3f3f] outline-none transition focus:border-[#009cb4] focus:ring-2 focus:ring-[#009cb4]/20";

function Campo({
  label,
  obrigatorio,
  erro,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium text-neutral-700">
      {label}
      {obrigatorio && <span className="text-red-500"> *</span>}
      <div className="mt-1.5">{children}</div>
      {erro && <span className="mt-1 block text-xs text-red-600">{erro}</span>}
    </label>
  );
}

export default function IndicacaoForm() {
  const [dados, setDados] = useState<Indicacao>(indicacaoVazia);
  const [erros, setErros] = useState<ErrosIndicacao>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mensagemErro, setMensagemErro] = useState("");
  const [empresa, setEmpresa] = useState(""); // armadilha anti-spam

  function alterar<K extends keyof Indicacao>(campo: K, valor: Indicacao[K]) {
    setDados((d) => ({ ...d, [campo]: valor }));
    if (erros[campo]) setErros((e) => ({ ...e, [campo]: undefined }));
  }

  const classe = (campo: keyof Indicacao) =>
    `${inputBase} ${erros[campo] ? "border-red-400" : "border-neutral-300"}`;

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const { erros: novosErros } = validarIndicacao(dados);
    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      setStatus("erro");
      setMensagemErro("Confira os campos destacados.");
      return;
    }

    setStatus("enviando");
    try {
      const resposta = await fetch("/api/indicacao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...dados, empresa }),
      });
      const json = await resposta.json().catch(() => ({}));
      if (!resposta.ok) {
        if (json.erros) setErros(json.erros);
        throw new Error(json.erro || "Não foi possível enviar agora.");
      }
      setStatus("sucesso");
      setDados(indicacaoVazia);
    } catch (err) {
      setStatus("erro");
      setMensagemErro(
        err instanceof Error ? err.message : "Não foi possível enviar agora.",
      );
    }
  }

  if (status === "sucesso") {
    return (
      <div className="flex h-full flex-col items-start justify-center gap-4 py-10">
        <FiCheckCircle className="h-12 w-12 text-[#009cb4]" />
        <h3 className="text-2xl font-extrabold text-[#3f3f3f]">
          Indicação enviada!
        </h3>
        <p className="text-neutral-600">
          Obrigado por indicar. Nossa equipe vai falar com o proprietário e
          retorna para você em até 48h pelo telefone informado.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 rounded-full border border-[#009cb4] px-6 py-2.5 text-sm font-semibold text-[#009cb4] transition hover:bg-[#009cb4] hover:text-white"
        >
          Indicar outro imóvel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-8">
      {/* Campo invisível para pessoas; robôs costumam preencher */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Empresa
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={empresa}
            onChange={(e) => setEmpresa(e.target.value)}
          />
        </label>
      </div>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[#3f3f3f]">1. Seus dados</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nome completo" obrigatorio erro={erros.indicadorNome}>
            <input
              type="text"
              autoComplete="name"
              className={classe("indicadorNome")}
              placeholder="Como podemos te chamar"
              value={dados.indicadorNome}
              onChange={(e) => alterar("indicadorNome", e.target.value)}
            />
          </Campo>
          <Campo label="Telefone / WhatsApp" obrigatorio erro={erros.indicadorTelefone}>
            <input
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              className={classe("indicadorTelefone")}
              placeholder="(00) 00000-0000"
              value={dados.indicadorTelefone}
              onChange={(e) => alterar("indicadorTelefone", formatarTelefone(e.target.value))}
            />
          </Campo>
          <Campo label="E-mail (opcional)" erro={erros.indicadorEmail}>
            <input
              type="email"
              autoComplete="email"
              className={classe("indicadorEmail")}
              placeholder="seu@email.com"
              value={dados.indicadorEmail}
              onChange={(e) => alterar("indicadorEmail", e.target.value)}
            />
          </Campo>
          <Campo label="Chave Pix para receber o pagamento (opcional)">
            <input
              type="text"
              className={classe("indicadorPix")}
              placeholder="CPF, e-mail, telefone ou chave aleatória"
              value={dados.indicadorPix}
              onChange={(e) => alterar("indicadorPix", e.target.value)}
            />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[#3f3f3f]">
          2. Dados de quem está vendendo o imóvel
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Nome do proprietário" obrigatorio erro={erros.proprietarioNome}>
            <input
              type="text"
              className={classe("proprietarioNome")}
              placeholder="Nome de quem está vendendo"
              value={dados.proprietarioNome}
              onChange={(e) => alterar("proprietarioNome", e.target.value)}
            />
          </Campo>
          <Campo label="Telefone do proprietário" obrigatorio erro={erros.proprietarioTelefone}>
            <input
              type="tel"
              inputMode="tel"
              className={classe("proprietarioTelefone")}
              placeholder="(00) 00000-0000"
              value={dados.proprietarioTelefone}
              onChange={(e) => alterar("proprietarioTelefone", formatarTelefone(e.target.value))}
            />
          </Campo>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-bold text-[#3f3f3f]">3. Dados do imóvel</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo label="Endereço do imóvel" obrigatorio erro={erros.imovelEndereco}>
            <input
              type="text"
              className={classe("imovelEndereco")}
              placeholder="Rua, número, bairro, cidade"
              value={dados.imovelEndereco}
              onChange={(e) => alterar("imovelEndereco", e.target.value)}
            />
          </Campo>
          <Campo label="Tipo de imóvel" obrigatorio erro={erros.imovelTipo}>
            <select
              className={`${classe("imovelTipo")} bg-white`}
              value={dados.imovelTipo}
              onChange={(e) => alterar("imovelTipo", e.target.value)}
            >
              <option value="">Selecione</option>
              {tiposImovel.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Valor aproximado desejado (opcional)">
            <input
              type="text"
              className={classe("imovelValor")}
              placeholder="Ex: R$ 350.000"
              value={dados.imovelValor}
              onChange={(e) => alterar("imovelValor", e.target.value)}
            />
          </Campo>
        </div>
        <Campo label="Observações (opcional)">
          <textarea
            className={classe("observacoes")}
            rows={3}
            placeholder="Alguma informação extra que ajude no contato"
            value={dados.observacoes}
            onChange={(e) => alterar("observacoes", e.target.value)}
          />
        </Campo>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-sm text-neutral-600">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-neutral-300 accent-[#009cb4]"
            checked={dados.consentimento}
            onChange={(e) => alterar("consentimento", e.target.checked)}
          />
          <span>
            Confirmo que o proprietário sabe que estou compartilhando esses dados
            com a {site.nome} para fins de contato comercial.
          </span>
        </label>
        {erros.consentimento && (
          <span className="mt-1 block pl-7 text-xs text-red-600">{erros.consentimento}</span>
        )}
      </div>

      {status === "erro" && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {mensagemErro}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "enviando"}
        className="w-full rounded-full bg-[#009cb4] px-8 py-3.5 text-base font-semibold text-white transition hover:bg-[#007c90] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
      >
        {status === "enviando" ? "Enviando..." : "Enviar indicação"}
      </button>
    </form>
  );
}
