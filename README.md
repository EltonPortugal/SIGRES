<div align="center">

<img src="img/icone.svg" width="72" alt="">

# SIGRES

**Sistema de Gestão do Cronograma de Coleta de Resíduos Sólidos**
Prefeitura Municipal de Itapuã do Oeste - Rondônia

[![CI](https://github.com/EltonPortugal/SIGRES/actions/workflows/ci.yml/badge.svg)](https://github.com/EltonPortugal/SIGRES/actions/workflows/ci.yml)
![Versão](https://img.shields.io/badge/vers%C3%A3o-1.0.0-0f4c35)
![Acessibilidade](https://img.shields.io/badge/acessibilidade-eMAG%203.1%20%7C%20WCAG%202.1%20AA-1351b4)
![LGPD](https://img.shields.io/badge/LGPD-em%20conformidade-17694a)

</div>

---

## Sumário

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Scripts disponíveis](#scripts-dispon%C3%ADveis)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Configuração antes da publicação](#configura%C3%A7%C3%A3o-antes-da-publica%C3%A7%C3%A3o)
- [Documentação](#documenta%C3%A7%C3%A3o)
- [Fluxo de desenvolvimento](#fluxo-de-desenvolvimento)
- [Limitações conhecidas e próximos passos](#limita%C3%A7%C3%B5es-conhecidas-e-pr%C3%B3ximos-passos)
- [Créditos](#cr%C3%A9ditos)

## Sobre

O SIGRES informatiza o cronograma de coleta de resíduos sólidos do município de Itapuã do Oeste/RO. A população
consulta pelo celular **quando o caminhão passa na sua rua**, e a Prefeitura mantém setores, rotas, horários e avisos
organizados em um só lugar.

O sistema foi desenvolvido em parceria com um **projeto de extensão universitária**.

## Funcionalidades

### Portal público

| Recurso                    | Descrição                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------- |
| Consulta por bairro ou rua | Setor, dias, horários, observações e **próxima coleta** (hoje, amanhã ou data).    |
| Calendário mensal          | Coletas do mês por setor, com versão para impressão identificada pela Prefeitura.  |
| Avisos à população         | Comunicados vigentes (informativo, alerta, urgente), filtráveis por setor.         |
| Inscrição para avisos      | Cadastro de telefone/WhatsApp ou e-mail, com consentimento registrado (LGPD).      |
| Acessibilidade             | Atalhos do eMAG, alto contraste, ajuste de fonte e calendário para leitor de tela. |

### Painel de gestão (acesso restrito)

| Recurso                 | Descrição                                                                                 |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Setores e bairros       | Cadastro com cor de identificação.                                                        |
| Rotas                   | Logradouros atendidos, veículo e equipe responsável.                                      |
| Dias de coleta          | Por setor e tipo de resíduo (comum, recicláveis, volumosos), dias da semana e horário.    |
| Avisos                  | Publicação com período de vigência e público-alvo (todos ou um setor).                    |
| Inscritos               | Lista de moradores, exportação CSV e envio de mensagem pelo WhatsApp.                     |
| Histórico de atividades | Trilha de auditoria de todas as ações (quem, o quê, quando), exportável em CSV.           |
| Backup                  | Exportação e importação em JSON, com validação da estrutura antes de substituir os dados. |

## Tecnologias

- **HTML5, CSS3 e JavaScript (ES Modules)** — sem framework e sem etapa de build; roda em qualquer servidor web estático.
- **Web Crypto API** — hash PBKDF2-SHA256 da senha administrativa.
- **Node.js ≥ 20** (apenas desenvolvimento) — testes com `node:test`, ESLint, Prettier e html-validate.
- **GitHub Actions** — integração contínua.

## Como executar

Pré-requisito: [Node.js 20 ou superior](https://nodejs.org/).

```bash
git clone https://github.com/EltonPortugal/SIGRES.git
cd SIGRES
npm install
npm start
```

Acesse <http://localhost:8080>. O painel de gestão fica em `/admin.html`.

> **Credencial de homologação:** usuário `admin`, senha `admin123`.
> Ela existe apenas para testes e **deve ser trocada antes da publicação** (veja abaixo).

<details>
<summary>Sem Node.js</summary>

Os módulos JavaScript não carregam ao abrir o arquivo direto (`file://`). Sirva a pasta por HTTP, por exemplo com
`python -m http.server 8080` ou com a extensão _Live Server_ do VS Code.

</details>

## Scripts disponíveis

| Comando                    | O que faz                                                |
| -------------------------- | -------------------------------------------------------- |
| `npm start`                | Servidor local em <http://localhost:8080>.               |
| `npm test`                 | Executa os testes automatizados.                         |
| `npm run lint`             | Analisa o JavaScript (ESLint) e valida o HTML.           |
| `npm run format`           | Formata o código com o Prettier.                         |
| `npm run check`            | Lint + formatação + testes (o mesmo que roda no CI).     |
| `npm run senha -- "senha"` | Gera o salt e o hash de uma nova senha de administrador. |

## Estrutura do projeto

```
├── index.html               Portal público (consulta, calendário e avisos)
├── sobre.html               Sobre o sistema
├── acessibilidade.html      Declaração de acessibilidade e atalhos
├── privacidade.html         Política de privacidade (LGPD)
├── admin.html               Painel de gestão
├── css/                     Estilos (base, público, institucional, painel)
├── js/
│   ├── config.js            Versão, ambiente, credencial, prazos e tabelas do domínio
│   ├── store.js             Camada de dados — único ponto de leitura/escrita
│   ├── agenda.js            Regras de negócio (próxima coleta, avisos, busca)
│   ├── validacao.js         Validação da estrutura de backups
│   ├── utils.js             Funções puras (datas, contato, escape de HTML)
│   ├── acessibilidade.js    Alto contraste e tamanho do texto
│   ├── publico/             Módulos do portal público
│   ├── admin/               Autenticação, cadastros, inscritos, auditoria e backup
│   └── paginas/             Ponto de entrada de cada página
├── data/dados-exemplo.json  Dados fictícios de demonstração
├── test/                    Testes automatizados (node:test)
├── scripts/                 Utilitários de linha de comando
└── docs/                    Documentação técnica e manuais
```

## Configuração antes da publicação

Edite `js/config.js`:

1. **Troque a senha do administrador** — `npm run senha -- "uma-senha-forte-e-longa"` e copie `salt` e `hash` para
   `CREDENCIAL_ADMIN`.
2. **Cadastre os dados oficiais** (setores, rotas, horários) pelo painel e exporte um backup.
3. **Mude `AMBIENTE` para `'producao'`** para remover a faixa de “ambiente de demonstração”.
4. Publique com **HTTPS** e os cabeçalhos de segurança descritos em [docs/IMPLANTACAO.md](docs/IMPLANTACAO.md).

## Documentação

| Documento                                               | Público                  |
| ------------------------------------------------------- | ------------------------ |
| [Manual do administrador](docs/MANUAL-ADMINISTRADOR.md) | Servidores da Prefeitura |
| [Guia de implantação](docs/IMPLANTACAO.md)              | Equipe de TI             |
| [Arquitetura e modelo de dados](docs/ARQUITETURA.md)    | Desenvolvedores          |
| [Como contribuir](CONTRIBUTING.md)                      | Desenvolvedores          |
| [Política de segurança](SECURITY.md)                    | Todos                    |
| [Histórico de versões](CHANGELOG.md)                    | Todos                    |

## Fluxo de desenvolvimento

O projeto segue o **Git Flow** com mensagens no padrão **Conventional Commits**:

- `main` — versão publicada (somente via release);
- `develop` — integração das funcionalidades;
- `feature/*`, `fix/*`, `docs/*` — trabalho em andamento, integrado em `develop` por pull request;
- `release/*` — preparação de uma nova versão.

Detalhes em [CONTRIBUTING.md](CONTRIBUTING.md).

## Limitações conhecidas e próximos passos

Nesta versão os dados ficam **no navegador** (localStorage) de quem administra, e a autenticação ocorre no próprio
navegador. Isso é adequado para homologação e para uma operação inicial em um único computador, mas **não substitui um
servidor**. O plano de evolução — API em Laravel com PostgreSQL, autenticação no servidor e envio automático de avisos —
está em [docs/ARQUITETURA.md](docs/ARQUITETURA.md#evolu%C3%A7%C3%A3o-para-servidor).

## Créditos

Desenvolvido por **Forge Tech: Elton Portugal, Rodrigo Eloi, Ricardo Prestes, Érick Vinícius, Eduardo Barros, Eduardo Belfort, Rogério Avelino, Matheus Januário** ([@EltonPortugal](https://github.com/EltonPortugal)) no âmbito de projeto de extensão
universitária, em parceria com a Prefeitura Municipal de Itapuã do Oeste/RO.
