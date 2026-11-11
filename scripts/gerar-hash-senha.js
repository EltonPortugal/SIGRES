#!/usr/bin/env node
// Gera o salt e o hash da senha do administrador para js/config.js.
// Uso: npm run senha -- "nova-senha-forte"

import { randomBytes } from 'node:crypto';
import { derivarHash } from '../js/admin/senha.js';
import { CREDENCIAL_ADMIN } from '../js/config.js';

const senha = process.argv[2];
if (!senha || senha.length < 10) {
  console.error('Informe uma senha com pelo menos 10 caracteres: npm run senha -- "minha-senha-forte"');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const hash = await derivarHash(senha, salt, CREDENCIAL_ADMIN.iteracoes);

console.log('Substitua em js/config.js (CREDENCIAL_ADMIN):\n');
console.log(`  salt: '${salt}',`);
console.log(`  hash: '${hash}',`);
