# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [0.2.7] - 2026-01-06

### 🔧 Melhorias
- **Suporte Completo ao Outlook** - Implementada contagem de spam e lixeira para Microsoft Graph API
  - Função `getOutlookSpamTrashCount` em `cleanupService.js`
  - Integração com `analyzeInbox` para Outlook
- **Favicon** - Adicionado favicon.png para resolver erro 404
- **Documentação** - Criado `docs/ARCHITECTURE.md` com arquitetura completa do projeto
  - Estrutura de pastas detalhada
  - Fluxos de autenticação OAuth
  - Integração com APIs (Gmail/Outlook)
  - Sistema de temas e componentes
  - Rotas da API e serviços backend
- **README** - Atualizado com informações completas do projeto

---

## [0.2.6] - 2026-01-05


### ✨ Novidades
- **Sistema RATE (IA)** - Pontuação inteligente 0-100 para cada email baseada em comportamento
  - `useUserBehavior` hook para tracking de ações
  - `rateService` com cálculo local + integração Gemini API
  - `RateBadge` componente visual com cores e emojis
- **Layout Mailstrom** - Interface três colunas com grupos e contagens
  - `GroupsColumn` para visualização agrupada
  - `BulkActionsToolbar` com Deletar, Bloquear, Spam, Rollup, Cancelar Inscrição
- **Botão Rollup** - Agrupar emails no Rollup diário

### 🎨 Design
- **Tema NOIR (Dark Mode)** - Preto profundo, branco gelo, vermelho sangue/rosa choque
- **Containers Quadrados** - Substituídos rounded-2xl por rounded-sm
- **Aurora Glassmorphism** - Gradientes azul→roxo→rosa no tema claro
- **Removidos Headers Redundantes** - UX mais limpa

### 🔧 Melhorias
- Classificação "Por Data" estilo Mailstrom (Ontem, Esta semana, Meses)
- Subscriptions: Cancelar Tudo movido para ao lado da pesquisa
- Labels página removida (consolidada em outras views)

---

## [0.2.5] - 2026-01-05

### ✨ Novidades
- **UI Glassmorphism/Claymorphism** - Redesign completo
- **Landing Page Premium** - Nova página de entrada com traduções
- **RatelFuriosoModal** simplificado

### 🔧 Melhorias
- Dashboard com cards glass/clay
- Cleanup page com categorias visuais
- Sidebar com menu de usuário

---

## [0.2.4] - 2026-01-05

### ✨ Novidades
- **Página de Termos de Uso** (`/terms`)
- **Página de Política de Privacidade** (`/privacy`)
- **Aceite de Termos no Login** - Checkbox obrigatório

### 🔧 Melhorias
- LoginPage redesenhada com badge de segurança

---

## [0.2.3] - 2026-01-05

### ✨ Novidades
- **Sistema Shield/Rollup** - Backend para bloqueio e agrupamento
- **API de Mensagens Genérica** (`/api/messages`)

### 🔧 Melhorias
- Página de Limpeza exibe contagem real de Spam e Lixeira
- Backend de Análise retorna Rascunhos, Spam e Lixeira

---

## [0.2.2] - 2026-01-04

### 🐛 Correções
- Corrigido erro de sintaxe em `Cleanup.tsx`
- Removidos imports não utilizados
- Sidebar menu Italic corrigido

---

## [0.2.1] - 2026-01-04

### ✨ Novidades
- **Ratel Furioso** - Cancelamento em massa de inscrições
- **Modo Demo** - Funciona sem login

### 🔧 Melhorias
- Dashboard com estatísticas
- Detecção automática de newsletters

---

## [0.2.0] - 2026-01-04 (Release Inicial)

### Funcionalidades
- Login com Google e Microsoft OAuth
- Detecção automática de inscrições/newsletters
- Página de Inscrições com ações: Arquivar, Deletar, Cancelar Inscrição
- Página de Limpeza com análise de emails antigos, grandes e rascunhos
