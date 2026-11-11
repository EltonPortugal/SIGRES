// Ponto de entrada da página "Sobre o projeto" (sobre.html).

import { iniciar, aoMudar, listar } from '../store.js';
import { avisosAtivos } from '../agenda.js';
import { iniciarMenu } from '../menu.js';
import { iniciarAcessibilidade } from '../acessibilidade.js';
import { $, toast, marcarCarregado } from '../ui.js';

function renderEstatisticas() {
  const totalBairros = listar('setores').reduce((n, s) => n + s.bairros.length, 0);
  const numeros = [
    [listar('setores').length, 'setores cadastrados'],
    [totalBairros, 'bairros atendidos'],
    [listar('rotas').length, 'rotas de coleta'],
    [avisosAtivos().length, 'avisos ativos']
  ];
  $('#estatisticas').innerHTML = numeros
    .map(([valor, rotulo]) => `<div class="card"><div class="num-destaque">${valor}</div>${rotulo}</div>`)
    .join('');
}

async function main() {
  iniciarAcessibilidade();
  iniciarMenu();
  await iniciar();
  marcarCarregado();
  aoMudar(renderEstatisticas);
  renderEstatisticas();
}

main().catch(erro => {
  console.error(erro);
  toast('Não foi possível carregar os dados da coleta.');
});
