// Autenticação da área administrativa.
//
// ATENÇÃO: enquanto o sistema for estático (sem servidor), esta verificação
// protege apenas a interface — quem tem acesso ao navegador e ao código pode
// contorná-la. Em produção, a autenticação deve ser feita no servidor
// (ver docs/ARQUITETURA.md). Mesmo assim, a senha nunca fica em texto puro,
// há bloqueio após tentativas incorretas e expiração por inatividade.

import {
  CHAVE_SESSAO,
  CHAVE_TENTATIVAS,
  CREDENCIAL_ADMIN,
  SESSAO_MINUTOS,
  TENTATIVAS_MAX,
  BLOQUEIO_MINUTOS
} from '../config.js';
import { derivarHash, iguais } from './senha.js';

const MINUTO = 60_000;

function ler(chave) {
  try {
    return JSON.parse(sessionStorage.getItem(chave));
  } catch {
    return null;
  }
}

function gravar(chave, valor) {
  try {
    if (valor === null) sessionStorage.removeItem(chave);
    else sessionStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* armazenamento indisponível: a sessão dura até recarregar a página */
  }
}

/** Sessão ativa e não expirada. */
export function estaLogado(agora = Date.now()) {
  const sessao = ler(CHAVE_SESSAO);
  if (!sessao || sessao.expiraEm <= agora) {
    if (sessao) gravar(CHAVE_SESSAO, null);
    return false;
  }
  return true;
}

export const usuarioLogado = () => ler(CHAVE_SESSAO)?.usuario ?? null;

/** Renova o prazo de expiração (chamado a cada interação do usuário). */
export function renovarSessao(agora = Date.now()) {
  const sessao = ler(CHAVE_SESSAO);
  if (sessao) gravar(CHAVE_SESSAO, { ...sessao, expiraEm: agora + SESSAO_MINUTOS * MINUTO });
}

/** Minutos restantes de bloqueio por excesso de tentativas (0 = liberado). */
export function minutosDeBloqueio(agora = Date.now()) {
  const { bloqueadoAte = 0 } = ler(CHAVE_TENTATIVAS) ?? {};
  return bloqueadoAte > agora ? Math.ceil((bloqueadoAte - agora) / MINUTO) : 0;
}

/**
 * @returns {Promise<{ok: true} | {ok: false, motivo: string}>}
 */
export async function entrar(usuario, senha, agora = Date.now()) {
  const bloqueio = minutosDeBloqueio(agora);
  if (bloqueio) return { ok: false, motivo: `Acesso bloqueado por excesso de tentativas. Tente em ${bloqueio} min.` };

  const hash = await derivarHash(senha, CREDENCIAL_ADMIN.salt, CREDENCIAL_ADMIN.iteracoes);
  const ok = iguais(usuario.trim().toLowerCase(), CREDENCIAL_ADMIN.usuario) && iguais(hash, CREDENCIAL_ADMIN.hash);

  if (ok) {
    gravar(CHAVE_TENTATIVAS, null);
    gravar(CHAVE_SESSAO, {
      usuario: CREDENCIAL_ADMIN.usuario,
      inicio: agora,
      expiraEm: agora + SESSAO_MINUTOS * MINUTO
    });
    return { ok: true };
  }

  const falhas = (ler(CHAVE_TENTATIVAS)?.falhas ?? 0) + 1;
  if (falhas >= TENTATIVAS_MAX) {
    gravar(CHAVE_TENTATIVAS, { falhas: 0, bloqueadoAte: agora + BLOQUEIO_MINUTOS * MINUTO });
    return {
      ok: false,
      motivo: `Acesso bloqueado por ${BLOQUEIO_MINUTOS} min após ${TENTATIVAS_MAX} tentativas incorretas.`
    };
  }
  gravar(CHAVE_TENTATIVAS, { falhas });
  return { ok: false, motivo: `Usuário ou senha inválidos. Restam ${TENTATIVAS_MAX - falhas} tentativa(s).` };
}

export function sair() {
  gravar(CHAVE_SESSAO, null);
}
