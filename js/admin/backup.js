// Exportação, importação e restauração dos dados.

import { exportarJSON, substituirTudo, restaurarExemplo } from '../store.js';
import { $, toast, baixarArquivo } from '../ui.js';
import { hojeISO } from '../utils.js';
import { registrar } from './auditoria.js';

export function iniciarBackup() {
  $('#btnExportar').addEventListener('click', () => {
    baixarArquivo(`sigres-backup-${hojeISO()}.json`, exportarJSON(), 'application/json');
    registrar('exportar', 'Backup completo (JSON)');
  });

  const input = $('#inputImportar');
  input.addEventListener('change', async () => {
    const arquivo = input.files[0];
    if (!arquivo) return;
    try {
      substituirTudo(JSON.parse(await arquivo.text()));
      registrar('importar', `Arquivo ${arquivo.name}`);
      toast('Backup importado.');
    } catch {
      toast('Arquivo de backup inválido.');
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
