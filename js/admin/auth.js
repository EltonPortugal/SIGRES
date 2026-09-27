// Autenticação de DEMONSTRAÇÃO. As credenciais ficam no código do navegador e
// não oferecem segurança real: em produção, a verificação deve ser feita no servidor.

import { CHAVE_SESSAO } from '../config.js';

const CREDENCIAIS_DEMO = { usuario: 'admin', senha: 'admin123' };

export function estaLogado() {
  try { return sessionStorage.getItem(CHAVE_SESSAO) === '1'; } catch { return false; }
}

export function entrar(usuario, senha) {
  const ok = usuario === CREDENCIAIS_DEMO.usuario && senha === CREDENCIAIS_DEMO.senha;
  if (ok) {
    try { sessionStorage.setItem(CHAVE_SESSAO, '1'); } catch { /* sessão vale só até recarregar */ }
  }
  return ok;
}

export function sair() {
  try { sessionStorage.removeItem(CHAVE_SESSAO); } catch { /* nada a limpar */ }
}
