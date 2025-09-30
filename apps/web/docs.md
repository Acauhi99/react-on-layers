# Frontend Development Guide

## 🎯 Gerenciamento de Estado Moderno

### Separação por Tipo de Estado

#### 1. Remote State (80% dos casos)

**TanStack Query** para dados do backend

- Cache automático e invalidação
- Loading/error states
- Retry e deduplicação
- Otimistic updates

```tsx
// Hook customizado
export function useTransactions() {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => financialService.getTransactions(),
    onError: (error: Error) => toast.error(error.message),
  });
}

// No componente
export function TransactionsList() {
  const { data, isLoading, error } = useTransactions();

  if (isLoading) return <Skeleton />;
  return <div>{/* render data */}</div>;
}
```

#### 2. Local State (10% dos casos)

**useState/useReducer** para estado de componente

- Modal aberto/fechado
- Form inputs
- UI temporário

```tsx
export function CreateDialog() {
  const [isOpen, setIsOpen] = useState(false); // Local apenas
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Criar</Button>
      {isOpen && <Dialog onClose={() => setIsOpen(false)} />}
    </>
  );
}
```

#### 3. Shared State (10% dos casos)

**Zustand** para estado compartilhado

- Autenticação
- Tema
- Configurações globais

```tsx
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isAuthenticated: false,
      login: (token: string) => {
        // Validar token
        set({ token, isAuthenticated: true });
      },
      getUser: () => {
        const { token } = get();
        return token ? decodeJWT(token) : null; // Derivar do token
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }), // Só persiste token
    }
  )
);
```

---

## 🏗️ Arquitetura em Camadas

### Responsabilidades Claras

```
Components (UI)     → Apenas apresentação
    ↓
Hooks (Logic)       → TanStack Query + validação
    ↓
Services (API)      → Comunicação HTTP
    ↓
Stores (Global)     → Zustand para shared state
```

### Padrões Obrigatórios

#### ❌ NUNCA fazer nos componentes:

- Chamadas de API diretas
- Lógica de negócio
- Gerenciamento de estado complexo

#### ✅ SEMPRE fazer:

- Componentes focados em UI
- Hooks para lógica
- Services para APIs
- Loading/error states

---

## 📁 Estrutura de Pastas

```
src/
├── components/ui/          # Componentes base
├── features/              # Funcionalidades por domínio
│   ├── auth/
│   └── financial/
├── hooks/                 # Custom hooks (TanStack Query)
├── services/              # Classes de API
├── stores/                # Zustand stores
├── lib/
│   └── validations/       # Schemas Zod
└── routes/                # TanStack Router
```

---

## 🔐 Segurança JWT

### Princípios

- **NUNCA** persistir dados do usuário
- **SEMPRE** derivar informações do token
- **Validação** automática de expiração
- **Logout** em tokens inválidos

```tsx
// ✅ CORRETO - Derivar do token
getUser: () => {
  const { token } = get()
  return token ? decodeJWT(token) : null
}

// ❌ ERRADO - Persistir dados separados
user: { id: '123', name: 'João' } // Não fazer isso
```

---

## 🚀 Stack Tecnológica

- **React 19** + **TypeScript**
- **TanStack Router** (roteamento)
- **TanStack Query** (remote state)
- **TanStack Form** (formulários)
- **Zustand** (shared state)
- **Zod** (validação)
- **Tailwind CSS v4** + **Radix UI**

---

## 📋 Checklist de Desenvolvimento

### Para cada nova feature:

1. **Identificar tipo de estado**:
   - Remote? → TanStack Query
   - Local? → useState
   - Shared? → Zustand

2. **Criar camadas na ordem**:
   - Service (API)
   - Hook (lógica + TanStack Query)
   - Validation (Zod schema)
   - Component (UI pura)

3. **Implementar estados**:
   - Loading states
   - Error handling
   - Success feedback

4. **Validar segurança**:
   - Não persistir dados deriváveis
   - Validar tokens
   - Tratar erros de auth

---

## 🎯 Ordem de Desenvolvimento

1. **Auth** → Base para tudo
2. **Dashboard** → Visão geral
3. **Transações** → Core do sistema
4. **Categorias** → Suporte
5. **Investimentos** → Expansão
6. **Relatórios** → Análise
7. **Configurações** → Personalização

---

## 💡 Dicas Importantes

- **90%** dos problemas de estado desaparecem com essa separação
- **TanStack Query** elimina 80% do código Redux tradicional
- **Zustand** é simples e alinhado com React
- **Sempre** medir performance antes de otimizar
- **Simplicidade** > Complexidade desnecessária
