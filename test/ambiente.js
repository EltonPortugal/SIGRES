// Simula as APIs do navegador usadas pelo sistema (localStorage, sessionStorage, window),
// para que os módulos possam ser testados no Node.js.

class ArmazenamentoEmMemoria {
  #itens = new Map();
  getItem(chave) {
    return this.#itens.has(chave) ? this.#itens.get(chave) : null;
  }
  setItem(chave, valor) {
    this.#itens.set(chave, String(valor));
  }
  removeItem(chave) {
    this.#itens.delete(chave);
  }
  clear() {
    this.#itens.clear();
  }
}

globalThis.localStorage = new ArmazenamentoEmMemoria();
globalThis.sessionStorage = new ArmazenamentoEmMemoria();
globalThis.window = { addEventListener() {} };
