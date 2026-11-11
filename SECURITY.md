# Política de segurança

## Versões suportadas

| Versão | Suporte            |
| ------ | ------------------ |
| 1.0.x  | :white_check_mark: |
| < 1.0  | :x:                |

## Como relatar uma vulnerabilidade

**Não abra uma issue pública.** Envie o relato de forma privada pela aba
[Security → Report a vulnerability](https://github.com/EltonPortugal/SIGRES/security/advisories/new) do repositório,
informando:

- descrição do problema e impacto possível;
- passos para reproduzir;
- versão e navegador utilizados.

Os relatos serão confirmados em até 5 dias úteis. Correções críticas são publicadas como `hotfix` e registradas no
[CHANGELOG](CHANGELOG.md).

## Escopo e limitações conhecidas

Nesta versão, sem servidor, os dados ficam no navegador do administrador e a autenticação é feita no próprio navegador
(ver [docs/ARQUITETURA.md](docs/ARQUITETURA.md#seguran%C3%A7a)). Relatos sobre essa limitação já documentada não são
considerados vulnerabilidades novas, mas sugestões de mitigação são bem-vindas.

## Boas práticas para quem opera o sistema

- Troque a senha de homologação antes de publicar (`npm run senha`).
- Publique somente com HTTPS e os cabeçalhos de [docs/IMPLANTACAO.md](docs/IMPLANTACAO.md).
- Restrinja o acesso ao painel à rede da Prefeitura, quando possível.
- Não versione backups nem listas de inscritos (o `.gitignore` já os bloqueia).
