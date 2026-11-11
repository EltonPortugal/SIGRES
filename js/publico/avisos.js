// Mural de avisos à população e formulário de inscrição para recebê-los.

import { PRIORIDADES, VERSAO_TERMO } from '../config.js';
import { avisosAtivos } from '../agenda.js';
import { buscar, listar, salvarItem } from '../store.js';
import { $, preencherSelectSetores, toast } from '../ui.js';
import { esc, dataBR, hojeISO, validarContato } from '../utils.js';

export function iniciarAvisos() {
  $('#filtroAvisos').addEventListener('change', renderListaAvisos);

  const form = $('#formInscricao');
  const erro = $('#inscricaoErro');
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    const campos = form.elements;
    const contato = validarContato(campos.contato.value);
    if (!contato) {
      erro.textContent = 'Informe um telefone com DDD (ex.: (69) 9 9999-9999) ou um e-mail válido.';
      campos.contato.setAttribute('aria-invalid', 'true');
      campos.contato.focus();
      return;
    }
    campos.contato.removeAttribute('aria-invalid');
    erro.textContent = '';

    const existente = listar('inscritos').find(i => i.contato === contato.valor && i.setorId === campos.setorId.value);
    salvarItem('inscritos', {
      id: existente?.id,
      nome: campos.nome.value.trim(),
      contato: contato.valor,
      tipoContato: contato.tipo,
      setorId: campos.setorId.value,
      data: existente?.data ?? hojeISO(),
      consentimento: { versao: VERSAO_TERMO, data: new Date().toISOString() }
    });
    form.reset();
    toast(
      existente
        ? 'Seu cadastro já existia e foi atualizado.'
        : 'Cadastro realizado! Você receberá os avisos do seu setor.'
    );
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
