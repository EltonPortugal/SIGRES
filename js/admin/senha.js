// Derivação de senha com PBKDF2 (Web Crypto API). Usado no navegador e pelo
// script scripts/gerar-hash-senha.js, para que ambos produzam o mesmo resultado.

const paraHex = buffer => [...new Uint8Array(buffer)].map(b => b.toString(16).padStart(2, '0')).join('');

/**
 * @param {string} senha
 * @param {string} salt  Texto hexadecimal.
 * @param {number} iteracoes
 * @returns {Promise<string>} Hash hexadecimal de 256 bits.
 */
export async function derivarHash(senha, salt, iteracoes) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Criptografia indisponível: acesse o sistema por HTTPS.');
  const chave = await subtle.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: iteracoes },
    chave,
    256
  );
  return paraHex(bits);
}

/** Comparação em tempo constante, para não revelar quantos caracteres conferem. */
export function iguais(a, b) {
  if (a.length !== b.length) return false;
  let diferenca = 0;
  for (let i = 0; i < a.length; i++) diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diferenca === 0;
}
