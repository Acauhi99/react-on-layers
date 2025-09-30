# Frontend Development Guide

## 🏗️ Arquitetura e Padrões

### Separação de Responsabilidades
- **Componentes**: Apenas apresentação e UI
- **Hooks**: Lógica de negócio e estado
- **Serviços**: Comunicação com APIs
- **Stores**: Estado global (Zustand)
- **Validações**: Schemas centralizados (Zod)

### Padrões Obrigatórios

#### 1. Componentes Limpos
- **NUNCA** fazer chamadas de API diretamente nos componentes
- **SEMPRE** usar hooks customizados para lógica
- Focar apenas na apresentação

```tsx
// ❌ ERRADO
export function MyComponent() {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetch('/api/data').then(res => setData(res.json()));
  }, []);
}

// ✅ CORRETO
export function MyComponent() {
  const { data, isLoading } = useMyData();
}
```

#### 2. Hooks Customizados
- Encapsular lógica de negócio
- Usar TanStack Query para cache e estado
- Tratamento de erros centralizado

```tsx
export function useMyData() {
  return useQuery({
    queryKey: ['myData'],
    queryFn: MyService.getData,
    onError: (error) => toast.error(error.message),
  });
}
```

#### 3. Serviços de API
- Classes estáticas para organização
- Métodos async/await
- Tratamento de erros padronizado
- Interfaces TypeScript

```typescript
export class MyService {
  static async getData(): Promise<MyData[]> {
    const response = await fetch('/api/data');
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }
    return response.json();
  }
}
```

#### 4. Validação Centralizada
- Schemas Zod em `/lib/validations/`
- Hook `useFormValidation` para reutilização
- Mensagens de erro em português

```typescript
// lib/validations/auth.ts
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// No componente
const { validateAndExecute } = useFormValidation();

const handleSubmit = (data) => {
  validateAndExecute(loginSchema, data, (validData) => {
    mutation.mutate(validData);
  });
};
```

#### 5. Estado Global (Zustand)
- **Persistência seletiva**: Apenas dados essenciais
- **JWT Security**: Informações do usuário derivadas do token
- **Auto-logout**: Validação automática de expiração

```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      login: (token: string) => {
        const payload = decodeJWT(token);
        if (!payload || isTokenExpired(token)) {
          throw new Error('Token inválido');
        }
        set({ token, isAuthenticated: true });
      },
      getUser: () => {
        const { token } = get();
        return token ? decodeJWT(token) : null;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // Só persiste o token
    }
  )
);
```

#### 6. Roteamento
- Rota unificada `/auth` com parâmetros de busca
- Validação de autenticação em `beforeLoad`
- Redirecionamentos apropriados

```tsx
export const Route = createFileRoute("/auth")({
  validateSearch: z.object({
    mode: z.enum(["login", "register"]).default("login"),
  }),
  beforeLoad: () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      throw redirect({ to: "/" });
    }
  },
});
```

#### 7. Segurança JWT
- **NUNCA** armazenar dados do usuário separadamente
- Decodificar JWT no frontend para obter informações
- Validação de expiração automática
- Logout automático em tokens inválidos

---

## 📱 Stack Tecnológica

- **React 19** + **TypeScript**
- **TanStack Router** (roteamento)
- **TanStack Query** (gerenciamento de estado/cache)
- **TanStack Form** (formulários)
- **Tailwind CSS v4** + **Radix UI** (UI)
- **Zustand** (estado global)
- **Zod** (validação)

---

## 🔐 1. Autenticação

### Rota Unificada (`/auth`)

- **Login**: `/auth?mode=login` (padrão)
- **Registro**: `/auth?mode=register`
- Formulários com validação Zod centralizada
- Hooks customizados para lógica de negócio
- Serviço de API dedicado
- JWT com informações do usuário integradas
- Redirecionamento automático após sucesso

---

## 📊 2. Dashboard (`/dashboard`)

- **Visão geral financeira**: saldo, receitas, despesas do mês
- **Gráficos**: distribuição por categorias, evolução mensal
- **Cards resumo**: total investido, disponível para investir
- **Transações recentes**: últimas 5-10 transações
- **Ações rápidas**: botões para adicionar transação/investimento

---

## 💰 3. Transações

### Lista de Transações (`/transactions`)

- **Tabela paginada** com filtros (data, categoria, tipo)
- **Busca** por descrição
- **Ações**: editar, excluir
- **Botão** para nova transação
- **Resumo mensal** no topo

