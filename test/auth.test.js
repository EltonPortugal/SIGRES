import './ambiente.js';
import { test, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { entrar, estaLogado, sair, renovarSessao, minutosDeBloqueio, usuarioLogado } from '../js/admin/auth.js';
import { derivarHash, iguais } from '../js/admin/senha.js';
import { CREDENCIAL_ADMIN, SESSAO_MINUTOS, TENTATIVAS_MAX, BLOQUEIO_MINUTOS } from '../js/config.js';

const MINUTO = 60_000;
const SENHA_TESTE = 'senha-de-teste-123';

// Os testes usam uma credencial própria, para não depender da senha real configurada.
before(async () => {
  CREDENCIAL_ADMIN.salt = 'salt-de-teste';
  CREDENCIAL_ADMIN.hash = await derivarHash(SENHA_TESTE, CREDENCIAL_ADMIN.salt, CREDENCIAL_ADMIN.iteracoes);
});

beforeEach(() => sessionStorage.clear());

test('derivarHash é determinístico e depende do salt', async () => {
  const a = await derivarHash('x', 'salt1', 1000);
  assert.equal(a, await derivarHash('x', 'salt1', 1000));
  assert.notEqual(a, await derivarHash('x', 'salt2', 1000));
  assert.match(a, /^[0-9a-f]{64}$/);
});

test('iguais compara textos corretamente', () => {
  assert.ok(iguais('abc', 'abc'));
  assert.ok(!iguais('abc', 'abd'));
  assert.ok(!iguais('abc', 'abcd'));
});

test('login com credenciais corretas abre a sessão', async () => {
  const resultado = await entrar(' Admin ', SENHA_TESTE);
  assert.deepEqual(resultado, { ok: true });
  assert.ok(estaLogado());
  assert.equal(usuarioLogado(), 'admin');
  sair();
  assert.ok(!estaLogado());
});

test('senha incorreta informa as tentativas restantes', async () => {
  const resultado = await entrar('admin', 'errada');
  assert.equal(resultado.ok, false);
  assert.match(resultado.motivo, new RegExp(`Restam ${TENTATIVAS_MAX - 1}`));
});

test(`bloqueia após ${TENTATIVAS_MAX} tentativas e libera depois de ${BLOQUEIO_MINUTOS} min`, async () => {
  const agora = Date.now();
  for (let i = 0; i < TENTATIVAS_MAX; i++) await entrar('admin', 'errada', agora);
  assert.equal(minutosDeBloqueio(agora), BLOQUEIO_MINUTOS);

  const bloqueado = await entrar('admin', SENHA_TESTE, agora + MINUTO);
  assert.equal(bloqueado.ok, false);
  assert.match(bloqueado.motivo, /bloqueado/);

  const depois = agora + BLOQUEIO_MINUTOS * MINUTO + 1;
  assert.equal(minutosDeBloqueio(depois), 0);
  assert.deepEqual(await entrar('admin', SENHA_TESTE, depois), { ok: true });
});

test('sessão expira por inatividade e é renovada com atividade', async () => {
  const inicio = Date.now();
  await entrar('admin', SENHA_TESTE, inicio);
  const quaseExpirando = inicio + (SESSAO_MINUTOS - 1) * MINUTO;
  assert.ok(estaLogado(quaseExpirando));

  renovarSessao(quaseExpirando);
  assert.ok(estaLogado(inicio + (SESSAO_MINUTOS + 5) * MINUTO));
  assert.ok(!estaLogado(quaseExpirando + (SESSAO_MINUTOS + 1) * MINUTO));
});
