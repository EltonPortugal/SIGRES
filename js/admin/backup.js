// Exportação, importação e restauração dos dados.

import { exportarJSON, substituirTudo, restaurarExemplo } from '../store.js';
import { $, toast, baixarArquivo } from '../ui.js';
import { hojeISO } from '../utils.js';

export function iniciarBackup() {
  $('#btnExportar').addEventListener('click', () => {
    baixarArquivo(`coleta-itapua-backup-${hojeISO()}.json`, exportarJSON(), 'application/json');
  });

  const input = $('#inputImportar');
  input.addEventListener('change', async () => {
    const arquivo = input.files[0];
    if (!arquivo) return;
    try {
      substituirTudo(JSON.parse(await arquivo.text()));
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
      toast('Dados de exemplo restaurados.');
    } catch (erro) {
      console.error(erro);
      toast('Não foi possível carregar os dados de exemplo.');
    }
  });
}
