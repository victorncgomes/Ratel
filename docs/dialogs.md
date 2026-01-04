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

*Este arquivo é atualizado automaticamente a cada interação significativa*
