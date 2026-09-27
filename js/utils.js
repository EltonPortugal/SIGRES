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
  return String(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Quebra um texto em linhas não vazias. */
export function linhas(texto) {
  return texto.split('\n').map(l => l.trim()).filter(Boolean);
}
