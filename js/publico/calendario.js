// Calendário mensal de coleta por setor.

import { DIAS_CURTO, TIPOS_RESIDUO } from '../config.js';
import { coletasDoSetor } from '../agenda.js';
import { $, preencherSelectSetores } from '../ui.js';
import { esc } from '../utils.js';

const mesExibido = new Date();
mesExibido.setDate(1);

export function iniciarCalendario() {
  $('#calSetor').addEventListener('change', renderCalendario);
  $('#calAnterior').addEventListener('click', () => mudarMes(-1));
  $('#calProximo').addEventListener('click', () => mudarMes(1));
  $('#calImprimir').addEventListener('click', () => window.print());
}

function mudarMes(delta) {
  mesExibido.setMonth(mesExibido.getMonth() + delta);
  renderCalendario();
}

export function mostrarSetorNoCalendario(setorId) {
  $('#calSetor').value = setorId;
  renderCalendario();
  $('#calendario').scrollIntoView();
}

export function renderCalendario() {
  const select = $('#calSetor');
  preencherSelectSetores(select);

  const coletas = coletasDoSetor(select.value);
  const ano = mesExibido.getFullYear();
  const mes = mesExibido.getMonth();
  const titulo = mesExibido.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const nomeMes = mesExibido.toLocaleDateString('pt-BR', { month: 'long' });
  $('#calTitulo').textContent = titulo[0].toUpperCase() + titulo.slice(1);

  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date().toDateString();

  const celulas = DIAS_CURTO.map(d => `<div class="cab" aria-hidden="true">${d}</div>`);
  for (let i = 0; i < primeiroDiaSemana; i++) celulas.push('<div class="dia fora" aria-hidden="true"></div>');
  for (let dia = 1; dia <= totalDias; dia++) {
    const data = new Date(ano, mes, dia);
    const doDia = coletas.filter(c => c.dias.includes(data.getDay()));
    const descricao = doDia.length
      ? doDia.map(c => `${TIPOS_RESIDUO[c.tipo].nome}, das ${c.inicio} às ${c.fim}`).join('; ')
      : 'sem coleta';
    celulas.push(`
      <div class="dia${data.toDateString() === hoje ? ' hoje' : ''}" role="listitem">
        <span class="num" aria-hidden="true">${dia}</span>
        <span class="sr-only">${dia} de ${nomeMes}${data.toDateString() === hoje ? ' (hoje)' : ''}: ${esc(descricao)}</span>
        <div class="marcas" aria-hidden="true">${doDia.map(marcaColeta).join('')}</div>
      </div>`);
  }
  $('#calGrade').innerHTML = celulas.join('');

  const tiposUsados = [...new Set(coletas.map(c => c.tipo))];
  $('#calLegenda').innerHTML = tiposUsados.length
    ? tiposUsados
        .map(t => `<span style="--cor-tipo:${TIPOS_RESIDUO[t].cor}">${esc(TIPOS_RESIDUO[t].nome)}</span>`)
        .join('')
    : '<span class="vazio">Nenhuma coleta cadastrada para este setor.</span>';
}

function marcaColeta(coleta) {
  const tipo = TIPOS_RESIDUO[coleta.tipo];
  const descricao = `${tipo.nome} ${coleta.inicio}–${coleta.fim}`;
  return `<span class="marca-coleta" style="--cor-tipo:${tipo.cor}" title="${esc(descricao)}">${esc(coleta.inicio)}</span>`;
}
