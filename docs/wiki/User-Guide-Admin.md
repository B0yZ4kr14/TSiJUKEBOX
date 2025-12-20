# 👨‍💼 Guia de Administração

Manual para administradores do TSiJUKEBOX.

---

## 🔐 Acesso Administrativo

### Requisitos
- Conta com papel **Admin**
- Permissão `canAccessSettings`

### Acessar Painel Admin
1. Faça login com conta admin
2. Clique no ícone ⚙️
3. Ou acesse `/admin` diretamente

---

## 👥 Gerenciamento de Usuários

### Listar Usuários
**Admin > Usuários** exibe:
- Email
- Papel (Admin, User, Newbie)
- Data de criação
- Último acesso

### Criar Usuário
1. **Usuários > Adicionar**
2. Preencha:
   - Email
   - Senha temporária
   - Papel
3. Usuário recebe convite por email (se configurado)

### Editar Usuário
1. Clique no usuário na lista
2. Modifique campos
3. Salvar

### Remover Usuário
1. Clique no ícone 🗑️
2. Confirme exclusão
3. Dados do usuário são removidos

### Papéis e Permissões

| Papel | Descrição |
|-------|-----------|
| **Admin** | Acesso total, gerencia usuários e configurações |
| **User** | Uso normal, cria playlists, acessa histórico |
| **Newbie** | Acesso básico, apenas reprodução |

### Permissões Customizadas
Para cada usuário, configure:
- `canAccessSettings`: Acessar configurações
- `canManageQueue`: Gerenciar fila
- `canControlVolume`: Controlar volume
- `canViewStats`: Ver estatísticas

---

## 📊 Dashboard Administrativo

### Métricas em Tempo Real
- Usuários ativos
- Músicas na fila
- Status de conexões (Spotify, YouTube)
- Uso de recursos

### Estatísticas
- Músicas mais tocadas (dia/semana/mês)
- Horários de pico
- Usuários mais ativos
- Erros e falhas

### Alertas
Configure notificações para:
- Desconexão de provedor
- Erro de reprodução
- Uso anormal
- Atualizações disponíveis

---

## ⚙️ Configurações do Sistema

### Geral
| Configuração | Descrição |
|--------------|-----------|
| Nome do Jukebox | Nome exibido na interface |
| Idioma padrão | Idioma para novos usuários |
| Tema padrão | Tema inicial |
| Timezone | Fuso horário do sistema |

### Áudio
| Configuração | Descrição |
|--------------|-----------|
| Volume padrão | Volume inicial (0-100) |
| Volume máximo | Limite máximo |
| Normalização | Equalização de volume |
| Crossfade | Transição entre músicas |

### Rede
| Configuração | Descrição |
|--------------|-----------|
| URL do Backend | Endpoint da API |
| Porta | Porta do servidor |
| SSL | Habilitar HTTPS |
| CORS | Origens permitidas |

---

## 💾 Backup e Restauração

### Backup Manual
1. **Admin > Backup > Criar Backup**
2. Selecione o que incluir:
   - Configurações
   - Playlists
   - Estatísticas
   - Usuários
3. Baixe arquivo `.backup`

### Backup Automático
1. **Admin > Backup > Agendar**
2. Configure:
   - Frequência (diário/semanal)
   - Horário
   - Destino (local/Storj)
   - Retenção (quantos backups manter)

### Restaurar
1. **Admin > Backup > Restaurar**
2. Selecione arquivo de backup
3. Escolha o que restaurar
4. Confirme

---

## 📝 Logs do Sistema

### Visualizar Logs
**Admin > Logs** exibe:
- Timestamp
- Nível (Info, Warning, Error)
- Componente
- Mensagem

### Filtros
- Por período
- Por nível de severidade
- Por componente
- Por busca de texto

### Exportar
1. Aplique filtros desejados
2. **Exportar > JSON/CSV**
3. Baixe arquivo

### Logs de Auditoria
Registra ações administrativas:
- Alterações de configuração
- Gerenciamento de usuários
- Operações de backup
- Acesso a áreas restritas

---

## 🔧 Manutenção

### Atualização do Sistema
1. Verifique versão atual em **Admin > Sobre**
2. Se atualização disponível, clique em **Atualizar**
3. Sistema reinicia automaticamente

### Limpar Cache
**Admin > Manutenção > Cache**:
- Cache de imagens
- Cache de busca
- Cache de sessão
- Dados temporários

### Reconstruir Índices
Se a busca está lenta ou incorreta:
1. **Admin > Manutenção > Índices**
2. Clique em **Reconstruir**
3. Aguarde conclusão

### Health Check
**Admin > Diagnóstico** verifica:
- Conexão com banco de dados
- Conexão com provedores
- Espaço em disco
- Memória disponível
- Serviços em execução

---

## 🔌 Integrações

### Gerenciar Conexões
Veja status de todas as integrações:
- Spotify: Conectado/Desconectado
- YouTube Music: Status
- Storj: Espaço usado
- Last.fm: Scrobbles enviados

### Reconectar
Se uma integração falhou:
1. Clique em **Reconectar**
2. Siga o fluxo de autorização
3. Verifique status

### Revogar Acesso
Para desconectar uma integração:
1. Clique em **Desconectar**
2. Confirme
3. Dados locais são mantidos

---

## 🛡️ Segurança

### Políticas de Senha
Configure requisitos:
- Comprimento mínimo
- Caracteres especiais
- Expiração
- Histórico

### Sessões Ativas
Veja e gerencie sessões:
- Dispositivo
- IP
- Última atividade
- Opção de encerrar

### Audit Trail
Histórico completo de ações para compliance.

---

## 🚨 Troubleshooting Admin

### Banco de dados inacessível
1. Verifique conexão de rede
2. Teste credenciais
3. Verifique logs do Supabase

### Usuário bloqueado
1. Acesse como outro admin
2. Vá em **Usuários**
3. Desbloqueie ou redefina senha

### Sistema lento
1. Verifique uso de recursos (CPU/RAM)
2. Limpe caches
3. Reconstrua índices
4. Verifique conexão de rede

---

[← Arquivos Locais](User-Guide-Local-Files.md) | [Próximo: Configuração de Banco de Dados →](Config-Database.md)
