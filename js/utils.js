// Funções puras de apoio (sem acesso ao DOM nem aos dados).

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** Data local no formato AAAA-MM-DD. */
export function hojeISO(data = new Date()) {
  return new Date(data.getTime() - data.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

/** AAAA-MM-DD → DD/MM/AAAA. */
export function dataBR(iso) {
  if (!iso) return '';
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

/** "HH:MM" → minutos desde a meia-noite. */
export function paraMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** Escapa texto para inserção segura em HTML. */
export function esc(valor) {
  const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(valor ?? '').replace(/[&<>"']/g, c => mapa[c]);
}

/** Normaliza texto para busca: minúsculas e sem acentos. */
export function normalizar(texto) {
  return String(texto ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/** Quebra um texto em linhas não vazias. */
export function linhas(texto) {
  return texto
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

/**
 * Valida e normaliza o contato informado na inscrição.
 * Aceita e-mail ou telefone brasileiro com DDD (fixo ou celular, com ou sem +55).
 * @returns {{tipo: 'email'|'telefone', valor: string} | null}
 */
export function validarContato(texto) {
  const valor = String(texto ?? '').trim();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) return { tipo: 'email', valor: valor.toLowerCase() };
  const digitos = valor.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (/^[1-9]{2}9?\d{8}$/.test(digitos)) return { tipo: 'telefone', valor: digitos };
  return null;
}

/** Formata telefone (só dígitos, com DDD) como (69) 9 9999-9999 ou (69) 3333-4444. */
export function formatarTelefone(digitos) {
  const d = String(digitos ?? '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d[2]} ${d.slice(3, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}
