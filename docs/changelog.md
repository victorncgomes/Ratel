# Changelog — Ratel

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [0.1.0] - 2026-01-03

### Adicionado
- Estrutura inicial do projeto com Vite + React + TypeScript
- Sistema de 3 temas completos:
  - Neumorphism (padrão Microsoft)
  - Material Design (estilo Google)
  - Tokyo Nights (dark glassmorphism)
- Configuração do Tailwind CSS com cores e sombras customizadas
- Fontes premium do Google:
  - Stack Sans Notch + Zalando Sans (Neumorphism)
  - Outfit + DM Sans (Material Design)
  - Sora + Manrope (Tokyo Nights)
  - JetBrains Mono (código)
- Sistema de documentação (docs/)
- Plano de implementação completo
- Checklist de tarefas (task.md)

### Configurado
- Porta do frontend: 3009
- Porta do backend (futura): 3109
- PostCSS com Tailwind e Autoprefixer
- TypeScript 5.8.2

### Em Desenvolvimento
- Hook useTheme para gerenciamento de temas
- Componentes UI base (Button, Card, Modal, Toast)
- Página de login com modo demo
- Dashboard com métricas mock
- Central de inscrições

---

## [Unreleased]

### Planejado para v0.2
- Integração com Gmail API
- OAuth Google funcional
- Sincronização de emails
- Detecção real de newsletters

### Planejado para v0.3
- Integração com Microsoft Graph API
- OAuth Microsoft funcional
- Multi-conta funcional
- Backend completo

---

*Última atualização: 2026-01-03 23:35*
