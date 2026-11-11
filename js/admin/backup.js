// Exportação, importação e restauração dos dados.

import { exportarJSON, substituirTudo, restaurarExemplo } from '../store.js';
import { $, toast, baixarArquivo } from '../ui.js';
import { hojeISO } from '../utils.js';
import { registrar } from './auditoria.js';
import { validarBase } from '../validacao.js';

export function iniciarBackup() {
  $('#btnExportar').addEventListener('click', () => {
    baixarArquivo(`sigres-backup-${hojeISO()}.json`, exportarJSON(), 'application/json');
    registrar('exportar', 'Backup completo (JSON)');
  });

  const input = $('#inputImportar');
  input.addEventListener('change', async () => {
    const arquivo = input.files[0];
    if (!arquivo) return;
    let base;
    try {
      base = JSON.parse(await arquivo.text());
    } catch {
      toast('O arquivo selecionado não é um JSON válido.');
      input.value = '';
      return;
    }
    try {
      const erros = validarBase(base);
      if (erros.length) {
        console.warn('Backup rejeitado:', erros);
        toast(`Backup inválido: ${erros[0]}${erros.length > 1 ? ` (e mais ${erros.length - 1} problema(s))` : ''}`);
        return;
      }
      const resumo = `${base.setores.length} setor(es), ${base.rotas.length} rota(s), ${base.coletas.length} dia(s) de coleta, ${base.avisos.length} aviso(s) e ${base.inscritos.length} inscrito(s)`;
      if (
        !confirm(
          `Importar ${resumo}?\n\nTodos os dados atuais serão substituídos. Recomenda-se exportar um backup antes.`
        )
      )
        return;
      substituirTudo(base);
      registrar('importar', `Arquivo ${arquivo.name}: ${resumo}`);
      toast('Backup importado.');
    } finally {
      input.value = '';
    }
  });

  $('#btnRestaurar').addEventListener('click', async () => {
    if (!confirm('Substituir todos os dados atuais pelos dados de exemplo?')) return;
    try {
      await restaurarExemplo();
      registrar('restaurar', 'Dados de exemplo');
      toast('Dados de exemplo restaurados.');
    } catch (erro) {
      console.error(erro);
      toast('Não foi possível carregar os dados de exemplo.');
    }
  });
}
