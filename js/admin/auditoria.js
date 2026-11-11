// Histórico de atividades da área administrativa (trilha de auditoria).
// Registra quem fez o quê e quando, para prestação de contas e conferência.

import { listar, registrarAtividade } from '../store.js';
import { usuarioLogado } from './auth.js';
import { $, baixarArquivo } from '../ui.js';
import { esc, hojeISO } from '../utils.js';

export const ACOES = {
  login: 'Entrada no sistema',
  logout: 'Saída do sistema',
  criar: 'Cadastro',
  editar: 'Alteração',
  excluir: 'Exclusão',
  importar: 'Importação de backup',
  exportar: 'Exportação de dados',
  restaurar: 'Restauração de dados de exemplo'
};

/** Registra uma atividade em nome do usuário logado. */
export function registrar(acao, descricao, usuario = usuarioLogado() ?? '—') {
  registrarAtividade({ usuario, acao, descricao });
}

const dataHora = iso => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export function renderAuditoria() {
  const registros = listar('auditoria').slice(0, 200);
  $('#tbAuditoria').innerHTML = registros.length
    ? registros
        .map(
          r => `
        <tr>
          <td><time datetime="${esc(r.data)}">${esc(dataHora(r.data))}</time></td>
          <td>${esc(r.usuario)}</td>
          <td>${esc(ACOES[r.acao] ?? r.acao)}</td>
          <td>${esc(r.descricao)}</td>
        </tr>`
        )
        .join('')
    : '<tr><td colspan="4" class="vazio">Nenhuma atividade registrada.</td></tr>';
}

export function iniciarAuditoria() {
  $('#btnExportarAuditoria').addEventListener('click', () => {
    const celula = valor => `"${String(valor).replace(/"/g, '""')}"`;
    const linhas = [
      ['Data e hora', 'Usuário', 'Ação', 'Descrição'],
      ...listar('auditoria').map(r => [dataHora(r.data), r.usuario, ACOES[r.acao] ?? r.acao, r.descricao])
    ];
    baixarArquivo(
      `sigres-atividades-${hojeISO()}.csv`,
      '﻿' + linhas.map(l => l.map(celula).join(';')).join('\r\n'),
      'text/csv;charset=utf-8'
    );
  });
}
