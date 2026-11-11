// Configuração dos cadastros de setores, rotas, dias de coleta e avisos.

import { DIAS, DIAS_CURTO, TIPOS_RESIDUO, PRIORIDADES } from '../config.js';
import { buscar, listar, removerSetor, vinculosDoSetor } from '../store.js';
import { $, $$, toast } from '../ui.js';
import { esc, linhas, dataBR, hojeISO } from '../utils.js';
import { criarCadastro } from './crud.js';

const nomeDoSetor = id => esc(buscar('setores', id)?.nome ?? '—');

function cadastroSetores() {
  return criarCadastro({
    colecao: 'setores',
    painel: $('#pSetores'),
    titulos: { novo: 'Novo setor', editar: 'Editar setor' },
    lerFormulario: ({ elements: c }) => ({
      nome: c.nome.value.trim(),
      cor: c.cor.value,
      bairros: linhas(c.bairros.value)
    }),
    preencherFormulario: ({ elements: c }, setor) => {
      c.nome.value = setor.nome;
      c.cor.value = setor.cor;
      c.bairros.value = setor.bairros.join('\n');
    },
    colunas: setor => `
      <td><span class="cor-bolinha" style="--cor:${esc(setor.cor)}"></span>${esc(setor.nome)}</td>
      <td>${setor.bairros.map(esc).join(', ')}</td>`,
    mensagemSalvo: () => 'Setor salvo.',
    excluir: id => {
      const vinculos = vinculosDoSetor(id);
      const pergunta = vinculos
        ? `Este setor possui ${vinculos} rota(s), dia(s) de coleta ou aviso(s) vinculados. Excluir o setor e todos eles?`
        : 'Confirmar exclusão do setor?';
      if (confirm(pergunta)) {
        removerSetor(id);
        toast('Setor excluído.');
      }
    }
  });
}

function cadastroRotas() {
  return criarCadastro({
    colecao: 'rotas',
    painel: $('#pRotas'),
    titulos: { novo: 'Nova rota', editar: 'Editar rota' },
    lerFormulario: ({ elements: c }) => ({
      nome: c.nome.value.trim(),
      setorId: c.setorId.value,
      logradouros: linhas(c.logradouros.value),
      veiculo: c.veiculo.value.trim(),
      responsavel: c.responsavel.value.trim()
    }),
    preencherFormulario: ({ elements: c }, rota) => {
      c.nome.value = rota.nome;
      c.setorId.value = rota.setorId;
      c.logradouros.value = rota.logradouros.join('\n');
      c.veiculo.value = rota.veiculo;
      c.responsavel.value = rota.responsavel;
    },
    colunas: rota => `
      <td><strong>${esc(rota.nome)}</strong><br><small>${esc([rota.veiculo, rota.responsavel].filter(Boolean).join(' · '))}</small></td>
      <td>${nomeDoSetor(rota.setorId)}</td>
      <td>${rota.logradouros.map(esc).join(', ')}</td>`,
    mensagemSalvo: () => 'Rota salva.'
  });
}

function cadastroColetas() {
  const painel = $('#pColetas');
  $('#coletaTipo').innerHTML = Object.entries(TIPOS_RESIDUO)
    .map(([valor, tipo]) => `<option value="${valor}">${tipo.nome}</option>`)
    .join('');
  $('#coletaDias').innerHTML = DIAS.map(
    (nome, i) => `<label title="${nome}"><input type="checkbox" name="dias" value="${i}"> ${DIAS_CURTO[i]}</label>`
  ).join('');
  const checkboxesDias = () => $$('input[name="dias"]', painel);

  return criarCadastro({
    colecao: 'coletas',
    painel,
    titulos: { novo: 'Novo dia de coleta', editar: 'Editar dia de coleta' },
    lerFormulario: ({ elements: c }) => {
      const dias = checkboxesDias()
        .filter(cb => cb.checked)
        .map(cb => Number(cb.value));
      if (!dias.length) return 'Selecione ao menos um dia da semana.';
      if (c.fim.value <= c.inicio.value) return 'O horário final deve ser depois do inicial.';
      return {
        setorId: c.setorId.value,
        tipo: c.tipo.value,
        dias,
        inicio: c.inicio.value,
        fim: c.fim.value,
        obs: c.obs.value.trim()
      };
    },
    preencherFormulario: ({ elements: c }, coleta) => {
      c.setorId.value = coleta.setorId;
      c.tipo.value = coleta.tipo;
      checkboxesDias().forEach(cb => {
        cb.checked = coleta.dias.includes(Number(cb.value));
      });
      c.inicio.value = coleta.inicio;
      c.fim.value = coleta.fim;
      c.obs.value = coleta.obs ?? '';
    },
    colunas: coleta => {
      const tipo = TIPOS_RESIDUO[coleta.tipo];
      return `
        <td>${nomeDoSetor(coleta.setorId)}</td>
        <td><span class="cor-bolinha" style="--cor:${tipo.cor}"></span>${esc(tipo.nome)}</td>
        <td>${coleta.dias.map(d => DIAS_CURTO[d]).join(', ')}</td>
        <td>${esc(coleta.inicio)}–${esc(coleta.fim)}</td>`;
    },
    mensagemSalvo: () => 'Dia de coleta salvo.'
  });
}

function cadastroAvisos() {
  $('#avisoTipo').innerHTML = Object.entries(PRIORIDADES)
    .map(([valor, rotulo]) => `<option value="${valor}">${rotulo}</option>`)
    .join('');
  $('#avisoInicio').defaultValue = hojeISO(); // restaurado a cada reset() do formulário

  return criarCadastro({
    colecao: 'avisos',
    painel: $('#pAvisos'),
    titulos: { novo: 'Novo aviso', editar: 'Editar aviso' },
    lerFormulario: ({ elements: c }) => {
      if (c.fim.value && c.fim.value < c.inicio.value) return 'A data final deve ser depois da data de publicação.';
      return {
        titulo: c.titulo.value.trim(),
        mensagem: c.mensagem.value.trim(),
        setorId: c.setorId.value,
        tipo: c.tipo.value,
        inicio: c.inicio.value,
        fim: c.fim.value
      };
    },
    preencherFormulario: ({ elements: c }, aviso) => {
      c.titulo.value = aviso.titulo;
      c.mensagem.value = aviso.mensagem;
      c.setorId.value = aviso.setorId;
      c.tipo.value = aviso.tipo;
      c.inicio.value = aviso.inicio;
      c.fim.value = aviso.fim ?? '';
    },
    colunas: aviso => `
      <td><span class="selo ${esc(aviso.tipo)}">${esc(PRIORIDADES[aviso.tipo])}</span> ${esc(aviso.titulo)}</td>
      <td>${aviso.setorId ? nomeDoSetor(aviso.setorId) : 'Todos'}</td>
      <td>${dataBR(aviso.inicio)}${aviso.fim ? ` a ${dataBR(aviso.fim)}` : ''}</td>`,
    mensagemSalvo: (aviso, novo) => {
      if (!novo) return 'Aviso atualizado.';
      const alcance = listar('inscritos').filter(i => !aviso.setorId || i.setorId === aviso.setorId).length;
      return `Aviso publicado. ${alcance} inscrito(s) no público-alvo.`;
    }
  });
}

/** Cria todos os cadastros e devolve uma função que os re-renderiza. */
export function iniciarCadastros() {
  const cadastros = [cadastroSetores(), cadastroRotas(), cadastroColetas(), cadastroAvisos()];
  return () => cadastros.forEach(c => c.render());
}
