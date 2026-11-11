// Ponto de entrada da página pública (index.html).

import { iniciar, aoMudar } from '../store.js';
import { iniciarMenu } from '../menu.js';
import { iniciarAcessibilidade } from '../acessibilidade.js';
import { toast, marcarCarregado } from '../ui.js';
import { iniciarConsulta, renderConsulta } from '../publico/consulta.js';
import { iniciarCalendario, renderCalendario } from '../publico/calendario.js';
import { iniciarAvisos, renderAvisos } from '../publico/avisos.js';

function renderizar() {
  renderConsulta();
  renderCalendario();
  renderAvisos();
}

async function main() {
  iniciarAcessibilidade();
  iniciarMenu();
  await iniciar();
  marcarCarregado();
  iniciarConsulta();
  iniciarCalendario();
  iniciarAvisos();
  aoMudar(renderizar);
  renderizar();
}

main().catch(erro => {
  console.error(erro);
  toast('Não foi possível carregar os dados da coleta.');
});
