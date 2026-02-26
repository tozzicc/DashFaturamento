# 🚀 INÍCIO RÁPIDO - Dashboard Velocimetro Faturamento

## Passo 1: Instalar Backend

```bash
cd backend
npm install
npm run dev
```

**Resultado esperado:**
```
✅ Conectado ao SQL Server com sucesso!
🚀 Servidor rodando em http://localhost:3000
```

## Passo 2: Instalar Frontend (novo terminal)

```bash
cd frontend
npm install
npm run dev
```

**Resultado esperado:**
```
✅ Servidor local rodando em http://localhost:5173
```

## Passo 3: Abrir no Navegador

Acesse: **http://localhost:5173**

---

## ✅ Checklist Antes de Iniciar

- [ ] Node.js instalado (`node -v`)
- [ ] SQL Server acessível em SRVFASTSQL:1433
- [ ] Credenciais testadas:
  - Login: **consulta**
  - Senha: **fastcon0321**
  - Banco: **PROTHEUS_PRODUCAO**

---

## 🔧 Troubleshooting Rápido

### ❌ "Erro ao conectar ao SQL Server"
```bash
# Teste a conectividade (Windows PowerShell)
Test-NetConnection SRVFASTSQL -Port 1433
```

### ❌ "Porta 3000 já em uso"
```bash
# Mudar porta no backend .env
API_PORT=3001
```

### ❌ "Módulos não encontrados"
```bash
# Limpar e reinstalar
rm -r node_modules package-lock.json
npm install
```

---

## 📊 O que você verá

1. **Dashboard colorido** com dois velocímetros
2. **Faturamento Diário** - Taxa de conclusão vs meta do dia
3. **Faturamento Mensal** - Taxa de conclusão vs meta do mês
4. **Indicador de conexão** verde = conectado, vermelho = offline
5. **Atualização automática** a cada 30 segundos

---

## 🎯 Dados Exibidos

- Valores em R$ (Real)
- Percentual da meta alcançada (%)
- Cores: 🟢 Verde (Bom), 🟡 Amarelo (Intermediário), 🔴 Vermelho (Crítico)

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do backend (terminal 1)
2. Abra DevTools no navegador (F12) e veja a console
3. Verifique se as tabelas existem no SQL Server:
   - SE1010 (Contas a receber)
   - SD2010 (Detalhe de nota fiscal)
   - SA1010 (Clientes)
   - SZV010 (Metas de faturamento)

---

**Pronto para começar?** 🚀
