// Mural de avisos à população e formulário de inscrição para recebê-los.

import { PRIORIDADES } from '../config.js';
import { avisosAtivos } from '../agenda.js';
import { buscar, salvarItem } from '../store.js';
import { $, preencherSelectSetores, toast } from '../ui.js';
import { esc, dataBR, hojeISO } from '../utils.js';

export function iniciarAvisos() {
  $('#filtroAvisos').addEventListener('change', renderListaAvisos);

  const form = $('#formInscricao');
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    const campos = form.elements;
    salvarItem('inscritos', {
      nome: campos.nome.value.trim(),
      contato: campos.contato.value.trim(),
      setorId: campos.setorId.value,
      data: hojeISO()
    });
    form.reset();
    toast('Cadastro realizado! Você receberá os avisos do seu setor.');
  });
}

export function renderAvisos() {
  preencherSelectSetores($('#filtroAvisos'), 'Todos os avisos');
  preencherSelectSetores($('#formInscricao').elements.setorId);
  renderListaAvisos();
}

function renderListaAvisos() {
  const avisos = avisosAtivos($('#filtroAvisos').value);
  $('#listaAvisos').innerHTML = avisos.length
    ? avisos.map(cartaoAviso).join('')
    : '<p class="vazio">Nenhum aviso no momento.</p>';
}

function cartaoAviso(aviso) {
  const setor = buscar('setores', aviso.setorId);
  return `
    <article class="card aviso ${esc(aviso.tipo)}">
      <div class="meta">
        <span class="selo ${esc(aviso.tipo)}">${esc(PRIORIDADES[aviso.tipo])}</span>
        <span>${dataBR(aviso.inicio)}</span>
        <span>${setor ? esc(setor.nome) : 'Todos os setores'}</span>
      </div>
      <h3>${esc(aviso.titulo)}</h3>
      <p>${esc(aviso.mensagem)}</p>
    </article>`;
}
