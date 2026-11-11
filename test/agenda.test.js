import './ambiente.js';
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CHAVE_DADOS } from '../js/config.js';

const base = JSON.parse(readFileSync(new URL('../data/dados-exemplo.json', import.meta.url)));
base.avisos.push(
  {
    id: 'aviso-antigo',
    titulo: 'Expirado',
    mensagem: '-',
    setorId: '',
    tipo: 'info',
    inicio: '2020-01-01',
    fim: '2020-01-31'
  },
  { id: 'aviso-futuro', titulo: 'Futuro', mensagem: '-', setorId: '', tipo: 'info', inicio: '2999-01-01', fim: '' },
  {
    id: 'aviso-setor2',
    titulo: 'Setor 2',
    mensagem: '-',
    setorId: 'setor-2',
    tipo: 'urgente',
    inicio: '2026-03-01',
    fim: ''
  }
);
base.avisos.forEach(a => {
  a.inicio ||= '2026-01-01';
});
localStorage.setItem(CHAVE_DADOS, JSON.stringify(base));

let agenda;
before(async () => {
  await (await import('../js/store.js')).iniciar();
  agenda = await import('../js/agenda.js');
});

// Coleta comum do Setor 1: segunda, quarta e sexta, das 07:00 às 11:00.
const coletaSetor1 = () => base.coletas.find(c => c.id === 'coleta-1');

test('proximaData retorna o próprio dia se a coleta ainda não terminou', () => {
  const quartaManha = new Date(2026, 10, 11, 9, 0); // 11/11/2026, quarta-feira
  const { data, emDias } = agenda.proximaData(coletaSetor1(), quartaManha);
  assert.equal(emDias, 0);
  assert.equal(data.getDate(), 11);
});

test('proximaData pula para o próximo dia de coleta após o horário final', () => {
  const quartaTarde = new Date(2026, 10, 11, 11, 1);
  const { data, emDias } = agenda.proximaData(coletaSetor1(), quartaTarde);
  assert.equal(emDias, 2); // sexta-feira
  assert.equal(data.getDay(), 5);
});

test('proximaData atravessa a semana quando necessário', () => {
  const coletaSabado = { dias: [6], inicio: '07:00', fim: '11:00' };
  const sabadoNoite = new Date(2026, 10, 14, 20, 0);
  assert.equal(agenda.proximaData(coletaSabado, sabadoNoite).emDias, 7);
});

test('proximaColetaDoSetor escolhe a mais próxima entre os tipos de resíduo', () => {
  const segundaNoite = new Date(2026, 10, 9, 20, 0); // próxima: terça (recicláveis)
  const { coleta, proxima } = agenda.proximaColetaDoSetor('setor-1', segundaNoite);
  assert.equal(coleta.tipo, 'reciclavel');
  assert.equal(proxima.emDias, 1);
});

test('proximaColetaDoSetor devolve null para setor sem coletas', () => {
  assert.equal(agenda.proximaColetaDoSetor('setor-inexistente'), null);
});

test('descreverData usa "Hoje" e "Amanhã"', () => {
  assert.equal(agenda.descreverData({ data: new Date(), emDias: 0 }), 'Hoje');
  assert.equal(agenda.descreverData({ data: new Date(), emDias: 1 }), 'Amanhã');
  assert.match(agenda.descreverData({ data: new Date(2026, 10, 13), emDias: 2 }), /^Sexta, 13\/11\/2026$/);
});

test('avisosAtivos ignora avisos expirados e futuros', () => {
  const ids = agenda.avisosAtivos(undefined, '2026-11-11').map(a => a.id);
  assert.ok(!ids.includes('aviso-antigo'));
  assert.ok(!ids.includes('aviso-futuro'));
  assert.ok(ids.includes('aviso-setor2'));
});

test('avisosAtivos de um setor inclui os gerais e exclui os de outros setores', () => {
  const ids = agenda.avisosAtivos('setor-1', '2026-11-11').map(a => a.id);
  assert.ok(ids.includes('aviso-1')); // geral
  assert.ok(ids.includes('aviso-2')); // do setor 1
  assert.ok(!ids.includes('aviso-setor2'));
});

test('buscarPorEndereco encontra pelo bairro sem diferenciar acentos e maiúsculas', () => {
  const [resultado] = agenda.buscarPorEndereco('jardim das PALMEIRAS');
  assert.equal(resultado.setor.id, 'setor-2');
});

test('buscarPorEndereco encontra pelo logradouro e informa a rota', () => {
  const [resultado] = agenda.buscarPorEndereco('rua acre');
  assert.equal(resultado.setor.id, 'setor-1');
  assert.match(resultado.motivos[0], /Rota B/);
});

test('buscarPorEndereco retorna vazio para termo em branco ou inexistente', () => {
  assert.deepEqual(agenda.buscarPorEndereco('   '), []);
  assert.deepEqual(agenda.buscarPorEndereco('Bairro que não existe'), []);
});

test('sugestoesDeEndereco lista bairros e ruas sem repetição, em ordem alfabética', () => {
  const sugestoes = agenda.sugestoesDeEndereco();
  assert.equal(new Set(sugestoes).size, sugestoes.length);
  assert.deepEqual(
    [...sugestoes].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    sugestoes
  );
  assert.ok(sugestoes.includes('Centro') && sugestoes.includes('Rua das Flores'));
});
