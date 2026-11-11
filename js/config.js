// Constantes compartilhadas por todo o sistema.

/** Versão exibida no rodapé. Atualize a cada release (ver CHANGELOG.md). */
export const VERSAO = '1.0.0';

/**
 * Ambiente de execução:
 * - 'homologacao': exibe a faixa de "ambiente de demonstração" (dados fictícios);
 * - 'producao': oculta a faixa. Use somente com os dados oficiais cadastrados.
 */
export const AMBIENTE = 'homologacao';

export const CHAVE_DADOS = 'coletaItapua.v1';
export const CHAVE_SESSAO = 'coletaItapua.admin';
export const CHAVE_TENTATIVAS = 'coletaItapua.tentativas';

/**
 * Credencial do administrador (somente o hash PBKDF2-SHA256 é armazenado).
 * A senha padrão de homologação é "admin123" — TROQUE antes de publicar,
 * gerando novos valores com: npm run senha -- "nova-senha-forte"
 */
export const CREDENCIAL_ADMIN = {
  usuario: 'admin',
  salt: '9f2c7a1e5b8d4036a1c2e3f405162738',
  hash: '4a3da2112ce0a78b6bf43b3f6f40fd3d053d040a4c4e06405f31e1300330c7e7',
  iteracoes: 210000
};

/** Encerra a sessão administrativa após este tempo sem atividade. */
export const SESSAO_MINUTOS = 30;
/** Tentativas de login incorretas antes do bloqueio temporário. */
export const TENTATIVAS_MAX = 5;
export const BLOQUEIO_MINUTOS = 5;

/** Coleções que compõem a base de dados. */
export const COLECOES = ['setores', 'rotas', 'coletas', 'avisos', 'inscritos'];

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const TIPOS_RESIDUO = {
  comum: { nome: 'Lixo comum / orgânico', cor: '#5d6d64' },
  reciclavel: { nome: 'Recicláveis', cor: '#1d5fa8' },
  volumosos: { nome: 'Galhos e volumosos', cor: '#9a6b12' }
};

export const PRIORIDADES = {
  info: 'Informativo',
  alerta: 'Alerta',
  urgente: 'Urgente'
};
