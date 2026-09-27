// Regras de negócio do cronograma: próximas coletas, avisos vigentes e busca por endereço.

import { DIAS } from './config.js';
import { listar, buscar } from './store.js';
import { hojeISO, normalizar, paraMinutos } from './utils.js';

export const coletasDoSetor = setorId => listar('coletas').filter(c => c.setorId === setorId);

/**
 * Próxima ocorrência de uma coleta a partir de `agora`.
 * Se a coleta é hoje mas o horário já terminou, considera a próxima semana.
 */
export function proximaData(coleta, agora = new Date()) {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  for (let i = 0; i < 8; i++) {
    const dia = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + i);
    if (!coleta.dias.includes(dia.getDay())) continue;
    if (i === 0 && minutosAgora > paraMinutos(coleta.fim)) continue;
    return { data: dia, emDias: i };
  }
  return null;
}

/** A coleta mais próxima de um setor, entre todos os tipos de resíduo. */
export function proximaColetaDoSetor(setorId, agora = new Date()) {
  return coletasDoSetor(setorId)
    .map(coleta => ({ coleta, proxima: proximaData(coleta, agora) }))
    .filter(x => x.proxima)
    .sort((a, b) => a.proxima.data - b.proxima.data)[0] ?? null;
}

export function descreverData({ data, emDias }) {
  if (emDias === 0) return 'Hoje';
  if (emDias === 1) return 'Amanhã';
  return `${DIAS[data.getDay()]}, ${data.toLocaleDateString('pt-BR')}`;
}

/**
 * Avisos vigentes hoje, do mais recente para o mais antigo.
 * Sem `setorId`, retorna todos; com `setorId`, retorna os gerais e os daquele setor.
 */
export function avisosAtivos(setorId, hoje = hojeISO()) {
  return listar('avisos')
    .filter(a => a.inicio <= hoje && (!a.fim || a.fim >= hoje))
    .filter(a => !setorId || !a.setorId || a.setorId === setorId)
    .sort((a, b) => b.inicio.localeCompare(a.inicio));
}

/** Localiza setores pelo nome do bairro ou do logradouro. */
export function buscarPorEndereco(texto) {
  const termo = normalizar(texto);
  if (!termo) return [];

  const confere = valor => {
    const v = normalizar(valor);
    return v.includes(termo) || termo.includes(v);
  };
  const achados = new Map(); // setorId → Set de motivos
  const registrar = (setorId, motivo) => {
    if (!achados.has(setorId)) achados.set(setorId, new Set());
    achados.get(setorId).add(motivo);
  };

  listar('setores').forEach(s => s.bairros.filter(confere).forEach(b => registrar(s.id, `Bairro ${b}`)));
  listar('rotas').forEach(r => r.logradouros.filter(confere).forEach(l => registrar(r.setorId, `${l} (${r.nome})`)));

  return [...achados]
    .map(([id, motivos]) => ({ setor: buscar('setores', id), motivos: [...motivos] }))
    .filter(r => r.setor);
}

/** Bairros e logradouros cadastrados, para sugestões de preenchimento. */
export function sugestoesDeEndereco() {
  const nomes = new Set();
  listar('setores').forEach(s => s.bairros.forEach(b => nomes.add(b)));
  listar('rotas').forEach(r => r.logradouros.forEach(l => nomes.add(l)));
  return [...nomes].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
