# Como contribuir

Obrigado por colaborar com o SIGRES! Este guia descreve o fluxo de trabalho da equipe.

## Ambiente

```bash
npm install
npm start        # http://localhost:8080
npm run check    # deve passar antes de abrir um pull request
```

## Branches (Git Flow)

| Branch      | Uso                                                                   |
| ----------- | --------------------------------------------------------------------- |
| `main`      | Versão em produção. Recebe apenas merges de `release/*` e `hotfix/*`. |
| `develop`   | Integração. Base para novas branches.                                 |
| `feature/*` | Nova funcionalidade (ex.: `feature/envio-sms`).                       |
| `fix/*`     | Correção de defeito encontrado em `develop`.                          |
| `docs/*`    | Somente documentação.                                                 |
| `release/*` | Preparação de versão (ex.: `release/1.1.0`).                          |
| `hotfix/*`  | Correção urgente em produção, criada a partir de `main`.              |

```bash
git switch develop && git pull
git switch -c feature/minha-funcionalidade
# ... commits ...
git push -u origin feature/minha-funcionalidade
# abra um pull request para develop
```

## Mensagens de commit

Padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), em português, no imperativo:

```
<tipo>(<escopo opcional>): <descrição curta>

<corpo opcional explicando o porquê>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`.
Exemplos: `feat(avisos): permite anexar imagem`, `fix(a11y): corrige ordem de foco no menu`.

## Padrões de código

- JavaScript em módulos ES, sem dependências em tempo de execução.
- Todo texto vindo dos dados deve passar por `esc()` antes de ir para `innerHTML`.
- Leitura e escrita de dados somente via `store.js`.
- Regras de negócio em funções puras (`agenda.js`, `utils.js`, `validacao.js`), com testes em `test/`.
- Toda ação do painel que altera dados deve chamar `registrar()` (auditoria).
- Interface: rótulos em todos os campos, contraste AA, navegável por teclado — ver
  [acessibilidade.html](acessibilidade.html).

## Pull requests

- Descreva o que mudou e por quê; inclua capturas de tela para mudanças visuais.
- Mantenha o PR pequeno e focado.
- O CI (lint, formatação e testes) precisa estar verde.
- Atualize o `CHANGELOG.md` na seção “Não lançado”.
