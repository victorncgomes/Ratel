# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [2.0.0] - 2026-01-05

### ✨ Novidades
- **Página de Termos de Uso** (`/terms`) - Conformidade legal
- **Página de Política de Privacidade** (`/privacy`) - Transparência sobre dados
- **Aceite de Termos no Login** - Checkbox obrigatório antes de conectar conta
- **Sistema de Regras (Shield/Rollup)** - Backend para bloqueio e agrupamento de remetentes
- **API de Mensagens Genérica** (`/api/messages`) - Suporte a filtros avançados do Gmail

### 🔧 Melhorias
- **Página de Limpeza** agora exibe contagem real de Spam e Lixeira
- **Backend de Análise** retorna dados de Rascunhos, Spam e Lixeira
- **LoginPage** redesenhada com badge de segurança

### 🐛 Correções
- Corrigido erro de sintaxe em `Cleanup.tsx`
- Removidos imports não utilizados

---

## [1.0.0] - 2026-01-04 (Release Inicial)

### Funcionalidades
- Login com Google e Microsoft OAuth
- Detecção automática de inscrições/newsletters
- Página de Inscrições com ações: Arquivar, Deletar, Cancelar Inscrição
- Página de Limpeza com análise de emails antigos, grandes e rascunhos
- Dashboard com estatísticas
- "Ratel Furioso" - Cancelamento em massa de inscrições
- Suporte a modo Demo (sem login)
