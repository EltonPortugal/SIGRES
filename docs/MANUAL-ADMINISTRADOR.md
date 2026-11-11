# Manual do administrador

Guia para os servidores da Prefeitura que mantêm o cronograma de coleta no SIGRES.

## Acesso

1. Abra o endereço do sistema e clique em **Acesso restrito** (ou acesse `/admin.html`).
2. Informe usuário e senha.

Por segurança:

- após **5 tentativas incorretas**, o acesso fica bloqueado por 5 minutos;
- a sessão é encerrada após **30 minutos sem atividade**;
- sempre clique em **Sair** ao terminar, principalmente em computadores compartilhados.

## Ordem recomendada de cadastro

Os cadastros dependem uns dos outros. Na primeira configuração, siga esta ordem:

1. **Setores** — divisão da cidade atendida pela coleta. Informe os bairros, um por linha.
2. **Rotas** — ruas atendidas em cada setor, veículo e equipe. A busca do portal encontra o setor também pelo nome da
   rua, então cadastre os logradouros como a população os conhece.
3. **Dias de coleta** — para cada setor e tipo de resíduo, marque os dias da semana e o horário.
4. **Avisos** — comunicados à população.

## Avisos

| Campo       | Orientação                                                                                |
| ----------- | ----------------------------------------------------------------------------------------- |
| Destino     | “Todos os setores” ou um setor específico.                                                |
| Prioridade  | **Informativo** (orientações), **Alerta** (mudanças), **Urgente** (suspensão do serviço). |
| Publicar em | O aviso aparece no portal a partir desta data.                                            |
| Válido até  | Opcional. Depois desta data o aviso sai do portal automaticamente.                        |

Ao publicar, o sistema informa quantos inscritos estão no público-alvo.

## Inscritos

A aba **Inscritos** lista os moradores que pediram para receber avisos.

- **Enviar WhatsApp** abre o WhatsApp com o último aviso do setor do morador já escrito.
- **Exportar CSV** gera a lista para uso em outra ferramenta de envio.
- **Excluir** remove o morador — faça isso sempre que ele pedir (direito garantido pela LGPD).

> Os dados dos inscritos são pessoais. Use-os **somente** para avisos da coleta, não os encaminhe a terceiros e apague
> os arquivos exportados depois do uso.

## Histórico de atividades

A aba **Atividades** registra automaticamente cada entrada, saída, cadastro, alteração, exclusão, importação e
exportação, com data, hora e usuário. Use **Exportar CSV** para anexar o histórico a relatórios ou processos.

## Backup

Nesta versão os dados ficam salvos no navegador do computador usado para administrar. Portanto:

- **Exporte um backup (JSON) toda semana** e após cada alteração importante, guardando-o na rede da Prefeitura;
- para administrar em outro computador, use **Importar backup** nele;
- não limpe os dados de navegação do navegador usado no painel sem antes exportar o backup.

Na importação, o sistema verifica o arquivo e mostra um resumo antes de substituir os dados atuais.

**Dados de exemplo** substitui tudo pelos dados fictícios de demonstração — use apenas em treinamentos.

## Dúvidas frequentes

**O morador diz que a rua dele não aparece na busca.** Cadastre o logradouro na rota correspondente ou o bairro no
setor. A busca ignora acentos e maiúsculas.

**Mudou o horário de um setor.** Edite o dia de coleta e publique um aviso de “Alerta” para o setor.

**Feriado sem coleta.** Publique um aviso para todos os setores com “Válido até” no dia do feriado.
