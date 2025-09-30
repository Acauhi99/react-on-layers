# Server Development Guide

## 🏗️ Arquitetura e Padrões

### Clean Architecture
- **Domain**: Entidades, repositórios (interfaces), serviços de domínio
- **Application**: Use cases (regras de negócio)
- **Infrastructure**: Implementações de repositórios, cache, database
- **Presentation**: Controllers, middleware, rotas

### Padrões Obrigatórios

#### 1. Controllers
- **SEMPRE** estender `BaseController`
- **NÃO** colocar lógica de negócio nos controllers
- Usar `handleRequest()` para tratamento padronizado
- Validação com Zod schemas

```typescript
export class ExampleController extends BaseController {
  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    await this.handleRequest(
      request,
      reply,
      createSchema,
      async (data) => {
        const useCase = new CreateExampleUseCase(this.repository);
        return useCase.execute(data);
      },
      201
    );
  }
}
```

#### 2. Validação
- Schemas Zod com mensagens em português
- Validação centralizada no BaseController
- Tratamento de erros padronizado

```typescript
const createSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(1, "Nome é obrigatório"),
});
```

#### 3. Autenticação JWT
- **NUNCA** retornar dados do usuário separadamente
- Informações do usuário **DENTRO** do token JWT
- Middleware adiciona `request.user` com dados decodificados

```typescript
// ❌ ERRADO
return { token, account: { id, email, name } };

// ✅ CORRETO
return { token }; // dados dentro do JWT
```

#### 4. Rotas
- Usar arrow functions com `void` para evitar warnings
- Middleware aplicado individualmente nas rotas protegidas

```typescript
// Rotas públicas
fastify.post("/auth", (req, reply) => void authController.auth(req, reply));

// Rotas protegidas
fastify.post(
  "/protected",
  { preHandler: (req, reply) => void authMiddleware(req, reply) },
  (req, reply) => void controller.method(req, reply)
);
```

#### 5. Testes
- **SEMPRE** testar use cases isoladamente
- Testes de integração para controllers
- Mocks para dependências externas
- Cobertura de casos de erro

```typescript
describe("UseCase", () => {
  it("should handle success case", async () => {
    // Arrange
    const mockRepo = { method: mock(() => Promise.resolve(data)) };
    
    // Act
    const result = await useCase.execute(input);
    
    // Assert
    expect(result).toBeDefined();
  });
});
```

---

# API Documentation

## Base URL

`http://localhost:3000/api`

## Authentication

Todas as rotas (exceto `/auth`) requerem autenticação via JWT token no header:

```
Authorization: Bearer <token>
```

**Importante**: O token JWT contém as informações do usuário (id, email, name). Não são retornadas separadamente por segurança.

---

## 🔐 Authentication Routes

### POST `/auth` (Rota Unificada)

Rota unificada para login e registro.

**Request Body (Register):**

