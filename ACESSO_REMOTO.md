# 🌐 Acesso Remoto - Instruções

## Configurar para Acesso em Outro Computador

### 1. **Obter o IP da máquina do servidor**

No computador que está rodando o dashboard, abra PowerShell e execute:

```bash
ipconfig
```

Procure por **IPv4 Address** (exemplo: `192.168.1.100` ou `10.0.0.50`)

---

### 2. **Backend - Já Configurado ✅**

O backend foi configurado para ouvir em `0.0.0.0` (todas as interfaces) na porta `3000`.

Confirme em `backend/.env`:
```
API_PORT=3000
FRONTEND_URL=*
```

---

### 3. **Frontend - Configurar URL do API**

No arquivo `frontend/.env`, atualize a URL do servidor:

```env
# Para acesso local:
VITE_API_URL=http://localhost:3000

# Para acesso remoto (substitua pelo IP correto):
VITE_API_URL=http://192.168.1.100:3000
```

---

### 4. **Iniciar os Serviços**

#### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

---

### 5. **Acessar de Outro Computador**

No outro computador, abra o navegador e acesse:

```
http://192.168.1.100:5173
```

(Substitua `192.168.1.100` pelo IP real da sua máquina)

---

## 🔧 Firewall

Se não conseguir conectar, verifique se o firewall permite:
- **Porta 5173** (frontend Vite)
- **Porta 3000** (backend API + WebSocket)

No Windows Firewall, adicione uma regra de entrada para estas portas.

---

## 📝 Resumo das Mudanças

✅ Backend ouve em `0.0.0.0:3000`  
✅ CORS configurado para aceitar todas as origens (`FRONTEND_URL=*`)  
✅ Frontend pronto para receber `VITE_API_URL` dinâmica  

Basta alterar `frontend/.env` conforme seu IP!

