// Constantes compartilhadas por todo o sistema.

export const CHAVE_DADOS = 'coletaItapua.v1';
export const CHAVE_SESSAO = 'coletaItapua.admin';

/** Coleções que compõem a base de dados. */
export const COLECOES = ['setores', 'rotas', 'coletas', 'avisos', 'inscritos'];

export const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const DIAS_CURTO = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const TIPOS_RESIDUO = {
  comum:      { nome: 'Lixo comum / orgânico', cor: '#5d6d64' },
  reciclavel: { nome: 'Recicláveis',           cor: '#1d5fa8' },
  volumosos:  { nome: 'Galhos e volumosos',    cor: '#9a6b12' }
};

export const PRIORIDADES = {
  info: 'Informativo',
  alerta: 'Alerta',
  urgente: 'Urgente'
};
