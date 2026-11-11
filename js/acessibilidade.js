// Recursos de acessibilidade: alto contraste e ajuste do tamanho do texto.
// As preferências ficam salvas no navegador do visitante.

import { $, $$ } from './ui.js';

const CHAVE = 'sigres.acessibilidade';
const ESCALAS = [0.9, 1, 1.15, 1.3, 1.5];
const ESCALA_PADRAO = 1;

function lerPreferencias() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    return { contraste: !!salvo?.contraste, escala: ESCALAS.includes(salvo?.escala) ? salvo.escala : ESCALA_PADRAO };
  } catch {
    return { contraste: false, escala: ESCALA_PADRAO };
  }
}

function salvarPreferencias(preferencias) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(preferencias));
  } catch {
    /* navegação privada: vale só para esta página */
  }
}

function aplicar({ contraste, escala }) {
  document.documentElement.classList.toggle('alto-contraste', contraste);
  document.documentElement.style.fontSize = escala === ESCALA_PADRAO ? '' : `${escala * 100}%`;
  $$('[data-a11y="contraste"]').forEach(botao => botao.setAttribute('aria-pressed', String(contraste)));
}

export function iniciarAcessibilidade() {
  const preferencias = lerPreferencias();
  aplicar(preferencias);

  const barra = $('.barra-gov');
  if (!barra) return;
  barra.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-a11y]');
    if (!botao) return;
    const indice = ESCALAS.indexOf(preferencias.escala);
    switch (botao.dataset.a11y) {
      case 'contraste':
        preferencias.contraste = !preferencias.contraste;
        break;
      case 'aumentar':
        preferencias.escala = ESCALAS[Math.min(indice + 1, ESCALAS.length - 1)];
        break;
      case 'diminuir':
        preferencias.escala = ESCALAS[Math.max(indice - 1, 0)];
        break;
      case 'restaurar':
        preferencias.escala = ESCALA_PADRAO;
        break;
    }
    aplicar(preferencias);
    salvarPreferencias(preferencias);
  });
}
