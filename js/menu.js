// Menu do cabeçalho: abre/fecha no celular e destaca a seção visível.

import { $, $$ } from './ui.js';

export function iniciarMenu() {
  const menu = $('.menu');
  const botao = $('.btn-menu');
  if (!menu || !botao) return;

  const definirAberto = aberto => {
    menu.classList.toggle('aberto', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
  };
  botao.addEventListener('click', () => definirAberto(!menu.classList.contains('aberto')));
  $$('a', menu).forEach(link => link.addEventListener('click', () => definirAberto(false)));

  const secoes = $$('section.bloco[id]');
  if (!secoes.length) return;
  const observador = new IntersectionObserver(
    entradas =>
      entradas.forEach(entrada => {
        if (!entrada.isIntersecting) return;
        $$('a', menu).forEach(a => a.classList.toggle('ativo', a.getAttribute('href') === `#${entrada.target.id}`));
      }),
    { rootMargin: '-40% 0px -55% 0px' }
  );
  secoes.forEach(s => observador.observe(s));
}
