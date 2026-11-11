// Componente genérico de cadastro: formulário + tabela com editar/excluir.
// Cada painel precisa de um <form> (com <input type="hidden" name="id"> e um
// elemento [data-titulo]) e de uma <table> com <tbody>.

import { listar, buscar, salvarItem, removerItem } from '../store.js';
import { $, toast } from '../ui.js';
import { esc } from '../utils.js';

/**
 * @param {object} opcoes
 * @param {string} opcoes.colecao            Nome da coleção no store.
 * @param {HTMLElement} opcoes.painel        Elemento que contém o formulário e a tabela.
 * @param {{novo: string, editar: string}} opcoes.titulos
 * @param {(form: HTMLFormElement) => object|string} opcoes.lerFormulario   Retorna o item ou uma mensagem de erro.
 * @param {(form: HTMLFormElement, item: object) => void} opcoes.preencherFormulario
 * @param {(item: object) => string} opcoes.colunas   HTML das células da linha (sem a de ações).
 * @param {(item: object, novo: boolean) => string} [opcoes.mensagemSalvo]
 * @param {(id: string) => void} [opcoes.excluir]     Substitui a exclusão padrão.
 */
export function criarCadastro({
  colecao,
  painel,
  titulos,
  lerFormulario,
  preencherFormulario,
  colunas,
  mensagemSalvo,
  excluir
}) {
  const form = $('form', painel);
  const tbody = $('tbody', painel);
  const titulo = $('[data-titulo]', form);
  const totalColunas = $('thead tr', painel).children.length;

  function limpar() {
    form.reset();
    form.elements.id.value = ''; // campos hidden não são limpos pelo reset()
    titulo.textContent = titulos.novo;
  }

  function editar(id) {
    const item = buscar(colecao, id);
    if (!item) return;
    limpar();
    form.elements.id.value = item.id;
    preencherFormulario(form, item);
    titulo.textContent = titulos.editar;
    form.scrollIntoView({ block: 'nearest' });
    form.querySelector('input:not([type=hidden]), select, textarea')?.focus();
  }

  function excluirPadrao(id) {
    if (confirm('Confirmar exclusão?')) {
      removerItem(colecao, id);
      toast('Registro excluído.');
    }
  }

  form.addEventListener('submit', evento => {
    evento.preventDefault();
    const resultado = lerFormulario(form);
    if (typeof resultado === 'string') {
      toast(resultado);
      return;
    }
    const novo = !form.elements.id.value;
    const item = salvarItem(colecao, { ...resultado, id: form.elements.id.value });
    limpar();
    toast(mensagemSalvo?.(item, novo) ?? 'Registro salvo.');
  });

  form.addEventListener('click', evento => {
    if (evento.target.closest('[data-acao="cancelar"]')) limpar();
  });

  tbody.addEventListener('click', evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao) return;
    const id = botao.closest('tr').dataset.id;
    if (botao.dataset.acao === 'editar') editar(id);
    if (botao.dataset.acao === 'excluir') (excluir ?? excluirPadrao)(id);
  });

  function render() {
    // Se o item em edição foi removido (ex.: em outra aba), volta ao modo "novo".
    if (form.elements.id.value && !buscar(colecao, form.elements.id.value)) limpar();
    const itens = listar(colecao);
    tbody.innerHTML = itens.length
      ? itens
          .map(
            item => `
          <tr data-id="${esc(item.id)}">
            ${colunas(item)}
            <td class="acoes-linha">
              <button class="btn sec pequeno" type="button" data-acao="editar">Editar</button>
              <button class="btn perigo pequeno" type="button" data-acao="excluir">Excluir</button>
            </td>
          </tr>`
          )
          .join('')
      : `<tr><td colspan="${totalColunas}" class="vazio">Nenhum registro.</td></tr>`;
  }

  return { render, limpar };
}
