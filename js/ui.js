// Auxiliares de interface compartilhados pelas páginas.

import { listar } from './store.js';
import { esc } from './utils.js';

export const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
export const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

let toastEl;
let toastTimer;
export function toast(mensagem) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    toastEl.setAttribute('aria-live', 'polite');
    document.body.append(toastEl);
  }
  toastEl.textContent = mensagem;
  toastEl.classList.add('mostrar');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('mostrar'), 3000);
}

/** Preenche um <select> com os setores, preservando a opção selecionada. */
export function preencherSelectSetores(select, rotuloOpcaoVazia) {
  const atual = select.value;
  const vazia = rotuloOpcaoVazia ? `<option value="">${esc(rotuloOpcaoVazia)}</option>` : '';
  select.innerHTML =
    vazia +
    listar('setores')
      .map(s => `<option value="${esc(s.id)}">${esc(s.nome)}</option>`)
      .join('');
  if ([...select.options].some(o => o.value === atual)) select.value = atual;
}

export function baixarArquivo(nome, conteudo, tipo) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  link.download = nome;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

/** Remove a mensagem de "servidor local" exibida enquanto os scripts não carregam. */
export function marcarCarregado() {
  $('[data-aviso-carregamento]')?.remove();
}
