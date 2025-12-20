# ☁️ Configuração de Backup na Nuvem

Configure backup automático usando Storj para manter seus dados seguros.

---

## 🌟 Por que Storj?

O TSiJUKEBOX usa **Storj** para backup na nuvem:

- ✅ **Descentralizado**: Dados distribuídos globalmente
- ✅ **Criptografado**: End-to-end encryption
- ✅ **Econômico**: Preços competitivos
- ✅ **S3 Compatível**: API familiar
- ✅ **Sem vendor lock-in**: Dados sempre acessíveis

---

## 🔧 Configuração Inicial

### Passo 1: Criar Conta Storj

1. Acesse [storj.io](https://www.storj.io)
2. Crie uma conta gratuita
3. Confirme email

### Passo 2: Criar Bucket

1. No dashboard Storj, vá em **Buckets**
2. Clique em **New Bucket**
3. Nome: `tsijukebox-backup`
4. Região: Escolha a mais próxima

### Passo 3: Gerar Access Grant

1. Vá em **Access**
2. Clique em **Create S3 Credentials** ou **Access Grant**
3. Nome: `tsijukebox`
4. Permissões: Read, Write, Delete
5. Buckets: `tsijukebox-backup`
6. Copie o Access Grant gerado

### Passo 4: Configurar no TSiJUKEBOX

1. **Configurações > Backup > Storj**
2. Cole o Access Grant
3. Clique em **Testar Conexão**
4. Se sucesso, **Salvar**

---

## 📦 O Que é Salvo

### Dados do Backup

| Categoria | Conteúdo | Tamanho Estimado |
|-----------|----------|------------------|
| Configurações | Todas as configs do app | < 1 MB |
| Playlists | Playlists locais | < 10 MB |
| Histórico | Logs de reprodução | Varia |
| Estatísticas | Dados de analytics | < 50 MB |
| Temas | Customizações visuais | < 5 MB |
| Usuários | Dados de usuários | < 10 MB |

### Dados NÃO Incluídos
- Arquivos de música (muito grandes)
- Caches temporários
- Tokens de autenticação

---

## ⏰ Backup Automático

### Configurar Agendamento

1. **Configurações > Backup > Agendar**
2. Configure:

| Opção | Descrição | Recomendado |
|-------|-----------|-------------|
| Frequência | Diário/Semanal/Mensal | Diário |
| Horário | Hora do backup | 03:00 (baixo uso) |
| Retenção | Quantos manter | 7 (última semana) |
| Compressão | Comprimir dados | Ativado |

### Política de Retenção

```
Diário: Manter últimos 7 backups
Semanal: Manter últimas 4 semanas
Mensal: Manter últimos 3 meses
```

---

## 📥 Backup Manual

### Criar Backup

1. **Configurações > Backup > Backup Agora**
2. Selecione categorias:
   - [x] Configurações
   - [x] Playlists
   - [x] Histórico
   - [ ] Estatísticas (opcional)
3. Clique em **Iniciar Backup**
4. Aguarde conclusão

### Progresso
- Barra de progresso mostra status
- Tempo estimado exibido
- Notificação ao concluir

---

## 📤 Restauração

### Restaurar Backup

1. **Configurações > Backup > Restaurar**
2. Lista de backups disponíveis aparece:
   - Data/hora
   - Tamanho
   - Categorias incluídas
3. Selecione o backup desejado
4. Escolha o que restaurar:
   - [x] Configurações
   - [x] Playlists
   - [ ] Sobrescrever existentes
5. Clique em **Restaurar**
6. Sistema reinicia automaticamente

### Verificação
Após restaurar:
- Verifique configurações
- Teste reprodução
- Confirme playlists

---

## 🔒 Segurança

### Criptografia

Todos os backups são criptografados:

```
[Dados] → [Compressão] → [Criptografia AES-256] → [Storj]
```

- Chave derivada do Access Grant
- Apenas você pode descriptografar
- Storj não tem acesso aos dados

### Integridade
- Hash SHA-256 de cada backup
- Verificação automática na restauração
- Detecção de corrupção

---

## 📊 Monitoramento

### Ver Histórico

**Configurações > Backup > Histórico**:
- Lista de todos os backups
- Status (sucesso/falha)
- Tamanho de cada backup
- Tempo de execução

### Alertas

Configure notificações:
- Backup concluído com sucesso
- Falha no backup
- Espaço baixo no Storj
- Backup não executado (agendamento perdido)

---

## 🔧 Troubleshooting

### "Erro de autenticação"
1. Verifique se Access Grant está correto
2. Gere novo Access Grant se necessário
3. Verifique permissões do grant

### "Bucket não encontrado"
1. Verifique nome do bucket no Storj
2. Confirme que bucket existe
3. Verifique permissões do Access Grant

### "Timeout no upload"
1. Verifique conexão de internet
2. Tente backup menor (menos categorias)
3. Aumente timeout em Avançado

### "Backup corrompido"
1. Tente restaurar backup anterior
2. Verifique integridade no Storj
3. Crie novo backup se necessário

---

## 💡 Dicas

### Otimização
- Execute backups em horários de baixo uso
- Exclua estatísticas antigas antes de backup
- Use compressão para economizar espaço

### Custos
- Storj cobra por armazenamento e egress
- Backups comprimidos reduzem custos
- Configure retenção para não acumular backups antigos

### Redundância
- Considere backup local adicional
- Exporte periodicamente para HD externo
- Documente processo de restauração

---

[← Banco de Dados](Config-Database.md) | [Próximo: Temas →](Config-Themes.md)
