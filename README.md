# 💰 React on Layers - Financial Management System

Sistema completo de gestão financeira pessoal construído com arquitetura moderna em camadas, oferecendo controle total sobre receitas, despesas e investimentos.

## 🎯 Funcionalidades

- **Gestão de Transações**: Controle completo de receitas e despesas
- **Categorização**: Organize suas transações por categorias personalizáveis
- **Investimentos**: Acompanhe e gerencie seus investimentos
- **Dashboard**: Visão geral das suas finanças com gráficos e métricas
- **Relatórios**: Relatórios mensais e anuais detalhados
- **Autenticação JWT**: Sistema seguro de login e registro

## 🏗️ Arquitetura

### Backend (Clean Architecture)

- **Domain**: Entidades, repositórios, serviços de domínio
- **Application**: Use cases com regras de negócio
- **Infrastructure**: Repositórios, cache, database
- **Presentation**: Controllers, middleware, rotas

### Frontend (Arquitetura em Camadas)

- **Components**: UI pura com React 19
- **Hooks**: Lógica de negócio com TanStack Query
- **Services**: Comunicação com API
- **Stores**: Estado global com Zustand

## 🚀 Stack Tecnológica

### Backend

- **Runtime**: Bun
- **Framework**: Fastify
- **Database**: SQLite
- **Validação**: Zod
- **Autenticação**: JWT + bcrypt
- **Testes**: Bun Test

### Frontend

- **Framework**: React 19 + TypeScript
- **Roteamento**: TanStack Router
- **Estado**: TanStack Query + Zustand
- **Formulários**: TanStack Form
- **UI**: Tailwind CSS v4 + Radix UI
- **Build**: Vite

### Monorepo

- **Gerenciador**: pnpm workspaces
- **Estrutura**: Apps isoladas com dependências compartilhadas

## 📋 Pré-requisitos

- **Node.js** 18+
- **pnpm** 8+
- **Bun** (para o backend)

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone git@github.com:Acauhi99/react-on-layers.git
cd react-on-layers
```

2. **Instale as dependências**

```bash
pnpm install
```

## 🚀 Executando a Aplicação

### Desenvolvimento (Ambos os serviços)

```bash
pnpm dev
```

### Executar apenas o Frontend

```bash
pnpm dev:web
```

Acesse: http://localhost:3001

### Executar apenas o Backend

```bash
pnpm dev:server
```

API disponível em: http://localhost:3000

## 🧪 Testes

### Backend

```bash
cd apps/server
bun test
```

### Build de Produção

```bash
pnpm build
```

## 📁 Estrutura do Projeto

```
react-on-layers/
├── apps/
│   ├── server/          # API Backend (Fastify + Bun)
│   │   ├── src/
│   │   │   ├── application/    # Use cases
│   │   │   ├── domain/         # Entidades e interfaces
│   │   │   ├── infrastructure/ # Repositórios e cache
│   │   │   └── presentation/   # Controllers e rotas
│   │   └── docs.md
│   └── web/             # Frontend (React + Vite)
│       ├── src/
│       │   ├── components/     # Componentes UI
│       │   ├── features/       # Features por domínio
│       │   ├── hooks/          # Custom hooks
│       │   ├── services/       # API services
│       │   └── stores/         # Zustand stores
│       └── docs.md
└── package.json         # Workspace root
```

## 🔐 Configuração

### Backend

Crie um arquivo `.env` em `apps/server/`:

```env
JWT_SECRET=your-secret-key
DATABASE_URL=./financial.db
PORT=3000
```

### Frontend

As configurações estão no código, sem necessidade de `.env`.

## 📖 Documentação

- [Backend API Documentation](./apps/server/docs.md)
- [Frontend Development Guide](./apps/web/docs.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
