# Financial Management Server

API REST para gerenciamento financeiro pessoal com autenticação JWT, transações, investimentos e relatórios.

## Tecnologias

- **Fastify** - Framework web rápido e eficiente
- **SQLite** - Banco de dados local
- **JWT** - Autenticação segura
- **Zod** - Validação de schemas
- **TypeScript** - Tipagem estática

## Scripts

```bash
bun dev        # Desenvolvimento com hot reload
bun start      # Produção
bun test       # Executar testes
bun build      # Build TypeScript
```

## Rotas da API

### Autenticação (Público)
```
POST /api/auth/register  # Criar conta
POST /api/auth/login     # Login
```

### Categorias (Protegido)
```
POST /api/accounts/:accountId/categories     # Criar categoria
GET  /api/accounts/:accountId/categories     # Listar categorias
```

### Transações (Protegido)
```
POST   /api/accounts/:accountId/transactions  # Criar transação
GET    /api/accounts/:accountId/transactions  # Listar transações
GET    /api/transactions/:id                  # Buscar transação
PUT    /api/transactions/:id                  # Atualizar transação
DELETE /api/transactions/:id                  # Deletar transação
```

### Investimentos (Protegido)
```
POST /api/accounts/:accountId/investments         # Criar investimento
GET  /api/accounts/:accountId/investments         # Listar investimentos
GET  /api/accounts/:accountId/investments/summary # Resumo investimentos
```

### Relatórios (Protegido)
```
GET /api/accounts/:accountId/reports/monthly      # Relatório mensal
GET /api/accounts/:accountId/reports/monthly/list # Lista relatórios mensais
GET /api/accounts/:accountId/reports/yearly       # Relatório anual
```

### Dashboard (Protegido)
```
GET /api/accounts/:accountId/dashboard  # Dashboard financeiro
```

## Configuração

Crie um arquivo `.env`:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
JWT_SECRET=your-secret-key
DATABASE_PATH=./financial.db
CORS_ORIGIN=http://localhost:3001
```

## Arquitetura

- **Clean Architecture** com camadas bem definidas
- **Domain-Driven Design** para modelagem de negócio
- **Repository Pattern** com cache em memória
- **Use Cases** para lógica de aplicação
- **Middleware** para autenticação JWT