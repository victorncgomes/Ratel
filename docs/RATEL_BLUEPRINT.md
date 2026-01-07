# 🦡 RATEL - BLUEPRINT COMPLETO DE RECONSTRUÇÃO

**Versão**: 0.2.7  
**Data**: 06/01/2026  
**Status**: Produção  
**Desenvolvedor**: Paranaue (Mídia e Marketing)

---

## 📋 ÍNDICE

1. [Visão Geral e Filosofia](#1-visão-geral-e-filosofia)
2. [Stack Tecnológica](#2-stack-tecnológica)
3. [Estrutura de Pastas](#3-estrutura-de-pastas)
4. [Configuração do Ambiente](#4-configuração-do-ambiente)
5. [Arquitetura do Sistema](#5-arquitetura-do-sistema)
6. [Design System e UI/UX](#6-design-system-e-uiux)
7. [Componentes da Interface](#7-componentes-da-interface)
8. [Páginas e Rotas](#8-páginas-e-rotas)
9. [Sistema de Autenticação](#9-sistema-de-autenticação)
10. [APIs e Integrações](#10-apis-e-integrações)
11. [Backend e Serviços](#11-backend-e-serviços)
12. [Internacionalização (i18n)](#12-internacionalização-i18n)
13. [Assets e Imagens](#13-assets-e-imagens)
14. [Performance e Otimizações](#14-performance-e-otimizações)
15. [Changelog Completo](#15-changelog-completo)
16. [Instruções de Deploy](#16-instruções-de-deploy)

---

## 1. VISÃO GERAL E FILOSOFIA

### 1.1 O que é o Ratel?

**Ratel** é um gerenciador inteligente de caixa de entrada de email com IA, inspirado no animal Ratel (Honey Badger), conhecido por sua determinação implacável.

### 1.2 Filosofia do Produto

> **"O que não serve, sai. Sem negociação."**

O Ratel representa a atitude do usuário em relação ao email: sem paciência para newsletters inúteis, spam ou emails que só ocupam espaço. A filosofia é:

- 🦡 **Determinação**: Limpe sua caixa de entrada sem hesitação
- 🧹 **Simplicidade**: Interface limpa e intuitiva
- 🤖 **Inteligência**: IA classifica e organiza automaticamente
- ⚡ **Velocidade**: Ações em massa, sem cliques desnecessários

### 1.3 Público-Alvo

- Profissionais que recebem muitos emails
- Usuários frustrados com newsletters e spam
- Pessoas que buscam "Inbox Zero"
- Usuários de Gmail e Outlook

### 1.4 Inspiração de Design

Interfaces inspiradas em:
- **Microsoft Fluent UI**: Cores, sombras, espaçamento
- **Mailstrom.co**: Layout de três colunas, agrupamento
- **Leave Me Alone**: Shield e Rollup de newsletters
- **Cleanfox**: Análise e limpeza de inbox

---

## 2. STACK TECNOLÓGICA

### 2.1 Frontend

```json
{
  "framework": "React 19.2.3",
  "bundler": "Vite 6.2.0",
  "linguagem": "TypeScript 5.8.2",
  "estilização": "Tailwind CSS 3.4.1",
  "componentes_ui": [
    "@radix-ui/react-avatar",
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-slot",
    "@radix-ui/react-toast"
  ],
  "graficos": "Recharts 3.6.0",
  "icones": "Lucide React 0.562.0",
  "virtualizacao": "@tanstack/react-virtual 3.13.16",
  "storage": "IndexedDB via idb 8.0.3",
  "utilidades": [
    "class-variance-authority",
    "clsx",
    "tailwind-merge"
  ]
}
```

### 2.2 Backend

```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "autenticacao": "Passport.js",
  "oauth": [
    "passport-google-oauth20",
    "passport-microsoft"
  ],
  "ai": "@google/genai (Gemini API)",
  "http": "axios",
  "seguranca": [
    "cors",
    "helmet",
    "express-session"
  ]
}
```

### 2.3 Dependências Completas (package.json)

**Frontend (`/package.json`)**:
```json
{
  "name": "ratel-inbox-manager",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.34.0",
    "@radix-ui/react-avatar": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-toast": "^1.2.15",
    "@tanstack/react-virtual": "^3.13.16",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "idb": "^8.0.3",
    "lucide-react": "^0.562.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "recharts": "^3.6.0",
    "tailwind-merge": "^3.4.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

---

## 3. ESTRUTURA DE PASTAS

```
Ratel/
├── 📁 public/                    # Assets estáticos
│   ├── favicon.png               # Favicon do site
│   ├── Logo.jpg                  # Logo original
│   ├── name-ratel.svg            # Logo textual "ratel"
│   ├── ratel.svg                 # Ícone do mascote
│   ├── ratel-logo-negative.svg   # Logo negativo
│   ├── ratel running.svg         # Animação mascote
│   ├── animals running.svg       # Animação animais
│   ├── paranaue.svg              # Logo da empresa
│   ├── Nexa-Light.ttf            # Fonte peso 300
│   ├── Nexa-Regular.ttf          # Fonte peso 400
│   ├── Nexa-Bold.ttf             # Fonte peso 700
│   ├── Nexa-Heavy.ttf            # Fonte peso 900
│   ├── 📁 images/
│   │   └── 📁 flags/             # Bandeiras dos idiomas
│   │       ├── br.svg            # Brasil
│   │       ├── us.svg            # EUA
│   │       └── es.svg            # Espanha
│   ├── 📁 landing/               # Assets da landing page
│   └── 📁 sounds/                # Sons/efeitos
│
├── 📁 src/                       # Código fonte frontend
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Componente principal
│   ├── index.css                 # CSS de entrada
│   │
│   ├── 📁 components/            # Componentes React
│   │   ├── LandingPage.tsx       # Página de entrada
│   │   ├── LoginPage.tsx         # Login (legado)
│   │   ├── ProcessingScreen.tsx  # Tela de carregamento
│   │   ├── ProgressBar.tsx       # Barra de progresso
│   │   ├── VirtualizedEmailList.tsx  # Lista virtualizada
│   │   ├── GroupsColumn.tsx      # Coluna de grupos
│   │   ├── BulkActionsToolbar.tsx    # Barra de ações em massa
│   │   ├── RatelFuriosoModal.tsx # Modal de cancelamento em massa
│   │   │
│   │   ├── 📁 landing/           # Componentes da landing
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── PhilosophySection.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   └── FooterSection.tsx
│   │   │
│   │   ├── 📁 pages/             # Páginas da aplicação
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Subscriptions.tsx
│   │   │   ├── Cleanup.tsx
│   │   │   ├── DeepCleaning.tsx
│   │   │   ├── MailListView.tsx
│   │   │   ├── RulesPage.tsx
│   │   │   ├── RollupView.tsx
│   │   │   ├── Activity.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Help.tsx
│   │   │   ├── TermsPage.tsx
│   │   │   └── PrivacyPage.tsx
│   │   │
│   │   ├── 📁 ui/                # Componentes UI base
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   │
│   │   └── 📁 icons/             # Ícones customizados
│   │       └── Flags.tsx         # Componentes de bandeiras
│   │
│   ├── 📁 hooks/                 # React Hooks customizados
│   │   ├── useTheme.ts           # Gerenciamento de tema
│   │   ├── useEmails.ts          # Gerenciamento de emails
│   │   ├── useEmailLoader.ts     # Carregamento de emails
│   │   ├── useSubscriptions.ts   # Detecção de newsletters
│   │   ├── useCleanup.ts         # Análise de limpeza
│   │   ├── useDeepCleaning.ts    # Limpeza profunda
│   │   ├── useRules.ts           # Shield e Rollup
│   │   ├── useStats.ts           # Estatísticas
│   │   ├── useAnalytics.ts       # Analytics
│   │   ├── useRatelFurioso.ts    # Cancelamento em massa
│   │   ├── useMediaQuery.ts      # Responsividade
│   │   └── useLandingAnimations.ts # Animações landing
│   │
│   ├── 📁 contexts/              # Context API
│   │   ├── LanguageContext.tsx   # i18n
│   │   └── ProgressContext.tsx   # Progresso global
│   │
│   ├── 📁 lib/                   # Utilitários
│   │   ├── api.ts                # Funções de API
│   │   ├── utils.ts              # cn() helper
│   │   ├── toast.ts              # Sistema de notificações
│   │   ├── mockData.ts           # Dados de demonstração
│   │   ├── funnyMessages.ts      # Mensagens do loading
│   │   ├── emailStore.ts         # IndexedDB store
│   │   ├── emailLoaderService.ts # Serviço de carregamento
│   │   └── 📁 i18n/              # Internacionalização
│   │       ├── translations.ts
│   │       └── 📁 locales/
│   │           ├── pt.ts         # Português
│   │           ├── en.ts         # Inglês
│   │           └── es.ts         # Espanhol
│   │
│   └── 📁 styles/                # Estilos globais
│       ├── globals.css           # CSS principal
│       └── 📁 themes/            # Temas adicionais
│
├── 📁 server/                    # Backend Node.js
│   ├── server.js                 # Servidor Express
│   ├── package.json              # Dependências backend
│   ├── .env                      # Variáveis de ambiente
│   ├── .env.example              # Exemplo de .env
│   │
│   ├── 📁 auth/                  # Autenticação
│   │   ├── google.js             # Google OAuth
│   │   └── microsoft.js          # Microsoft OAuth
│   │
│   └── 📁 services/              # Serviços backend
│       ├── emailService.js       # Gmail/Outlook API
│       ├── subscriptionDetector.js # Detecção newsletters
│       ├── analyticsService.js   # Analytics
│       ├── geminiService.js      # Gemini AI
│       ├── cleanupService.js     # Análise de limpeza
│       └── rulesService.js       # Shield/Rollup
│
├── 📁 docs/                      # Documentação
│   ├── ARCHITECTURE.md           # Arquitetura técnica
│   ├── dialogs.md                # Decisões de projeto
│   └── RATEL_BLUEPRINT.md        # Este arquivo
│
├── 📁 references/                # Referências visuais
│
├── 📁 data/                      # Dados locais (dev)
│
├── index.html                    # HTML principal
├── vite.config.ts                # Configuração Vite
├── tailwind.config.js            # Configuração Tailwind
├── tsconfig.json                 # Configuração TypeScript
├── postcss.config.js             # Configuração PostCSS
├── CHANGELOG.md                  # Histórico de versões
├── README.md                     # Documentação principal
└── .gitignore                    # Arquivos ignorados
```

---

## 4. CONFIGURAÇÃO DO AMBIENTE

### 4.1 Pré-requisitos

- Node.js 18+
- npm 9+
- Git

### 4.2 Instalação

```bash
# Clone o repositório
git clone https://github.com/victorncgomes/Ratel.git
cd Ratel

# Instale dependências do frontend
npm install

# Instale dependências do backend
cd server
npm install
cd ..
```

### 4.3 Variáveis de Ambiente

**Frontend (`.env.local`)**:
```env
VITE_GEMINI_API_KEY=AIzaSyB6sZ0WCaINw0bsN_DOfAEIN8-Zhgj6vQY
```

**Backend (`server/.env`)**:
```env
# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3109/auth/google/callback

# Microsoft OAuth
MICROSOFT_CLIENT_ID=seu_client_id
MICROSOFT_CLIENT_SECRET=seu_client_secret
MICROSOFT_CALLBACK_URL=http://localhost:3109/auth/microsoft/callback

# Sessão
SESSION_SECRET=sua_chave_secreta_aqui

# Gemini AI
GEMINI_API_KEY=AIzaSyB6sZ0WCaINw0bsN_DOfAEIN8-Zhgj6vQY
```

### 4.4 Executando

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd server
node server.js
```

**URLs**:
- Frontend: http://localhost:5173
- Backend: http://localhost:3109

---

## 5. ARQUITETURA DO SISTEMA

### 5.1 Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUÁRIO                                   │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   FRONTEND (React)                           │ │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐            │ │
│  │  │Dashboard│ │Subscrip.│ │ Cleanup │ │MailList │    ...     │ │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘            │ │
│  │       │           │           │           │                  │ │
│  │       ▼           ▼           ▼           ▼                  │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │                    HOOKS LAYER                         │  │ │
│  │  │  useEmails, useSubscriptions, useCleanup, useRules... │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  │                           │                                  │ │
│  │                           ▼                                  │ │
│  │  ┌───────────────────────────────────────────────────────┐  │ │
│  │  │                   LIB LAYER                            │  │ │
│  │  │  api.ts, emailStore.ts, emailLoaderService.ts          │  │ │
│  │  └───────────────────────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                           │                                       │
│                           ▼                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   BACKEND (Express)                          │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                    ROUTES                                │ │ │
│  │  │  /auth/*, /api/emails, /api/subscriptions, /api/rules   │ │ │
│  │  └────────────────────────┬────────────────────────────────┘ │ │
│  │                           │                                   │ │
│  │                           ▼                                   │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                   SERVICES                               │ │ │
│  │  │  emailService, subscriptionDetector, cleanupService...  │ │ │
│  │  └────────────────────────┬────────────────────────────────┘ │ │
│  └───────────────────────────│──────────────────────────────────┘ │
│                              │                                    │
│                              ▼                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   EXTERNAL APIs                              │ │
│  │  ┌─────────┐ ┌─────────────┐ ┌─────────────┐                │ │
│  │  │ Gmail   │ │ Microsoft   │ │ Gemini AI   │                │ │
│  │  │ API     │ │ Graph API   │ │             │                │ │
│  │  └─────────┘ └─────────────┘ └─────────────┘                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Fluxo de Autenticação OAuth

```
┌───────────┐     ┌───────────┐     ┌───────────┐     ┌───────────┐
│  Usuário  │────▶│  Frontend │────▶│  Backend  │────▶│  Google/  │
│           │     │           │     │           │     │  Microsoft│
└───────────┘     └───────────┘     └───────────┘     └───────────┘
                                                            │
                                                            ▼
                  ┌───────────┐     ┌───────────┐     ┌───────────┐
                  │  Frontend │◀────│  Backend  │◀────│  OAuth    │
                  │ (autent.) │     │ (callback)│     │  Token    │
                  └───────────┘     └───────────┘     └───────────┘
```

### 5.3 Fluxo de Dados

1. **Carregamento de Emails**:
   - `useEmailLoader` inicia loading
   - `emailLoaderService` faz requests paginados
   - `emailStore` (IndexedDB) armazena cache local
   - Componentes recebem dados via `useEmails`

2. **Detecção de Newsletters**:
   - `subscriptionDetector` analisa headers
   - Busca por `List-Unsubscribe` header
   - Agrupa por domínio do remetente

3. **Classificação com IA**:
   - `geminiService` envia emails para Gemini API
   - Recebe categorias (Newsletter, Promocional, etc.)
   - Fallback local se API indisponível

---

## 6. DESIGN SYSTEM E UI/UX

### 6.1 Fonte Tipográfica

**Família**: Nexa (customizada)

**Pesos Disponíveis**:
- `300` - Light (textos secundários)
- `400` - Regular (corpo de texto)
- `500-700` - Bold (ênfase, sidebar)
- `800-900` - Heavy (títulos, headers)

**Aplicação Obrigatória**:
```css
* {
  font-family: "Nexa", system-ui, sans-serif;
  font-style: normal !important;
}
```

### 6.2 Paleta de Cores

#### Tema Claro (Microsoft Fluent UI)

```css
:root {
  --background: 0 0% 100%;          /* Branco puro */
  --foreground: 210 11% 15%;        /* Cinza escuro */
  --primary: 206 100% 40%;          /* Azul Microsoft #0078D4 */
  --secondary: 210 16% 93%;         /* Cinza claro */
  --accent: 151 55% 42%;            /* Verde Microsoft */
  --destructive: 0 78% 53%;         /* Vermelho */
  --muted: 210 16% 93%;             /* Fundo sutil */
  --border: 210 16% 87%;            /* Bordas */
}
```

#### Tema Escuro (NOIR Anime)

```css
.dark {
  --background: 0 0% 4%;            /* Preto profundo */
  --foreground: 0 0% 96%;           /* Branco gelo */
  --primary: 348 83% 47%;           /* Vermelho sangue */
  --secondary: 0 0% 12%;            /* Cinza escuro */
  --accent: 330 100% 50%;           /* Rosa choque */
  --destructive: 0 78% 60%;         /* Vermelho */
  --muted: 0 0% 15%;                /* Fundo sutil */
  --border: 0 0% 18%;               /* Bordas */
}
```

#### Cores Fluent UI (Ícones)

```css
--fluent-blue: 206 100% 40%;    /* #0078D4 */
--fluent-teal: 180 60% 35%;     /* Teal */
--fluent-green: 151 55% 42%;    /* Verde */
--fluent-yellow: 45 100% 51%;   /* Amarelo */
--fluent-orange: 27 98% 54%;    /* Laranja */
--fluent-red: 0 78% 53%;        /* Vermelho */
--fluent-magenta: 328 80% 50%;  /* Magenta */
--fluent-purple: 262 68% 58%;   /* Roxo */
```

### 6.3 Efeitos Visuais

#### Glassmorphism (`.glass`, `.glass-card`)

```css
.glass {
  background-color: hsl(var(--background) / 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--border) / 0.3);
}

.glass-card {
  border-radius: 0.375rem;
  background: linear-gradient(135deg,
    hsl(var(--background) / 0.9) 0%,
    hsl(200 60% 98% / 0.7) 25%,
    hsl(280 60% 98% / 0.6) 50%,
    hsl(340 50% 98% / 0.7) 75%,
    hsl(var(--background) / 0.85) 100%);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid hsl(0 0% 100% / 0.5);
  box-shadow:
    0 4px 24px hsl(220 50% 50% / 0.08),
    inset 0 1px 0 hsl(0 0% 100% / 0.3);
}
```

#### Claymorphism (`.clay-card`, `.clay-button`)

```css
.clay-card {
  border-radius: 0.375rem;
  background: linear-gradient(145deg,
    hsl(var(--background)) 0%,
    hsl(220 30% 97%) 100%);
  box-shadow:
    6px 6px 16px hsl(220 30% 85% / 0.5),
    -3px -3px 10px hsl(0 0% 100% / 0.8);
}
```

### 6.4 Animações

```css
/* Shimmer Loading */
.shimmer {
  background: linear-gradient(90deg,
    hsl(var(--muted)) 0%,
    hsl(var(--muted-foreground) / 0.1) 50%,
    hsl(var(--muted)) 100%);
  animation: shimmer 2s infinite linear;
}

/* Hover Lift */
.hover-lift:hover {
  transform: translateY(-4px);
}

/* Glow Pulse */
.animate-glow {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### 6.5 Border Radius

```css
--radius: 0.375rem;  /* 6px - bordas quadradas/suaves */
```

**Convenção**: Usar `rounded-sm` (0.375rem) para containers, nunca `rounded-2xl`.

### 6.6 Espaçamento

Seguir sistema Tailwind padrão:
- `p-4` / `p-6` para padding interno
- `gap-4` / `gap-6` para espaçamento flex/grid
- `space-y-6` para espaçamento vertical

---

## 7. COMPONENTES DA INTERFACE

### 7.1 Layout Principal (App.tsx)

```
┌────────────────────────────────────────────────────────────────┐
│ HEADER (h-16, glass, sticky top-0)                             │
│ ┌────────┬─────────────────────────────────┬──────────────────┐│
│ │ Menu   │ Logo "ratel"                     │ Lang  │ Profile  ││
│ └────────┴─────────────────────────────────┴──────────────────┘│
├────────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌───────────────────────────────────────┐ │
│ │ SIDEBAR (w-64)   │ │ MAIN CONTENT                          │ │
│ │                  │ │                                        │ │
│ │ Ações Principais │ │ Conteúdo dinâmico baseado em           │ │
│ │ ├─ Listas Email  │ │ activeTab                              │ │
│ │ └─ Limpeza       │ │                                        │ │
│ │                  │ │                                        │ │
│ │ Visualizações    │ │                                        │ │
│ │ ├─ Por Remetente │ │                                        │ │
│ │ ├─ Por Tamanho   │ │                                        │ │
│ │ ├─ Por Data      │ │                                        │ │
│ │ ├─ Newsletters   │ │                                        │ │
│ │ └─ Promoções     │ │                                        │ │
│ │                  │ │                                        │ │
│ │ Proteção         │ │                                        │ │
│ │ ├─ Shield        │ │                                        │ │
│ │ └─ Rollup        │ │                                        │ │
│ │                  │ │                                        │ │
│ │ ─────────────────│ │                                        │ │
│ │ [Avatar] Usuário │ │                                        │ │
│ │ ▾ Menu           │ │                                        │ │
│ └──────────────────┘ └───────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

### 7.2 Componentes UI Base

#### Button

```tsx
<Button variant="default|destructive|outline|secondary|ghost|link" size="default|sm|lg|icon">
  Texto
</Button>
```

#### Card

```tsx
<Card className="glass-card">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>
```

#### Avatar

```tsx
<Avatar className="h-10 w-10">
  <AvatarImage src={user.photo} />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
```

#### Badge

```tsx
<Badge variant="default|secondary|destructive|outline">
  Label
</Badge>
```

### 7.3 Componentes Especiais

#### ProcessingScreen

Tela de loading após login com mensagens engraçadas:

```tsx
<ProcessingScreen onComplete={() => setIsAuthenticated(true)} />
```

**Fases**:
1. "Conectando com seu email..."
2. "Analisando sua caixa de entrada..."
3. "Detectando newsletters..."
4. "Categorizando emails..."
5. "Finalizando..."

**Mensagens Engraçadas** (em `funnyMessages.ts`):
- "Convencendo sua caixa de entrada a cooperar..."
- "Negociando com os algoritmos..."
- "Fazendo os spams chorarem..."

#### VirtualizedEmailList

Lista virtualizada para performance com milhares de emails:

```tsx
<VirtualizedEmailList
  emails={filteredEmails}
  selectedIds={selectedIds}
  onToggleSelect={handleToggleSelect}
  onAction={handleAction}
/>
```

#### GroupsColumn

Coluna de agrupamentos estilo Mailstrom:

```tsx
<GroupsColumn
  groups={groups}
  selectedGroup={selectedGroup}
  onSelectGroup={setSelectedGroup}
/>
```

#### BulkActionsToolbar

Barra de ações em massa:

```tsx
<BulkActionsToolbar
  selectedCount={selectedIds.size}
  onDelete={handleBulkDelete}
  onArchive={handleBulkArchive}
  onShield={handleAddToShield}
  onRollup={handleAddToRollup}
  onUnsubscribe={handleBulkUnsubscribe}
/>
```

---

## 8. PÁGINAS E ROTAS

### 8.1 Mapeamento de Rotas (SPA)

| Tab ID | Componente | Descrição |
|--------|------------|-----------|
| `dashboard` | `DashboardPage` | Painel principal com estatísticas |
| `subscriptions` | `SubscriptionsPage` | Gerenciar newsletters/inscrições |
| `cleanup` | `CleanupPage` | Limpeza rápida da caixa |
| `deep-cleaning` | `DeepCleaning` | Limpeza por tamanho/data |
| `by-sender` | `MailListView` | Emails agrupados por remetente |
| `by-size` | `MailListView` | Emails ordenados por tamanho |
| `by-date` | `MailListView` | Emails organizados por data |
| `newsletters` | `MailListView` | Apenas newsletters |
| `promotions` | `MailListView` | Emails promocionais |
| `shield` | `RulesPage` | Remetentes bloqueados |
| `rollup` | `RulesPage` | Newsletters agrupadas |
| `activity` | `ActivityPage` | Histórico de ações |
| `notifications` | `NotificationsPage` | Notificações do sistema |
| `profile` | `ProfilePage` | Configurações do usuário |
| `settings` | `ProfilePage` | Alias para profile |
| `help` | `HelpPage` | Central de ajuda e changelog |

### 8.2 Páginas Detalhadas

#### Dashboard

**Conteúdo**:
- 4 Cards de métricas (Emails, Tempo Leitura, Taxa Resposta, Spam)
- Gráfico de Volume Semanal (Recharts)
- Gráfico de Categorias (pie chart)
- Gráfico de Atividade Horária
- Card de Saúde da Caixa de Entrada
- Ações Rápidas (4 botões)

#### Subscriptions

**Conteúdo**:
- Lista de newsletters detectadas
- Botão "Não Me Perturbe Mais!" (Ratel Furioso)
- Busca e filtros
- Ações: Manter, Arquivar, Cancelar Inscrição

#### Cleanup

**Conteúdo**:
- Estatísticas de limpeza
- Botões: Esvaziar Spam, Esvaziar Lixeira
- Link para Deep Cleaning
- Cards de categorias (Newsletters, Promoções, Social)

#### MailListView

**Props**: `viewType: 'by-sender' | 'by-size' | 'by-date' | 'newsletters' | 'promotions'`

**Layout**: Três colunas
1. Coluna de Grupos (GroupsColumn)
2. Lista de Emails (VirtualizedEmailList)
3. Preview/Ações (BulkActionsToolbar)

---

## 9. SISTEMA DE AUTENTICAÇÃO

### 9.1 Provedores Suportados

1. **Google OAuth 2.0**
   - Scopes: `profile`, `email`, `https://www.googleapis.com/auth/gmail.readonly`
   
2. **Microsoft OAuth**
   - Scopes: `openid`, `profile`, `email`, `Mail.Read`

3. **Modo Demo**
   - Sem autenticação
   - Dados mockados de `mockData.ts`

### 9.2 Fluxo de Login

1. Usuário clica em "Continuar com Google/Microsoft"
2. Redirect para `/auth/google` ou `/auth/microsoft`
3. Backend inicia OAuth com Passport.js
4. Provedor retorna com access token
5. Callback salva token na session
6. Redirect para frontend com `?auth=success&user=...`
7. Frontend parseia user data e mostra ProcessingScreen
8. Após processing, define `isAuthenticated = true`

### 9.3 Persistência

- **Session**: Express-session no backend
- **LocalStorage**: `ratel_user` no frontend
- **Token**: Passado no header `Authorization: Bearer <token>`

---

## 10. APIS E INTEGRAÇÕES

### 10.1 Endpoints Backend

#### Autenticação
```
GET  /auth/google          → Inicia OAuth Google
GET  /auth/google/callback → Callback OAuth Google
GET  /auth/microsoft       → Inicia OAuth Microsoft
GET  /auth/microsoft/callback → Callback Microsoft
POST /auth/logout          → Encerra sessão
```

#### Emails
```
GET  /api/emails           → Lista emails (limit, offset)
GET  /api/emails/:id       → Detalhes de um email
POST /api/emails/archive   → Arquivar emails
POST /api/emails/trash     → Mover para lixeira
POST /api/emails/unsubscribe → Cancelar inscrição
```

#### Subscriptions
```
GET  /api/subscriptions    → Lista newsletters detectadas
POST /api/subscriptions/unsubscribe     → Cancelar uma
POST /api/subscriptions/unsubscribe-all → Cancelar todas
```

#### Cleanup
```
GET  /api/cleanup/analyze  → Análise da caixa
GET  /api/cleanup/drafts   → Rascunhos antigos
POST /api/cleanup/spam     → Esvaziar spam
POST /api/cleanup/trash    → Esvaziar lixeira
GET  /api/cleanup/by-size  → Emails por tamanho
GET  /api/cleanup/by-date  → Emails por data
```

#### Rules
```
GET  /api/rules            → Lista regras (shield + rollup)
POST /api/rules/shield     → Adicionar ao Shield
POST /api/rules/rollup     → Adicionar ao Rollup
DELETE /api/rules/:id      → Remover regra
```

#### Analytics
```
GET  /api/analytics        → Estatísticas completas
GET  /api/stats            → Estatísticas resumidas
```

#### Labels (IA)
```
POST /api/labels/classify  → Classificar emails com Gemini
GET  /api/labels/stats     → Estatísticas por categoria
```

### 10.2 Integração Gmail API

```javascript
// Buscar mensagens
GET https://gmail.googleapis.com/gmail/v1/users/me/messages

// Detalhes de mensagem
GET https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}

// Headers importantes
- From, To, Subject, Date
- List-Unsubscribe (para detecção de newsletter)
```

### 10.3 Integração Microsoft Graph

```javascript
// Buscar mensagens
GET https://graph.microsoft.com/v1.0/me/messages

// Pastas especiais
GET https://graph.microsoft.com/v1.0/me/mailFolders/junkemail/messages
GET https://graph.microsoft.com/v1.0/me/mailFolders/deleteditems/messages
```

### 10.4 Integração Gemini AI

```javascript
// Modelo: gemini-2.0-flash
// Prompt para classificação:
"Classifique os seguintes emails em categorias:
Newsletter, Promocional, Trabalho, Social, Updates, Pessoal.
Retorne JSON com: { categories: [...] }"
```

---

## 11. BACKEND E SERVIÇOS

### 11.1 Serviços Principais

#### emailService.js
- `fetchGmailEmails(token, maxResults)` - Buscar emails do Gmail
- `fetchOutlookEmails(token, maxResults)` - Buscar emails do Outlook

#### subscriptionDetector.js
- `detectSubscriptions(emails)` - Detectar newsletters
- Analisa header `List-Unsubscribe`
- Agrupa por domínio

#### cleanupService.js
- `analyzeInbox(token, provider)` - Análise completa
- `getGmailSpamTrashCount(token)` - Contagens Gmail
- `getOutlookSpamTrashCount(token)` - Contagens Outlook
- `getOldDrafts(token, days)` - Rascunhos antigos
- `emptyTrash(token)` - Esvaziar lixeira
- `emptySpam(token)` - Esvaziar spam

#### rulesService.js
- `loadRules()` - Carregar regras do arquivo
- `addToShield(email)` - Bloquear remetente
- `addToRollup(email)` - Agrupar newsletter
- `removeRule(id)` - Remover regra

#### geminiService.js
- `classifyEmails(emails)` - Classificar com IA
- `generateClassificationStats(classified)` - Estatísticas
- Fallback local se API indisponível

---

## 12. INTERNACIONALIZAÇÃO (I18N)

### 12.1 Idiomas Suportados

1. **Português (pt)** - Padrão
2. **Inglês (en)**
3. **Espanhol (es)**

### 12.2 Estrutura de Traduções

```typescript
// src/lib/i18n/locales/pt.ts
export const pt = {
  common: {
    search_placeholder: 'Pesquisar emails...',
    notifications: 'Notificações',
    settings: 'Configurações',
    // ...
  },
  user_menu: {
    notifications: 'Notificações',
    help: 'Ajuda',
    settings: 'Configurações',
    logout: 'Sair',
    demo_user: 'Usuário Demo'
  },
  landing: {
    hero: {
      title: 'Inteligência artificial para sua caixa de email.',
      subtitle: 'Limpe, organize e respire.',
      login_google: 'Continuar com Google',
      login_microsoft: 'Continuar com Hotmail',
      demo_button: 'Experimentar Demo Grátis',
      // ...
    },
    features: { /* ... */ },
    testimonials: { /* ... */ }
  },
  menu: { /* ... */ },
  dashboard: { /* ... */ },
  sidebar: {
    main_actions: 'Ações Principais',
    email_lists: 'Listas de Email',
    quick_cleanup: 'Limpeza Rápida',
    smart_views: 'Visualizações',
    by_sender: 'Por Remetente',
    by_size: 'Por Tamanho',
    by_date: 'Por Data',
    newsletters: 'Newsletters',
    promotions: 'Promoções',
    protection: 'Proteção',
    shield: 'Shield (Bloqueados)',
    rollup: 'Rollup (Agrupados)',
  }
};
```

### 12.3 Uso nos Componentes

```tsx
import { useLanguage } from '../../contexts/LanguageContext';

function Component() {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('dashboard.received_emails')}</h1>
      <button onClick={() => setLanguage('en')}>English</button>
    </div>
  );
}
```

---

## 13. ASSETS E IMAGENS

### 13.1 Logos

| Arquivo | Uso | Dimensões |
|---------|-----|-----------|
| `ratel.svg` | Ícone mascote | 120x120 |
| `name-ratel.svg` | Texto "ratel" | 84px altura |
| `ratel-logo-negative.svg` | Logo negativo | - |
| `paranaue.svg` | Logo empresa | - |
| `favicon.png` | Favicon | 192x192 |

### 13.2 Fontes

| Arquivo | Peso | Uso |
|---------|------|-----|
| `Nexa-Light.ttf` | 300 | Textos secundários |
| `Nexa-Regular.ttf` | 400 | Corpo de texto |
| `Nexa-Bold.ttf` | 500-700 | Ênfase, sidebar |
| `Nexa-Heavy.ttf` | 800-900 | Títulos |

### 13.3 Bandeiras (i18n)

| Arquivo | País |
|---------|------|
| `images/flags/br.svg` | Brasil |
| `images/flags/us.svg` | EUA |
| `images/flags/es.svg` | Espanha |

---

## 14. PERFORMANCE E OTIMIZAÇÕES

### 14.1 Lazy Loading

Todas as páginas são carregadas sob demanda:

```tsx
const DashboardPage = lazy(() => import('./components/pages/Dashboard'));
const SubscriptionsPage = lazy(() => import('./components/pages/Subscriptions'));
// ...
```

### 14.2 Virtualização

Lista de emails usa `@tanstack/react-virtual`:

```tsx
const rowVirtualizer = useVirtualizer({
  count: emails.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 72,
  overscan: 5,
});
```

### 14.3 Cache Local

IndexedDB via `emailStore.ts`:

```typescript
// Armazena emails localmente
await emailStore.addEmails(emails);

// Recupera do cache
const cached = await emailStore.getEmails();
```

### 14.4 Métricas

| Métrica | Valor |
|---------|-------|
| Build Time | 6.67s |
| Bundle Size | 44.91 MB |
| Carregamento Inicial | ~3s |
| Páginas Lazy | 12 |

---

## 15. CHANGELOG COMPLETO

### v0.2.7 (06/01/2026) - Atual

**Auditoria e Limpeza**:
- Remoção completa do Sistema RATE (não funcional)
- 10 console.logs removidos
- Lazy loading em 12 páginas
- Build time: 11.94s → 6.67s (-44%)

**Melhorias**:
- Suporte Outlook (spam/trash count)
- Favicon adicionado
- Documentação ARCHITECTURE.md

### v0.2.6 (05/01/2026)

- Sistema RATE (IA) - Pontuação de emails
- Layout Mailstrom - 3 colunas
- Tema NOIR (dark mode)
- Containers quadrados

### v0.2.5 (05/01/2026)

- UI Glassmorphism/Claymorphism
- Landing Page Premium
- RatelFuriosoModal

### v0.2.4 (05/01/2026)

- Página de Termos
- Página de Privacidade
- Checkbox de aceite no login

### v0.2.3 (05/01/2026)

- Sistema Shield/Rollup
- API genérica de mensagens

### v0.2.2 (04/01/2026)

- Correção de sintaxe
- Sidebar sem itálico

### v0.2.1 (04/01/2026)

- Ratel Furioso (cancelamento em massa)
- Modo Demo

### v0.2.0 (04/01/2026) - Release Inicial

- Login Google/Microsoft OAuth
- Detecção de newsletters
- Página de Inscrições
- Página de Limpeza

---

## 16. INSTRUÇÕES DE DEPLOY

### 16.1 Build de Produção

```bash
cd Ratel
npm run build
```

### 16.2 Deploy Vercel (Frontend)

1. Conectar repositório GitHub
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables: `VITE_GEMINI_API_KEY`

### 16.3 Deploy Backend

Usar serviço como Railway, Render ou DigitalOcean:

1. Definir variáveis de ambiente
2. Start command: `node server.js`
3. Porta: 3109

### 16.4 Configuração de Domínio

```
Frontend: ratel.paranaue.com.br
Backend: api.ratel.paranaue.com.br
```

---

## 📎 ANEXOS

### A. Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Frontend
cd server && node server.js  # Backend

# Build
npm run build            # Produção

# Análise
npm run analyze          # Bundle analyzer (se configurado)
```

### B. Estrutura de Dados

#### Email
```typescript
interface Email {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  date: string;
  snippet: string;
  hasUnsubscribe: boolean;
  unsubscribeUrl?: string;
  labels: string[];
  size?: number;
}
```

#### Subscription
```typescript
interface Subscription {
  sender: string;
  senderEmail: string;
  domain: string;
  emailCount: number;
  lastEmail: string;
  averageEngagement: number;
}
```

#### Rule
```typescript
interface Rule {
  id: string;
  type: 'shield' | 'rollup';
  sender: string;
  createdAt: string;
}
```

---

**FIM DO BLUEPRINT**

Este documento contém TODAS as informações necessárias para reconstruir o projeto Ratel do zero.

**Última atualização**: 06/01/2026  
**Versão do documento**: 1.0  
**Mantido por**: Antigravity AI
