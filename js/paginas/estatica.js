// Ponto de entrada das páginas institucionais sem dados (acessibilidade, privacidade).

import { iniciarMenu } from '../menu.js';
import { iniciarAcessibilidade } from '../acessibilidade.js';
import { marcarCarregado } from '../ui.js';

iniciarAcessibilidade();
iniciarMenu();
marcarCarregado();
