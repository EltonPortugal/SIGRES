// Ponto de entrada da área administrativa (admin.html).

import { iniciar, aoMudar } from '../store.js';
import { iniciarMenu } from '../menu.js';
import { iniciarAcessibilidade } from '../acessibilidade.js';
import { $, $$, toast, preencherSelectSetores, marcarCarregado } from '../ui.js';
import { estaLogado, entrar, sair } from '../admin/auth.js';
import { iniciarCadastros } from '../admin/cadastros.js';
import { iniciarInscritos, renderInscritos } from '../admin/inscritos.js';
import { iniciarBackup } from '../admin/backup.js';

function atualizarAcesso() {
  const logado = estaLogado();
  $('#adminLogin').hidden = logado;
  $('#adminPainel').hidden = !logado;
}

function iniciarLogin() {
  const form = $('#formLogin');
  form.addEventListener('submit', evento => {
    evento.preventDefault();
    if (entrar(form.elements.usuario.value, form.elements.senha.value)) {
      form.reset();
      atualizarAcesso();
      toast('Bem-vindo à área administrativa.');
    } else {
      toast('Usuário ou senha inválidos.');
    }
  });
  $('#btnSair').addEventListener('click', () => {
    sair();
    atualizarAcesso();
  });
}

function iniciarAbas() {
  const abas = $$('.abas [role="tab"]');
  abas.forEach(aba =>
    aba.addEventListener('click', () => {
      abas.forEach(outra => {
        const ativa = outra === aba;
        outra.setAttribute('aria-selected', String(ativa));
        $(`#${outra.getAttribute('aria-controls')}`).hidden = !ativa;
      });
    })
  );
}

async function main() {
  iniciarAcessibilidade();
  iniciarMenu();
  await iniciar();
  marcarCarregado();
  iniciarLogin();
  iniciarAbas();
  iniciarBackup();
  iniciarInscritos();
  const renderCadastros = iniciarCadastros();

  const renderizar = () => {
    $$('select[data-select-setores]').forEach(s => preencherSelectSetores(s, s.dataset.selectSetores));
    renderCadastros();
    renderInscritos();
  };
  aoMudar(renderizar);
  renderizar();
  atualizarAcesso();
}

main().catch(erro => {
  console.error(erro);
  toast('Não foi possível carregar a área administrativa.');
});