### Nova Transação (`/transactions/new`)

- **Formulário**: valor, descrição, categoria, data
- **Seletor de categoria** com cores
- **Validação** em tempo real
- **Preview** do impacto no saldo

### Editar Transação (`/transactions/:id/edit`)

- Mesmo formulário da criação
- Dados pré-preenchidos
- Histórico de alterações

---

## 📂 4. Categorias (`/categories`)

- **Lista** de categorias (receita/despesa)
- **Criação/edição** inline ou modal
- **Seletor de cores** personalizado
- **Estatísticas** de uso por categoria
- **Categorias padrão** vs personalizadas

---

## 📈 5. Investimentos

### Portfolio (`/investments`)

- **Resumo** do portfolio total
- **Gráfico de alocação** por tipo
- **Lista** de investimentos ativos
- **Performance** e rentabilidade
- **Botão** para novo investimento

### Novo Investimento (`/investments/new`)

- **Formulário**: nome, tipo, valor, data
- **Tipos predefinidos**: ações, renda fixa, cripto, etc.
- **Calculadora** de projeção
- **Validação** de valores

---

## 📋 6. Relatórios (`/reports`)

- **Seletor** de período (mensal/anual)
- **Gráficos comparativos** receita vs despesa
- **Evolução patrimonial** ao longo do tempo
- **Relatório detalhado** por categoria
- **Export** para PDF/Excel
- **Metas** vs realizado

---

## ⚙️ 7. Configurações (`/settings`)

- **Perfil**: nome, email, senha
- **Preferências**: tema, moeda, formato de data
- **Categorias padrão**: gerenciar categorias
- **Backup/Export**: dados da conta
- **Exclusão** de conta

---

## 🎯 Funcionalidades Especiais

### Componentes Reutilizáveis

- **DatePicker** personalizado
- **CategorySelector** com cores
- **AmountInput** formatado
- **Charts** (receita/despesa, alocação)
- **TransactionCard** para listas
- **StatCard** para métricas

### Features Avançadas

- **Dark/Light mode** (já configurado)
- **Responsivo** mobile-first
- **Loading states** e skeletons
- **Error boundaries** para falhas
- **Offline support** com cache
- **Notificações** toast para ações

### Navegação

- **Sidebar** colapsível no desktop
- **Bottom navigation** no mobile
- **Breadcrumbs** para navegação
- **Search global** para transações

---

## 🚀 Ordem de Desenvolvimento

1. **Auth** (login/registro) - base para tudo
2. **Dashboard** - visão geral e navegação
3. **Transações** - funcionalidade core
4. **Categorias** - suporte às transações
5. **Investimentos** - expansão do sistema
6. **Relatórios** - análise avançada
7. **Configurações** - personalização

---

## 📁 Estrutura de Pastas Implementada

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, etc.)
│   └── theme-provider.tsx # Provider de tema customizado
├── features/
│   └── auth/            # Componentes de autenticação
│       ├── login-form.tsx
│       └── register-form.tsx
├── hooks/               # Custom hooks
│   ├── use-auth.ts      # Hooks de autenticação
│   └── use-form-validation.ts # Validação de formulários
├── lib/
│   ├── jwt.ts           # Utilitários JWT
│   ├── query-client.ts  # Configuração TanStack Query
│   └── validations/     # Schemas de validação
│       └── auth.ts
├── services/            # Serviços de API
│   ├── auth.service.ts
│   └── financial.service.ts
├── stores/              # Zustand stores
│   ├── auth.store.ts    # Estado de autenticação
│   └── theme.store.ts   # Estado do tema
└── routes/              # Rotas TanStack Router
    ├── __root.tsx       # Layout raiz
    ├── index.tsx        # Página inicial
    └── auth.tsx         # Rota unificada de autenticação
```

## 🔄 Fluxo de Desenvolvimento

1. **Criar Serviço**: Definir interface e métodos de API
2. **Criar Hook**: Encapsular lógica com TanStack Query
3. **Criar Validação**: Schema Zod centralizado
4. **Criar Componente**: UI pura usando hooks
5. **Testes**: Testar hook e serviço separadamente

## ⚙️ Configurações Importantes

### Theme Provider
- Evita problemas de hidratação SSR
- Aplica tema apenas após hidratação
- Persistência seletiva no Zustand

### JWT Security
- Decodificação client-side segura
- Validação de expiração automática
- Logout em tokens inválidos
- Persistência apenas do token
