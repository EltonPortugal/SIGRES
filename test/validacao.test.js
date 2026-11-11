import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validarBase } from '../js/validacao.js';

const exemplo = () => JSON.parse(readFileSync(new URL('../data/dados-exemplo.json', import.meta.url)));

test('os dados de exemplo são uma base válida', () => {
  assert.deepEqual(validarBase(exemplo()), []);
});

test('rejeita conteúdo que não é objeto ou não tem todas as coleções', () => {
  assert.equal(validarBase(null).length, 1);
  assert.equal(validarBase([]).length, 1);
  const base = exemplo();
  delete base.inscritos;
  assert.match(validarBase(base)[0], /inscritos/);
});

test('detecta identificadores ausentes ou duplicados', () => {
  const base = exemplo();
  base.setores[1].id = base.setores[0].id;
  delete base.avisos[0].id;
  const erros = validarBase(base);
  assert.ok(erros.some(e => /duplicado/.test(e)));
  assert.ok(erros.some(e => /avisos\[0\]: sem identificador/.test(e)));
});

test('detecta dias, horários e tipos de resíduo inválidos', () => {
  const base = exemplo();
  base.coletas[0].dias = [7];
  base.coletas[1].inicio = '25:00';
  base.coletas[2].tipo = 'nuclear';
  const erros = validarBase(base);
  assert.equal(erros.length, 3);
});

test('detecta referência a setor inexistente', () => {
  const base = exemplo();
  base.rotas[0].setorId = 'setor-99';
  assert.match(validarBase(base)[0], /setor inexistente/);
});

test('aviso geral (setorId vazio) é aceito; prioridade desconhecida não', () => {
  const base = exemplo();
  base.avisos[0].setorId = '';
  base.avisos[1].tipo = 'pânico';
  const erros = validarBase(base);
  assert.equal(erros.length, 1);
  assert.match(erros[0], /prioridade/);
});
