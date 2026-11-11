# Histórico de versões

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem o
[Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

## [1.0.0] — 2026-11-11

Primeira versão institucional, preparada para uso pela Prefeitura Municipal de Itapuã do Oeste/RO.

### Adicionado

- Identidade visual institucional: barra da Prefeitura, novo cabeçalho e rodapé, ícone e manifesto web.
- Faixa de “ambiente de demonstração” enquanto `AMBIENTE` não for `producao`; versão exibida no rodapé.
- Acessibilidade (eMAG 3.1 / WCAG 2.1 AA): atalhos de teclado 1–4, alto contraste, ajuste do tamanho do texto, abas
  navegáveis por setas, calendário descrito para leitores de tela e página de declaração de acessibilidade.
- Segurança: Content-Security-Policy; senha com PBKDF2-SHA256; bloqueio após 5 tentativas; expiração da sessão por
  inatividade; script `npm run senha`.
- Histórico de atividades (auditoria) no painel, com exportação em CSV.
- LGPD: política de privacidade, registro da versão/data do consentimento, validação de telefone/e-mail, inscrições
  sem duplicidade e alerta ao exportar dados pessoais.
- Validação completa de backups antes da importação, com resumo e confirmação.
- Testes automatizados (34 casos), ESLint, Prettier, html-validate e CI no GitHub Actions.
- Documentação: README, arquitetura, guia de implantação (Nginx), manual do administrador, guia de contribuição,
  política de segurança e modelos de issue/PR.

### Alterado

- Sistema renomeado de “Coleta Itapuã” para **SIGRES**; “Área administrativa” passa a “Painel de gestão”.
- Paleta de cores com contraste adequado e foco visível reforçado.
- Calendário impresso identifica a Prefeitura e a fonte.
- Arquivos exportados passam a se chamar `sigres-*.{json,csv}` com data.

### Removido

- Credenciais de demonstração exibidas na tela de login.
- Senha do administrador em texto puro no código.

## [0.1.0] — 2026-09-27

- Protótipo do projeto de extensão: consulta por bairro/endereço, calendário mensal, avisos, inscrição e área
  administrativa com dados no navegador.

[Não lançado]: https://github.com/EltonPortugal/SIGRES/compare/v1.0.0...develop
[1.0.0]: https://github.com/EltonPortugal/SIGRES/releases/tag/v1.0.0
