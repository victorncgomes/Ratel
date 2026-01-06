# Registro de Diálogos — Ratel

## [2026-01-03 23:15] Início do Projeto
**Contexto**: Criação do plano de implementação inicial para o Ratel v0.1

**Decisões**:
- Portas: Frontend 3009, Backend 3109
- Sistema de 3 temas distintos:
  - Neumorphism (padrão Microsoft)
  - Material Design (estilo Google)
  - Tokyo Nights (dark glassmorphism)
- Fontes premium do Google para cada tema
- Versão inicial: 0.1.0 com modo demo

**Ações**:
- Criado task.md com checklist de implementação
- Criado implementation_plan.md com plano detalhado
- Estruturado docs/

---

## [2026-01-03 23:31] Atualização do Sistema de Temas
**Contexto**: Usuário solicitou mudança do design system

**Mudanças**:
- Removido glassmorphism como padrão
- Adicionado Neumorphism como tema padrão (estilo Microsoft)
- Adicionado Material Design como segundo tema (estilo Google)
- Mantido Tokyo Nights com glassmorphism como tema dark
- Atualizadas fontes:
  - Neumorphism: Stack Sans Notch + Zalando Sans
  - Material: Outfit + DM Sans
  - Tokyo Nights: Sora + Manrope

**Ações**:
- Atualizado implementation_plan.md com 3 temas completos
- Atualizado task.md com novas tarefas
- Expandida configuração do Tailwind
- Definido hook useTheme para gerenciamento

---

## [2026-01-03 23:34] Início da Implementação
**Contexto**: Plano aprovado, iniciando implementação da Fase 1

**Ações executadas**:
- ✅ Alterada porta do Vite de 3000 para 3009
- ✅ Criado tailwind.config.js com suporte aos 3 temas
- ✅ Criado postcss.config.js
- ✅ Adicionadas dependências: tailwindcss, postcss, autoprefixer
- ✅ Criado docs/dialogs.md (este arquivo)

**Próximos passos**:
- Instalar dependências (npm install)
- Criar docs/changelog.md
- Criar estrutura de pastas src/
- Implementar hook useTheme

---

## [2026-01-03 23:40] Fase 1 e Sistema de Temas Concluídos
**Contexto**: Implementação bem-sucedida da infraestrutura base

**Tarefas concluídas**:
- ✅ Instaladas dependências (Tailwind, PostCSS, Autoprefixer)
- ✅ Criado hook useTheme com suporte aos 3 temas
- ✅ Criado hook useMediaQuery para responsividade
- ✅ Criados arquivos CSS dos temas:
  - neumorphism.css (sombras soft, estilo Microsoft)
  - material.css (elevações, ripple effects, estilo Google)
  - tokyo.css (glassmorphism, glow effects, cores neon)
- ✅ Removido CDN do Tailwind do index.html
- ✅ Criado index.css principal com imports dos temas
- ✅ Configuradas fontes Google (Outfit, DM Sans, Sora, Manrope, JetBrains Mono)
- ✅ Aplicação rodando em http://localhost:3009

**Observações**:
- Stack Sans Notch e Zalando Sans não estão disponíveis no Google Fonts
- Precisaremos usar fontes alternativas ou self-hosted para o tema Neumorphism
- Erros de lint sobre @tailwind são normais e não afetam funcionamento

**Próximos passos**:
- Criar componentes UI base (Button, Card, Modal, Toast)
- Implementar seletor de tema na interface
- Criar página de login com modo demo

---

## [2026-01-04 10:00] Deploy GitHub + Vercel
**Contexto**: Publicação da aplicação em produção

**Ações**:
- ✅ Repositório criado: https://github.com/victorncgomes/Ratel
- ✅ Deploy Vercel: https://ratel-five.vercel.app
- ✅ Build e deploy concluídos com sucesso

---

## [2026-01-04 10:02] Integração dos Logos SVG
**Contexto**: Adicionar logos oficiais Ratel na aplicação

**Decisões**:
- Proporção símbolo:nome = 60:40
- Símbolo usado no Header e LoginPage
- Nome oculto em mobile (responsivo)

**Ações**:
- ✅ Integrado `ratel.svg` e `name-ratel.svg` no Header e LoginPage
- ✅ Configuradas proporções conforme especificação

---

## [2026-01-04 10:08] Implementação de Backend e Auth Real
**Contexto**: Habilitar login real com Google e Microsoft

**Decisões**:
- Backend Express na porta 3109
- Passport.js para OAuth
- Token passado via URL params (solução cross-port)
- Sessão persistida no localStorage

**Ações**:
- ✅ Criado servidor Node.js/Express em `server/`
- ✅ Configurado Google OAuth Strategy
- ✅ Configurado Microsoft OAuth Strategy
- ✅ Resolvido loop de login via token URL + localStorage
- ✅ Login com Google funcionando

