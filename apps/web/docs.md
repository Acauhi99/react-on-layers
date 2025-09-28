# Frontend Development Plan

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

### Login (`/login`)

- Formulário com email/senha
- Validação com Zod
- Redirecionamento após login
- Link para registro

### Registro (`/register`)

- Formulário com nome, email, senha
- Validação de força da senha
- Criação automática de conta
- Redirecionamento para dashboard

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

## 📁 Estrutura de Pastas Sugerida

```
src/
├── components/
│   ├── ui/           # Componentes base
│   ├── forms/        # Formulários reutilizáveis
│   ├── charts/       # Gráficos
│   └── layout/       # Layout components
├── features/
│   ├── auth/         # Autenticação
│   ├── dashboard/    # Dashboard
│   ├── transactions/ # Transações
│   ├── categories/   # Categorias
│   ├── investments/  # Investimentos
│   ├── reports/      # Relatórios
│   └── settings/     # Configurações
├── hooks/            # Custom hooks
├── lib/              # Utilitários
├── services/         # API services
├── stores/           # Zustand stores
├── types/            # TypeScript types
└── routes/           # Rotas
```