```json
{
  "action": "register",
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

**Request Body (Login):**

```json
{
  "action": "login",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Mesmo formato para ambas as ações

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST `/auth/register` (Legado)

Registra uma nova conta.

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

**Response (201):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Nota**: O token JWT contém as informações do usuário (accountId, email, name) por segurança.

### POST `/auth/login`

Autentica um usuário existente.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📂 Category Routes

### POST `/accounts/:accountId/categories`

Cria uma nova categoria.

**Request Body:**

```json
{
  "name": "Alimentação",
  "type": "expense",
  "color": "#FF5733"
}
```

**Response (201):**

```json
{
  "id": "01JGXYZ123ABC456DEF789GHI1",
  "accountId": "01JGXYZ123ABC456DEF789GHI0",
  "name": "Alimentação",
  "type": "expense",
  "color": "#FF5733",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/accounts/:accountId/categories`

Lista categorias da conta.

**Query Parameters:**

- `type` (optional): `income` | `expense`

**Response (200):**

```json
[
  {
    "id": "01JGXYZ123ABC456DEF789GHI1",
    "accountId": "01JGXYZ123ABC456DEF789GHI0",
    "name": "Alimentação",
    "type": "expense",
    "color": "#FF5733",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 💰 Transaction Routes

### POST `/accounts/:accountId/transactions`

Cria uma nova transação.

**Request Body:**

```json
{
  "amount": 50.0,
  "description": "Almoço",
  "category_id": "01JGXYZ123ABC456DEF789GHI1",
  "date": "2024-01-01"
}
```

**Response (201):**

```json
{
  "id": "01JGXYZ123ABC456DEF789GHI2",
  "accountId": "01JGXYZ123ABC456DEF789GHI0",
  "amount": 50.0,
  "description": "Almoço",
  "categoryId": "01JGXYZ123ABC456DEF789GHI1",
  "date": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/accounts/:accountId/transactions`

Lista transações da conta.

**Query Parameters:**

- `limit` (optional): número de transações (padrão: 50)
- `year` (optional): ano para filtrar
- `month` (optional): mês para filtrar (1-12)
- `start_date` (optional): data inicial (YYYY-MM-DD)
- `end_date` (optional): data final (YYYY-MM-DD)

**Response (200):**

```json
[
  {
    "id": "01JGXYZ123ABC456DEF789GHI2",
    "accountId": "01JGXYZ123ABC456DEF789GHI0",
    "amount": 50.0,
    "description": "Almoço",
    "categoryId": "01JGXYZ123ABC456DEF789GHI1",
    "date": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/transactions/:id`

Busca uma transação específica.

**Response (200):**

```json
{
  "id": "01JGXYZ123ABC456DEF789GHI2",
  "accountId": "01JGXYZ123ABC456DEF789GHI0",
  "amount": 50.0,
  "description": "Almoço",
  "categoryId": "01JGXYZ123ABC456DEF789GHI1",
  "date": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT `/transactions/:id`

Atualiza uma transação.

**Request Body:**

```json
{
  "amount": 60.0,
  "description": "Jantar",
  "category_id": "01JGXYZ123ABC456DEF789GHI1",
  "date": "2024-01-02"
}
```

**Response (200):** Mesmo formato da criação

### DELETE `/transactions/:id`

Remove uma transação.

**Response (204):** Sem conteúdo

---

## 📈 Investment Routes

### POST `/accounts/:accountId/investments`

Cria um novo investimento.

**Request Body:**

```json
{
  "name": "Tesouro Direto",
  "investment_type_id": "bonds",
  "amount": 1000.0,
  "date": "2024-01-01"
}
```

**Response (201):**

```json
{
  "id": "01JGXYZ123ABC456DEF789GHI3",
  "accountId": "01JGXYZ123ABC456DEF789GHI0",
  "name": "Tesouro Direto",
  "investmentTypeId": "bonds",
  "amount": 1000.0,
  "date": "2024-01-01T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/accounts/:accountId/investments`

Lista investimentos da conta.

**Response (200):**

```json
[
  {
    "id": "01JGXYZ123ABC456DEF789GHI3",
    "accountId": "01JGXYZ123ABC456DEF789GHI0",
    "name": "Tesouro Direto",
    "investmentTypeId": "bonds",
    "amount": 1000.0,
    "date": "2024-01-01T00:00:00.000Z",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/accounts/:accountId/investments/summary`

Resumo dos investimentos da conta.

**Response (200):**

```json
{
  "total": 5000.0,
  "allocation": [
    {
      "investmentTypeId": "bonds",
      "total_amount": 3000.0,
      "percentage": 60.0
    },
    {
      "investmentTypeId": "stocks",
      "total_amount": 2000.0,
      "percentage": 40.0
    }
  ]
}
```

---

## 📊 Dashboard Routes

### GET `/accounts/:accountId/dashboard`

Dados do dashboard da conta.

**Query Parameters:**

- `year` (optional): ano para filtrar
- `month` (optional): mês para filtrar (1-12)

**Response (200):**

```json
{
  "totalIncome": 5000.0,
  "totalExpenses": 3000.0,
  "totalInvestments": 2000.0,
  "balance": 2000.0,
  "expensesByCategory": [
    {
      "categoryId": "01JGXYZ123ABC456DEF789GHI1",
      "categoryName": "Alimentação",
      "total": 800.0
    }
  ],
  "incomeByCategory": [
    {
      "categoryId": "01JGXYZ123ABC456DEF789GHI4",
      "categoryName": "Salário",
      "total": 5000.0
    }
  ],
  "investmentAllocation": [
    {
      "investmentTypeId": "bonds",
      "total_amount": 1200.0,
      "percentage": 60.0
    }
  ]
}
```

---

## 📋 Report Routes

### GET `/accounts/:accountId/reports/monthly`

Relatório mensal.

**Query Parameters:**

- `year` (required): ano
- `month` (required): mês (1-12)

**Response (200):**

```json
{
  "id": "01JGXYZ123ABC456DEF789GHI5",
  "accountId": "01JGXYZ123ABC456DEF789GHI0",
  "year": 2024,
  "month": 1,
  "totalIncome": 5000.0,
  "totalExpenses": 3000.0,
  "totalInvestments": 1000.0,
  "availableToInvest": 1000.0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "modifiedAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/accounts/:accountId/reports/monthly/list`

Lista de relatórios mensais.

**Query Parameters:**

- `limit` (optional): número de relatórios

**Response (200):**

```json
[
  {
    "id": "01JGXYZ123ABC456DEF789GHI5",
    "accountId": "01JGXYZ123ABC456DEF789GHI0",
    "year": 2024,
    "month": 1,
    "totalIncome": 5000.0,
    "totalExpenses": 3000.0,
    "totalInvestments": 1000.0,
    "availableToInvest": 1000.0,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "modifiedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/accounts/:accountId/reports/yearly`

Relatório anual.

**Query Parameters:**

- `year` (required): ano

**Response (200):**

```json
{
  "year": 2024,
  "totalIncome": 60000.0,
  "totalExpenses": 36000.0,
  "totalInvestments": 12000.0,
  "availableToInvest": 12000.0,
  "monthlyData": [
    {
      "month": 1,
      "totalIncome": 5000.0,
      "totalExpenses": 3000.0,
      "totalInvestments": 1000.0,
      "availableToInvest": 1000.0
    }
  ]
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "error": "Invalid token"
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error message"
}
```

---

## 📝 Notes

- Todos os IDs são ULIDs (26 caracteres)
- Datas seguem formato ISO 8601
- Valores monetários são números decimais
- Autenticação JWT expira conforme configuração do servidor
