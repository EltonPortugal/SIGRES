# Arquitetura e modelo de dados

## Visão geral

O SIGRES é uma aplicação web **estática**: HTML, CSS e JavaScript em módulos ES, sem etapa de build. Cada página tem um
ponto de entrada em `js/paginas/` que inicializa somente os módulos de que precisa.

```
            ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
 Páginas    │  index.html   │   │  admin.html   │   │ sobre / etc.  │
            └──────┬────────┘   └──────┬────────┘   └──────┬────────┘
                   │                   │                   │
 Entrada    js/paginas/index.js  js/paginas/admin.js  js/paginas/*.js
                   │                   │
 Interface  js/publico/*         js/admin/*  (cadastros, auth, auditoria, backup)
                   │                   │
 Domínio           └──── js/agenda.js ─┘   js/validacao.js
                              │
 Dados                    js/store.js  ──►  localStorage (navegador)
```

### Camadas

| Camada    | Arquivos                                                      | Responsabilidade                                                       |
| --------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Dados     | `store.js`                                                    | Único ponto de leitura e escrita; migração de versões; notificações.   |
| Domínio   | `agenda.js`, `validacao.js`, `utils.js`                       | Regras de negócio e funções puras — cobertas por testes automatizados. |
| Interface | `publico/`, `admin/`, `ui.js`, `menu.js`, `acessibilidade.js` | Renderização e eventos.                                                |
| Entrada   | `paginas/`                                                    | Orquestra a inicialização de cada página.                              |

Toda mudança nos dados passa por `store.js`, que persiste e notifica as telas (`aoMudar`). Abas abertas no mesmo
navegador ficam sincronizadas pelo evento `storage`.

## Modelo de dados

| Coleção     | Campos                                                                                                            |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `setores`   | `id`, `nome`, `cor`, `bairros[]`                                                                                  |
| `rotas`     | `id`, `nome`, `setorId`, `logradouros[]`, `veiculo`, `responsavel`                                                |
| `coletas`   | `id`, `setorId`, `tipo` (`comum`, `reciclavel`, `volumosos`), `dias[]` (0 = domingo), `inicio`, `fim`, `obs`      |
| `avisos`    | `id`, `titulo`, `mensagem`, `setorId` (vazio = todos), `tipo` (`info`, `alerta`, `urgente`), `inicio`, `fim`      |
| `inscritos` | `id`, `nome`, `contato`, `tipoContato` (`telefone`, `email`), `setorId`, `data`, `consentimento { versao, data }` |
| `auditoria` | `id`, `data` (ISO 8601), `usuario`, `acao`, `descricao` — no máximo 1.000 registros                               |

Excluir um setor remove as rotas, coletas e avisos vinculados (com confirmação); os inscritos são mantidos.

## Segurança

| Medida                         | Onde                                    |
| ------------------------------ | --------------------------------------- |
| Content-Security-Policy        | `<meta>` em todas as páginas            |
| Escape de todo texto dinâmico  | `utils.esc()` em toda interpolação HTML |
| Senha com PBKDF2-SHA256 + salt | `admin/senha.js`, `config.js`           |
| Bloqueio por tentativas        | `admin/auth.js`                         |
| Expiração por inatividade      | `admin/auth.js`, `paginas/admin.js`     |
| Trilha de auditoria            | `admin/auditoria.js`                    |
| Validação de backups           | `validacao.js`                          |

> **Limitação:** enquanto não houver servidor, a autenticação protege a interface, mas não os dados: quem tem acesso
> ao computador e ao navegador do administrador pode lê-los. Por isso a evolução abaixo é recomendada antes de operar
> com a lista de inscritos em larga escala.

## Evolução para servidor

A camada `store.js` foi desenhada para ser substituída sem alterar as telas: basta reimplementar as funções exportadas
(`iniciar`, `listar`, `buscar`, `salvarItem`, `removerItem`, `removerSetor`, `substituirTudo`, `registrarAtividade`…)
chamando uma API.

Arquitetura-alvo proposta:

- **Back-end:** Laravel (PHP) expondo API REST (`/api/setores`, `/api/rotas`, `/api/coletas`, `/api/avisos`,
  `/api/inscricoes`) — leitura pública, escrita autenticada.
- **Banco de dados:** PostgreSQL, com as tabelas acima e chaves estrangeiras para `setor_id`.
- **Autenticação:** sessões no servidor (Laravel Sanctum), usuários individuais por servidor público e perfis
  (administrador, operador).
- **Avisos:** fila de envio integrada a SMS, WhatsApp Business API ou e-mail.
- **Auditoria:** gravada no servidor, imutável para os usuários do painel.