---

## [2026-01-04 11:50] Solicitação v0.2.0 - Melhorias Extensivas
**Contexto**: Usuário solicitou 9 pontos de melhoria para transformar app em produção

**Requisitos**:
1. Novas fontes: Stack Sans + Zalando Sans (Google Fonts)
2. Ícones estilo Microsoft/Fluent (mais coloridos)
3. Inscrições: checkboxes, ações em massa, busca por remetente
4. Labels: IA para classificação, dashboard de preview
5. Ajuda: changelog funcional (v0.0.1 até v0.1.3), remover vídeos
6. Integração real com APIs Gmail/Outlook (ler/excluir emails)
7. Registrar diálogos em docs/dialogs.md (este arquivo)
8. Corrigir botão "Falar com Suporte"
9. Página "Quem Somos" da Paranaue

**Plano criado**: implementation_plan.md (v0.2.0)

---

## [2026-01-04 11:52] Implementação v0.2.0 - Fases A e C
**Contexto**: Execução do plano aprovado

**Ações realizadas**:

### Fase A - Design System
- ✅ Fontes Stack Sans + Zalando Sans configuradas (Google Fonts)
- ✅ Paleta Fluent UI implementada (cores Microsoft)
- ✅ Ícones coloridos na sidebar navigation

### Fase C - Páginas Funcionais
- ✅ Subscriptions: checkboxes, ações em massa, ícones coloridos, visualização expandida
- ✅ Labels: dashboard de IA, sugestões de classificação, preview de análise
- ✅ Help: tabs (Documentação, Changelog 0.0.1–0.1.3, Quem Somos/Paranaue, FAQ)
- ✅ Botão "Falar com Suporte" funcional via mailto
- ✅ Seção de vídeos removida

**Próximos passos**:
- Fase B: Integração real APIs Gmail/Outlook (requer configuração de scopes)
- Fase D: Polimento final

---

## [2026-01-04 12:07] Integração de Dados Reais do Usuário
**Contexto**: Usuário solicitou exibir dados reais quando logado via Google/Microsoft

**Ações realizadas**:
- ✅ App.tsx: Avatar no header mostra foto/inicial do usuário real
- ✅ Profile.tsx: Refatorado para exibir dados reais (nome, email, foto, provedor)
- ✅ Settings.tsx: Removidas seções de Notificação e Segurança (conforme solicitado)
- ✅ Settings.tsx: Adicionadas seções Aparência e Conta
- ✅ Diferenciação entre modo Demo e login real em todas as páginas

**Correção Microsoft OAuth**:
- Adicionado ponto final (`.`) faltante no MICROSOFT_CLIENT_SECRET

## [2026-01-04 12:35] Tipografia Unificada
**Ação**: Unificação total da tipografia para **Stack Sans Notch**.
- Removida fonte **Gacor** (títulos).
- **Stack Sans Notch** agora aplicada em títulos (Headings) e corpo de texto.
- Limpeza de CSS duplicado (`src/styles/index.css`) e estilos inline no `index.html`.

## [2026-01-04 12:40] Tipografia Final: Nexa
**Ação**: Substituição completa pela família de fontes **Nexa** (arquivos locais).
- Nexa Light/Regular/Bold/Heavy configuradas via `@font-face`.
- Google Fonts removido para melhorar performance e eliminar "blink".
- Design System atualizado para usar Nexa em todos os elementos.

## [2026-01-04 12:50] Layout v0.1.4 & Responsividade
**Ação**: Refinamento visual e correções mobile.
- **Layout Limpo**: Removidos cabeçalhos (títulos/descrições) redundantes das páginas principais para maximizar área útil.
- **Responsividade**: Logo `name-ratel.svg` agora visível em mobile (classe `hidden` removida).
- **Versionamento**: Sistema atualizado para v0.1.4, refletindo as melhorias de tipografia e layout no Changelog.

## [2026-01-04 13:10] Fusão de Páginas (Perfil + Configurações)
**Ação**: Simplificação da navegação.
- **Unificação**: Conteúdo de "Configurações" movido para dentro de "Perfil" (substituindo a antiga seção "Atividade Recente").
- **Navegação**: Ambos os botões (Avatar no topo e Configurações na sidebar) agora levam para a mesma tela unificada.
- **Limpeza**: Arquivo `Settings.tsx` removido do projeto.

