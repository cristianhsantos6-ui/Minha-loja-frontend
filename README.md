# Minha Loja — Frontend Angular

Frontend inicial para a atividade integradora **Estética & Bem-Estar**, usando Angular standalone, TypeScript, HTML, CSS e `HttpClient`.

## Requisitos
- Node.js LTS instalado
- API ASP.NET Core executando e conectada ao MySQL

## Executar
Abra um terminal dentro desta pasta e rode:

```bash
npm install
npm start
```

O Angular normalmente abre em `http://localhost:4200`.

## Endereço da API
O arquivo `src/app/services/api.service.ts` usa por padrão:

```ts
const API = 'https://localhost:7093/api';
```

Se o Swagger do seu backend estiver em outra porta, altere esse endereço.

## Endpoints usados nesta primeira versão
- `GET/POST /api/ProdutoItem`
- `GET/POST/PUT/DELETE /api/PessoaEndereco`
- `GET/POST /api/AtendimentoContoller`
- `GET /api/Categorium`

Os nomes `AtendimentoContoller` e `Categorium` vêm dos nomes de classes/controllers presentes no projeto enviado. O ideal é renomear a classe `AtendimentoContoller` para `AtendimentoController` e `CategoriumController` para `CategoriaController`; nesse caso, ajuste os caminhos no `api.service.ts` para `/Atendimento` e `/Categoria`.

## Importante
Este frontend foi ligado aos endpoints que aparecem no backend enviado, mas o backend ainda não disponibiliza todos os requisitos da atividade. A edição de produtos/serviços, CRUD de categorias, estoque/entradas, carrinho, confirmação de pedido, meus pedidos e dashboard completo exigem endpoints adicionais na API. O formulário de atendimento desta versão registra os dados básicos; a inclusão de itens/funcionários depende de o endpoint aceitar e persistir a lista `itens` conforme os DTOs da atividade.

Se o navegador mostrar erro de certificado HTTPS, abra primeiro a URL base do Swagger da API e aceite/conclua a confiança do certificado de desenvolvimento. Confira também se o CORS está habilitado no backend.
