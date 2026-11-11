# Guia de implantação

O SIGRES é um conjunto de arquivos estáticos. Qualquer servidor web (Nginx, Apache, IIS) ou hospedagem estática
atende, desde que com **HTTPS** — a Web Crypto API, usada no login, só funciona em contexto seguro.

## 1. Preparar a versão

```bash
npm ci
npm run check          # lint, formatação e testes devem passar
npm run senha -- "senha-forte-com-pelo-menos-10-caracteres"
```

Em `js/config.js`:

- cole o `salt` e o `hash` gerados em `CREDENCIAL_ADMIN`;
- defina `AMBIENTE = 'producao'` somente depois de cadastrar os dados oficiais.

## 2. Arquivos a publicar

Publique apenas:

```
index.html  sobre.html  acessibilidade.html  privacidade.html  admin.html
manifest.webmanifest  css/  js/  img/  data/
```

**Não** publique `node_modules/`, `test/`, `scripts/`, `docs/`, `.github/` nem arquivos de configuração.

## 3. Cabeçalhos de segurança (Nginx)

Alguns cabeçalhos não podem ser definidos pelo HTML e devem ser configurados no servidor:

```nginx
server {
    listen 443 ssl http2;
    server_name coleta.itapuadooeste.ro.gov.br;   # ajuste para o domínio oficial
    root /var/www/sigres;
    index index.html;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # O painel não deve ser indexado por buscadores
    location = /admin.html {
        add_header X-Robots-Tag "noindex, nofollow" always;
        # Recomendado: restringir ao IP da rede da Prefeitura
        # allow 200.0.0.0/24;
        # deny all;
    }

    location ~* \.(css|js|svg|json|webmanifest)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
}

server {
    listen 80;
    server_name coleta.itapuadooeste.ro.gov.br;
    return 301 https://$host$request_uri;
}
```

> Com `add_header` dentro de um `location`, o Nginx deixa de herdar os cabeçalhos do bloco `server`. Se usar a
> restrição de IP acima, repita os cabeçalhos de segurança dentro desse `location`.

## 4. Após publicar

- [ ] Acessar `/admin.html` e confirmar que a senha de homologação **não** funciona mais.
- [ ] Verificar se a faixa “Ambiente de demonstração” sumiu (somente com `AMBIENTE = 'producao'`).
- [ ] Testar a consulta por um bairro real e a impressão do calendário.
- [ ] Exportar um backup e guardá-lo em local seguro da Prefeitura.
- [ ] Conferir os cabeçalhos em <https://securityheaders.com>.

## 5. Atualizações

1. Exporte um backup pelo painel.
2. Substitua os arquivos pela nova versão (preservando `js/config.js` ou reaplicando as configurações).
3. Confira o [CHANGELOG](../CHANGELOG.md) para mudanças que exijam ação.