## [2026-01-04 13:17] Teste de Ícones Emojis
**Ação**: Substituição de ícones do menu por Emojis 3D/Coloridos.
- **Menu Lateral**: Ícones Lucide substituídos por Emojis (📊, 📬, 🏷️, ⚡) para alinhar com o estilo visual dos cards da documentação (Microsoft style).
- **Layout Inscrições**: Botões de ação (Scanear/Filtrar) movidos para dentro da barra de seleção, otimizando espaço vertical.
- **Alinhamento Vertical**: Padding do Main setado para `0` (`pt-0`), utilizando apenas um leve `pt-4` interno para o conteúdo não tocar literalmente na linha, mas ficar visualmente alinhado e alto.
- **Armazenamento**: Widget removido da Sidebar e movido para o topo do Dashboard (Painel), ocupando o 4º card de estatísticas.
- **Top Bar**: Removidos ícones de Notificação e Avatar do topo à direita.
- **Deploy**: Versão v0.1.4 (Design + Layout) deployada para Vercel.
- **Status**: Aguardando aprovação do usuário.
- **Sidebar**:
    - Adicionado item "Notificações" (🔔) na seção de Suporte.
    - Substituído item "Configurações" por um Card de Usuário interativo (Avatar + Nome) no rodapé da Sidebar, que redireciona para o Perfil Unificado.
- **Tradução**: Renomeado "Dashboard" para "Painel" e "Labels" para "Etiquetas".
- **Status**: Aguardando aprovação do usuário.

---

*Este arquivo é atualizado automaticamente a cada interação significativa*

## [2026-01-04 14:50] Integração Real com Gmail e Outlook APIs

**Contexto**: Transformar a aplicação em funcional, lendo emails reais.

**Backend (server/):**
- ✅ `server.js`: Escopos OAuth expandidos para Gmail (readonly + modify) e Outlook (Mail.Read, Mail.ReadWrite)
- ✅ `services/emailService.js`: Funções para Gmail API (fetch, archive, trash, delete, stats)
- ✅ `services/outlookService.js`: Funções para Microsoft Graph API
- ✅ `services/subscriptionDetector.js`: Algoritmo para detectar newsletters automaticamente
- ✅ Novas rotas: `/api/emails`, `/api/subscriptions`, `/api/stats`, `/api/emails/:id/archive`, etc.

**Frontend (src/):**
- ✅ `hooks/useEmails.ts`: Hook para gerenciar emails
- ✅ `hooks/useSubscriptions.ts`: Hook para gerenciar inscrições
- ✅ `hooks/useStats.ts`: Hook para estatísticas
- ✅ `Subscriptions.tsx`: Refatorado para usar dados reais, com loading states e ações funcionais

**Próximos passos:**
- Dashboard com métricas reais
- Labels com classificação via Gemini AI
- Testes end-to-end

---

## [2026-01-06 05:30] Release v0.2.7 - Melhorias Técnicas

**Contexto**: Implementação de melhorias técnicas, documentação e completude de funcionalidades pendentes.

**Decisões e Ações**:

### Backend
- ✅ **Suporte Completo ao Outlook**: Implementada função `getOutlookSpamTrashCount` em `cleanupService.js`
  - Usa Microsoft Graph API para buscar contagens de spam (`/me/mailFolders/junkemail/messages`) e lixeira (`/me/mailFolders/deleteditems/messages`)
  - Integrada com `analyzeInbox` para paridade com Gmail
  - Resolve TODO pendente desde v0.2.6

### Frontend
- ✅ **Favicon**: Adicionado `favicon.png` para resolver erro 404
  - Gerado baseado no logo Ratel (honey badger minimalista)
  - Já estava configurado no `index.html`

### Documentação
- ✅ **ARCHITECTURE.md**: Criado documento completo (400+ linhas) com:
  - Stack tecnológica detalhada
  - Estrutura de pastas do projeto
  - Fluxos de autenticação OAuth (Google/Microsoft)
  - Integração com APIs (Gmail/Outlook)
  - Sistema de temas (NOIR/Aurora)
  - Componentes principais e responsabilidades
  - Serviços backend e rotas da API
  - Sistema RATE (IA) e internacionalização
  - Performance, segurança e deploy

- ✅ **README.md**: Completamente reescrito com:
  - Descrição profissional do projeto
  - Features detalhadas (RATE, visualizações, limpeza, Shield/Rollup)
  - Stack tecnológica
  - Instruções de instalação completas
  - Estrutura do projeto
  - Modo demo
  - Links para documentação
  - Badges de versão e deploy

- ✅ **CHANGELOG.md**: Adicionada entrada para v0.2.7 com todas as melhorias

### Progresso
- 13/46 tarefas completadas (28%)
- Alta Prioridade: 5/13 (38%)
- Média Prioridade: 7/17 (41%)
- Deploy: 1/6 (17%)

**Próximos passos**:
- Otimizações de performance (paginação, debounce, React.memo)
- Limpeza de código (console.logs, JSDoc)
- Melhorias de UX (animações, gráficos)
- Build e deploy para produção

---

*Este arquivo é atualizado automaticamente a cada interação significativa*
