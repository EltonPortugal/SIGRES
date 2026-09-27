// Lista de moradores inscritos para receber avisos.

import { avisosAtivos } from '../agenda.js';
import { listar, buscar, removerItem } from '../store.js';
import { $, toast, baixarArquivo } from '../ui.js';
import { esc, dataBR } from '../utils.js';

export function iniciarInscritos() {
  $('#btnExportarCSV').addEventListener('click', exportarCSV);
  $('#tbInscritos').addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const id = botao.closest('tr').dataset.id;
    if (botao.dataset.acao === 'mensagem') enviarWhatsApp(id);
    if (botao.dataset.acao === 'excluir' && confirm('Remover este inscrito?')) {
      removerItem('inscritos', id);
      toast('Inscrito removido.');
    }
  });
}

export function renderInscritos() {
  const inscritos = listar('inscritos');
  $('#tbInscritos').innerHTML = inscritos.length
    ? inscritos.map(i => `
        <tr data-id="${esc(i.id)}">
          <td>${esc(i.nome)}</td>
          <td>${esc(i.contato)}</td>
          <td>${esc(buscar('setores', i.setorId)?.nome ?? '—')}</td>
          <td>${dataBR(i.data)}</td>
          <td class="acoes-linha">
            <button class="btn sec pequeno" type="button" data-acao="mensagem">Enviar WhatsApp</button>
            <button class="btn perigo pequeno" type="button" data-acao="excluir">Excluir</button>
          </td>
        </tr>`).join('')
    : '<tr><td colspan="5" class="vazio">Nenhum inscrito até o momento.</td></tr>';
}

function enviarWhatsApp(id) {
  const inscrito = buscar('inscritos', id);
  const telefone = inscrito.contato.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (telefone.length < 10 || telefone.length > 11) {
    toast('O contato informado não parece ser um telefone com DDD.');
    return;
  }
  const aviso = avisosAtivos(inscrito.setorId)[0];
  const texto = aviso
    ? `Olá, ${inscrito.nome}! Aviso da coleta de resíduos de Itapuã do Oeste:\n*${aviso.titulo}*\n${aviso.mensagem}`
    : `Olá, ${inscrito.nome}! No momento não há avisos sobre a coleta no seu setor.`;
  window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
}

function exportarCSV() {
  const celula = valor => `"${String(valor).replace(/"/g, '""')}"`;
  const linhas = [
    ['Nome', 'Contato', 'Setor', 'Data'],
    ...listar('inscritos').map(i => [i.nome, i.contato, buscar('setores', i.setorId)?.nome ?? '', dataBR(i.data)])
  ];
  // BOM + ";" para o Excel em português abrir com acentos e colunas corretas.
  const csv = '﻿' + linhas.map(l => l.map(celula).join(';')).join('\r\n');
  baixarArquivo('inscritos-coleta.csv', csv, 'text/csv;charset=utf-8');
}
