// Camada de dados. Hoje persiste no localStorage; para migrar para uma API,
// basta reimplementar as funções exportadas mantendo as mesmas assinaturas.

import { CHAVE_DADOS, COLECOES } from './config.js';
import { uid, hojeISO } from './utils.js';

let dados = null;
const ouvintes = new Set();

export const dadosValidos = obj => !!obj && COLECOES.every(c => Array.isArray(obj[c]));

async function carregarExemplo() {
  const resposta = await fetch(new URL('../data/dados-exemplo.json', import.meta.url));
  if (!resposta.ok) throw new Error(`Falha ao carregar os dados de exemplo (HTTP ${resposta.status}).`);
  const exemplo = await resposta.json();
  // Avisos de exemplo sem data são publicados no dia em que os dados são criados.
  exemplo.avisos.forEach(a => {
    a.inicio ||= hojeISO();
  });
  return exemplo;
}

function lerDoNavegador() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_DADOS));
    return dadosValidos(salvo) ? salvo : null;
  } catch {
    return null;
  }
}

function persistir() {
  try {
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
  } catch (erro) {
    console.error('Não foi possível salvar os dados no navegador.', erro);
  }
}

const notificar = () => ouvintes.forEach(fn => fn());

function confirmar() {
  persistir();
  notificar();
}

/** Carrega os dados (ou o exemplo, na primeira visita). Deve ser chamado antes de qualquer outra função. */
export async function iniciar() {
  dados = lerDoNavegador();
  if (!dados) {
    dados = await carregarExemplo();
    persistir();
  }
  // Mantém abertas várias abas (ex.: site público e área administrativa) sincronizadas.
  window.addEventListener('storage', evento => {
    if (evento.key !== CHAVE_DADOS) return;
    const novos = lerDoNavegador();
    if (novos) {
      dados = novos;
      notificar();
    }
  });
}

/** Registra uma função chamada sempre que os dados mudarem. */
export const aoMudar = fn => ouvintes.add(fn);

export const listar = colecao => dados[colecao];
export const buscar = (colecao, id) => dados[colecao].find(item => item.id === id);

export function salvarItem(colecao, item) {
  const registro = { ...item, id: item.id || uid() };
  const indice = dados[colecao].findIndex(x => x.id === registro.id);
  if (indice >= 0) dados[colecao][indice] = registro;
  else dados[colecao].push(registro);
  confirmar();
  return registro;
}

export function removerItem(colecao, id) {
  dados[colecao] = dados[colecao].filter(item => item.id !== id);
  confirmar();
}

/** Quantidade de rotas, dias de coleta e avisos ligados a um setor. */
export function vinculosDoSetor(id) {
  return ['rotas', 'coletas', 'avisos'].reduce((n, c) => n + dados[c].filter(x => x.setorId === id).length, 0);
}

/** Remove o setor com suas rotas, dias de coleta e avisos. Os inscritos são mantidos. */
export function removerSetor(id) {
  for (const colecao of ['rotas', 'coletas', 'avisos']) {
    dados[colecao] = dados[colecao].filter(item => item.setorId !== id);
  }
  dados.setores = dados.setores.filter(s => s.id !== id);
  confirmar();
}

export function substituirTudo(novos) {
  if (!dadosValidos(novos)) throw new Error('Estrutura de dados inválida.');
  dados = novos;
  confirmar();
}

export async function restaurarExemplo() {
  dados = await carregarExemplo();
  confirmar();
}

export const exportarJSON = () => JSON.stringify(dados, null, 2);
