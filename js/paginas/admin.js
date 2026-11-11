// Ponto de entrada da área administrativa (admin.html).

import { iniciar, aoMudar } from '../store.js';
import { iniciarMenu } from '../menu.js';
import { iniciarAcessibilidade } from '../acessibilidade.js';
import { $, $$, toast, preencherSelectSetores, marcarCarregado } from '../ui.js';
import { estaLogado, entrar, sair, renovarSessao, usuarioLogado } from '../admin/auth.js';
import { iniciarCadastros } from '../admin/cadastros.js';
import { iniciarInscritos, renderInscritos } from '../admin/inscritos.js';
import { iniciarBackup } from '../admin/backup.js';
import { iniciarAuditoria, renderAuditoria, registrar } from '../admin/auditoria.js';

function atualizarAcesso() {
  const logado = estaLogado();
  $('#adminLogin').hidden = logado;
  $('#adminPainel').hidden = !logado;
  $('#usuarioLogado').textContent = usuarioLogado() ?? '';
}

function iniciarLogin() {
  const form = $('#formLogin');
  const botao = $('button[type="submit"]', form);
  const erro = $('#loginErro');

  form.addEventListener('submit', async evento => {
    evento.preventDefault();
    botao.disabled = true;
    erro.textContent = '';
    try {
      const resultado = await entrar(form.elements.usuario.value, form.elements.senha.value);
      if (resultado.ok) {
        form.reset();
        registrar('login', 'Acesso ao painel de gestão');
        atualizarAcesso();
        toast('Bem-vindo ao painel de gestão.');
      } else {
        erro.textContent = resultado.motivo;
        form.elements.senha.value = '';
        form.elements.senha.focus();
      }
    } catch (falha) {
      erro.textContent = falha.message;
    } finally {
      botao.disabled = false;
    }
  });

  $('#btnSair').addEventListener('click', () => {
    registrar('logout', 'Saída pelo botão Sair');
    sair();
    atualizarAcesso();
  });
}

/** Renova a sessão a cada interação e encerra quando expira por inatividade. */
function iniciarControleDeSessao() {
  ['click', 'keydown'].forEach(tipo => document.addEventListener(tipo, () => estaLogado() && renovarSessao()));
  setInterval(() => {
    if (!$('#adminPainel').hidden && !estaLogado()) {
      atualizarAcesso();
      toast('Sessão encerrada por inatividade. Entre novamente.');
    }
  }, 30_000);
}

/** Abas acessíveis (padrão WAI-ARIA): setas, Home e End alternam entre as abas. */
function iniciarAbas() {
  const abas = $$('.abas [role="tab"]');

  const selecionar = aba => {
    abas.forEach(outra => {
      const ativa = outra === aba;
      outra.setAttribute('aria-selected', String(ativa));
      outra.tabIndex = ativa ? 0 : -1;
      $(`#${outra.getAttribute('aria-controls')}`).hidden = !ativa;
    });
    aba.focus();
  };

  abas.forEach((aba, i) => {
    aba.addEventListener('click', () => selecionar(aba));
    aba.addEventListener('keydown', evento => {
      const destino = {
        ArrowRight: abas[(i + 1) % abas.length],
        ArrowLeft: abas[(i - 1 + abas.length) % abas.length],
        Home: abas[0],
        End: abas[abas.length - 1]
      }[evento.key];
      if (!destino) return;
      evento.preventDefault();
      selecionar(destino);
    });
  });
}

async function main() {
  iniciarAcessibilidade();
  iniciarMenu();
  await iniciar();
  marcarCarregado();
  iniciarLogin();
  iniciarControleDeSessao();
  iniciarAbas();
  iniciarBackup();
  iniciarInscritos();
  iniciarAuditoria();
  const renderCadastros = iniciarCadastros();

  const renderizar = () => {
    $$('select[data-select-setores]').forEach(s => preencherSelectSetores(s, s.dataset.selectSetores));
    renderCadastros();
    renderInscritos();
    renderAuditoria();
  };
  aoMudar(renderizar);
  renderizar();
  atualizarAcesso();
}

main().catch(erro => {
  console.error(erro);
  toast('Não foi possível carregar o painel de gestão.');
});
