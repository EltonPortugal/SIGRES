// Validação da estrutura da base de dados (usada na importação de backups).
// Funções puras: não acessam o DOM nem o armazenamento.

import { COLECOES, TIPOS_RESIDUO, PRIORIDADES } from './config.js';

const ehTexto = v => typeof v === 'string';
const ehListaDeTextos = v => Array.isArray(v) && v.every(ehTexto);
const ehHora = v => ehTexto(v) && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
const ehDataOuVazio = v => v === '' || v === undefined || (ehTexto(v) && /^\d{4}-\d{2}-\d{2}$/.test(v));

/** Regras por coleção: cada uma devolve a mensagem de erro ou null. */
const REGRAS = {
  setores: s => (!ehTexto(s.nome) || !s.nome ? 'sem nome' : !ehListaDeTextos(s.bairros) ? 'bairros inválidos' : null),
  rotas: r => (!ehTexto(r.nome) ? 'sem nome' : !ehListaDeTextos(r.logradouros) ? 'logradouros inválidos' : null),
  coletas: c => {
    if (!(c.tipo in TIPOS_RESIDUO)) return `tipo de resíduo desconhecido (${c.tipo})`;
    if (!Array.isArray(c.dias) || !c.dias.length || !c.dias.every(d => Number.isInteger(d) && d >= 0 && d <= 6))
      return 'dias da semana inválidos';
    if (!ehHora(c.inicio) || !ehHora(c.fim)) return 'horário inválido';
    return null;
  },
  avisos: a => {
    if (!ehTexto(a.titulo) || !ehTexto(a.mensagem)) return 'sem título ou mensagem';
    if (!(a.tipo in PRIORIDADES)) return `prioridade desconhecida (${a.tipo})`;
    if (!ehDataOuVazio(a.inicio) || !ehDataOuVazio(a.fim)) return 'data inválida';
    return null;
  },
  inscritos: i => (!ehTexto(i.nome) || !ehTexto(i.contato) ? 'sem nome ou contato' : null)
};

const COM_SETOR_OBRIGATORIO = ['rotas', 'coletas'];

/**
 * Verifica se um objeto é uma base válida do SIGRES.
 * @returns {string[]} Lista de problemas encontrados (vazia = válida).
 */
export function validarBase(base) {
  if (!base || typeof base !== 'object') return ['O arquivo não contém um objeto JSON.'];
  const faltando = COLECOES.filter(c => !Array.isArray(base[c]));
  if (faltando.length) return [`Coleções ausentes: ${faltando.join(', ')}.`];

  const erros = [];
  const idsSetores = new Set(base.setores.map(s => s.id));
  for (const colecao of COLECOES) {
    const ids = new Set();
    base[colecao].forEach((item, i) => {
      const ref = `${colecao}[${i}]`;
      if (!item || typeof item !== 'object') return erros.push(`${ref}: registro inválido.`);
      if (!ehTexto(item.id) || !item.id) erros.push(`${ref}: sem identificador.`);
      else if (ids.has(item.id)) erros.push(`${ref}: identificador duplicado (${item.id}).`);
      ids.add(item.id);
      const problema = REGRAS[colecao](item);
      if (problema) erros.push(`${ref}: ${problema}.`);
      const exigeSetor = COM_SETOR_OBRIGATORIO.includes(colecao);
      if ((exigeSetor || item.setorId) && !idsSetores.has(item.setorId))
        erros.push(`${ref}: setor inexistente (${item.setorId || 'vazio'}).`);
    });
  }
  return erros;
}
