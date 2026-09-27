// Consulta pública do cronograma por bairro ou endereço.

import { TIPOS_RESIDUO, DIAS } from '../config.js';
import { buscarPorEndereco, coletasDoSetor, proximaColetaDoSetor, descreverData, avisosAtivos, sugestoesDeEndereco } from '../agenda.js';
import { $ } from '../ui.js';
import { esc } from '../utils.js';
import { mostrarSetorNoCalendario } from './calendario.js';

let termoAtual = '';

export function iniciarConsulta() {
  const formHero = $('#formHero');
  const formConsulta = $('#formConsulta');

  formHero.addEventListener('submit', evento => {
    evento.preventDefault();
    consultar(formHero.elements.q.value);
    $('#consulta').scrollIntoView();
  });
  formConsulta.addEventListener('submit', evento => {
    evento.preventDefault();
    consultar(formConsulta.elements.q.value);
  });
  $('#resultadoBusca').addEventListener('click', evento => {
    const botao = evento.target.closest('[data-ver-calendario]');
    if (botao) mostrarSetorNoCalendario(botao.dataset.verCalendario);
  });
}

function consultar(texto) {
  termoAtual = texto.trim();
  $('#campoBusca').value = termoAtual;
  renderResultado();
}

export function renderConsulta() {
  $('#listaSugestoes').innerHTML = sugestoesDeEndereco().map(v => `<option value="${esc(v)}">`).join('');
  if (termoAtual) renderResultado();
}

function renderResultado() {
  const saida = $('#resultadoBusca');
  if (!termoAtual) {
    saida.innerHTML = '<p class="vazio">Digite um bairro ou endereço para consultar.</p>';
    return;
  }
  const resultados = buscarPorEndereco(termoAtual);
  saida.innerHTML = resultados.length
    ? resultados.map(cartaoSetor).join('')
    : `<p class="vazio">Nenhum setor encontrado para “${esc(termoAtual)}”. Verifique a grafia ou tente pelo nome do bairro.</p>`;
}

function cartaoSetor({ setor, motivos }) {
  const coletas = coletasDoSetor(setor.id);
  const proxima = proximaColetaDoSetor(setor.id);
  const aviso = avisosAtivos(setor.id).find(a => a.setorId === setor.id);

  const blocoProxima = proxima ? `
    <div class="proxima">
      Próxima coleta: <strong>${descreverData(proxima.proxima)}</strong> —
      ${esc(TIPOS_RESIDUO[proxima.coleta.tipo].nome)}, das ${esc(proxima.coleta.inicio)} às ${esc(proxima.coleta.fim)}
    </div>` : '';

  const listaColetas = coletas.length
    ? coletas.map(itemColeta).join('')
    : '<p class="vazio">Ainda não há dias de coleta cadastrados para este setor.</p>';

  const blocoAviso = aviso
    ? `<div class="nota"><strong>Aviso:</strong> ${esc(aviso.titulo)} — ${esc(aviso.mensagem)}</div>`
    : '';

  return `
    <article class="card cartao-setor" style="--cor-setor:${esc(setor.cor)}">
      <span class="setor-tag">${esc(setor.nome)}</span>
      <p class="encontrado-por">Encontrado por: ${motivos.map(esc).join('; ')}</p>
      ${blocoProxima}
      ${listaColetas}
      ${blocoAviso}
      <div class="acoes">
        <button class="btn sec pequeno" type="button" data-ver-calendario="${esc(setor.id)}">Ver calendário do mês</button>
      </div>
    </article>`;
}

function itemColeta(coleta) {
  const tipo = TIPOS_RESIDUO[coleta.tipo];
  return `
    <div class="coleta-item">
      <span class="marcador-tipo" style="--cor-tipo:${tipo.cor}" aria-hidden="true"></span>
      <div>
        <strong>${esc(tipo.nome)}</strong><br>
        ${coleta.dias.map(d => DIAS[d]).join(', ')} · ${esc(coleta.inicio)} às ${esc(coleta.fim)}
        ${coleta.obs ? `<br><small>${esc(coleta.obs)}</small>` : ''}
      </div>
    </div>`;
}
