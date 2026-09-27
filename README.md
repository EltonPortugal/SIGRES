# Coleta Itapuã

Sistema web para informatização e gestão do cronograma de coleta de resíduos sólidos do município de **Itapuã do Oeste/RO** — Projeto de Extensão.

Funcionalidades:

- **Consulta pública** por bairro ou endereço: setor, dias, horários e próxima coleta.
- **Calendário mensal** de coleta por setor (com impressão).
- **Avisos à população**, com filtro por setor e inscrição para recebê-los.
- **Área administrativa**: cadastro de setores, rotas, dias de coleta, avisos e gestão dos inscritos.

## Como executar

O projeto usa **módulos JavaScript (ES Modules)**, que os navegadores não carregam
quando o arquivo é aberto direto (`file://`). É preciso servir a pasta por HTTP:

- **VS Code:** instale a extensão *Live Server* e clique em **Go Live**; ou
- **Node.js:** `npx serve .` e acesse o endereço exibido; ou
- **Python:** `python -m http.server 8000` e acesse <http://localhost:8000>.

Área administrativa: `admin.html` — usuário `admin`, senha `admin123` (apenas demonstração).

## Estrutura

```
index.html              Página pública (consulta, calendário e avisos)
sobre.html              Sobre o projeto de extensão (objetivos, metodologia, números)
admin.html              Área administrativa
css/
  base.css              Variáveis, layout e componentes compartilhados
  publico.css           Estilos da página pública
  sobre.css             Estilos da página "Sobre o projeto"
  admin.css             Estilos da área administrativa
js/
  config.js             Constantes (dias da semana, tipos de resíduo, prioridades)
  utils.js              Funções puras (datas, escape de HTML, normalização de texto)
  store.js              Camada de dados (localStorage) — único ponto de leitura/escrita
  agenda.js             Regras de negócio: próxima coleta, avisos vigentes, busca por endereço
  ui.js                 Auxiliares de interface (toast, selects, download)
  menu.js               Menu do cabeçalho
  publico/              Módulos da página pública (consulta, calendário, avisos)
  admin/                Módulos da área administrativa (auth, CRUD genérico, cadastros, inscritos, backup)
  paginas/              Pontos de entrada de cada página
data/
  dados-exemplo.json    Dados fictícios carregados na primeira visita
img/
  icone.svg             Ícone/favicon
```

## Modelo de dados

| Coleção     | Campos principais                                                        |
|-------------|--------------------------------------------------------------------------|
| `setores`   | `id`, `nome`, `cor`, `bairros[]`                                         |
| `rotas`     | `id`, `nome`, `setorId`, `logradouros[]`, `veiculo`, `responsavel`       |
| `coletas`   | `id`, `setorId`, `tipo`, `dias[]` (0 = domingo), `inicio`, `fim`, `obs`  |
| `avisos`    | `id`, `titulo`, `mensagem`, `setorId` (vazio = todos), `tipo`, `inicio`, `fim` |
| `inscritos` | `id`, `nome`, `contato`, `setorId`, `data`                               |

## Limitações do protótipo

- Os dados ficam **apenas no navegador** de quem usa (localStorage). Use *Exportar/Importar backup* na área administrativa para transferi-los.
- O login é **somente demonstrativo** e não oferece segurança real.
- O envio de avisos é **simulado** (abre o WhatsApp com a mensagem pronta).
- Os setores, ruas e horários de `data/dados-exemplo.json` são **fictícios**.

Para produção, basta substituir a implementação de `js/store.js` por chamadas a uma API
(com banco de dados e autenticação no servidor), mantendo as mesmas funções exportadas.
