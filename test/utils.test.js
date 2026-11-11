import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  hojeISO,
  dataBR,
  paraMinutos,
  esc,
  normalizar,
  linhas,
  validarContato,
  formatarTelefone,
  uid
} from '../js/utils.js';

test('hojeISO usa a data local no formato AAAA-MM-DD', () => {
  assert.equal(hojeISO(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
  assert.equal(hojeISO(new Date(2026, 11, 31, 0, 1)), '2026-12-31');
});

test('dataBR converte AAAA-MM-DD para DD/MM/AAAA', () => {
  assert.equal(dataBR('2026-11-11'), '11/11/2026');
  assert.equal(dataBR(''), '');
  assert.equal(dataBR(undefined), '');
});

test('paraMinutos converte HH:MM', () => {
  assert.equal(paraMinutos('00:00'), 0);
  assert.equal(paraMinutos('07:30'), 450);
  assert.equal(paraMinutos('23:59'), 1439);
});

test('esc neutraliza caracteres especiais de HTML', () => {
  assert.equal(esc('<script>alert("x")</script>'), '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  assert.equal(esc("O'Brien & Cia"), 'O&#39;Brien &amp; Cia');
  assert.equal(esc(null), '');
});

test('normalizar remove acentos, espaços extras e caixa', () => {
  assert.equal(normalizar('  São José  '), 'sao jose');
  assert.equal(normalizar('ITAPUÃ'), 'itapua');
});

test('linhas descarta linhas vazias e espaços', () => {
  assert.deepEqual(linhas('Centro\n\n  Vila Nova  \n'), ['Centro', 'Vila Nova']);
});

test('validarContato aceita celular, fixo e e-mail', () => {
  assert.deepEqual(validarContato('(69) 9 9123-4567'), { tipo: 'telefone', valor: '69991234567' });
  assert.deepEqual(validarContato('+55 69 3535-1234'), { tipo: 'telefone', valor: '6935351234' });
  assert.deepEqual(validarContato(' Fulano@Exemplo.com.br '), { tipo: 'email', valor: 'fulano@exemplo.com.br' });
});

test('validarContato rejeita contatos inválidos', () => {
  for (const invalido of ['', '123', '99123-4567', '00 91234-5678', 'fulano@', 'texto qualquer']) {
    assert.equal(validarContato(invalido), null, invalido);
  }
});

test('formatarTelefone formata celular e fixo', () => {
  assert.equal(formatarTelefone('69991234567'), '(69) 9 9123-4567');
  assert.equal(formatarTelefone('6935351234'), '(69) 3535-1234');
});

test('uid gera identificadores distintos', () => {
  const ids = new Set(Array.from({ length: 500 }, uid));
  assert.equal(ids.size, 500);
});
