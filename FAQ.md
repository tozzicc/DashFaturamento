# ❓ FAQ - Perguntas Frequentes

## 📱 Funcionalidade

### P: Como funciona a atualização em tempo real?
**R:** O backend executa as queries a cada 30 segundos e envia os dados para todos os clientes conectados via WebSocket. Se o WebSocket não funcionar, o frontend automaticamente faz requisições HTTP como fallback.

### P: Posso mudar o intervalo de atualização?
**R:** Sim! No arquivo `backend/src/index.ts`, procure por `setInterval` e altere o valor `30000` (30 segundos) para o valor desejado em milissegundos.

### P: Os velocimetros têm animações suaves?
**R:** Atualmente a transição é instantânea. Para adicionar animação, você pode usar CSS `transition` ou Canvas `requestAnimationFrame`.

---

## 🔧 Configuração

### P: Como alterar as credenciais do banco?
**R:** Edite o arquivo `backend/.env`:
```
DB_SERVER=seu_servidor
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

### P: Posso usar uma porta diferente?
**R:** Sim! Altere em `backend/.env`:
```
API_PORT=3001
```
E atualize em `frontend/.env.local`:
```
VITE_API_URL=http://localhost:3001
```

### P: Como adicionar HTTPS?
**R:** Você precisa de um certificado SSL e atualizar o backend:
```typescript
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
};
https.createServer(options, app).listen(PORT);
```

---

## 🚀 Deployment

### P: Como fazer deploy no Heroku?
**R:** 
1. Crie um `Procfile` na raiz:
   ```
   web: npm --prefix backend run build && npm --prefix backend start
   ```
2. Push para Heroku:
   ```bash
   git push heroku main
   ```
3. Configure variáveis de ambiente no painel do Heroku

### P: Como fazer deploy no Azure?
**R:** Use Azure App Service:
1. Crie uma aplicação Node.js
2. Configure variáveis de ambiente no Application Settings
3. Conecte seu repositório Git

### P: Posso hospedar frontend e backend no mesmo lugar?
**R:** Sim! Compile o frontend e sirva como arquivos estáticos:
```bash
npm run build # na pasta frontend
npm run build # na pasta backend
```

---

## 📊 Dados

### P: Os dados vêm de quais tabelas?
**R:** 
- **Faturamento Diário:** SE1010 (contas a receber) + SZV010 (metas)
- **Faturamento Mensal:** SD2010 (detalhe de NF) + SZV010 (metas)

### P: Como posso alterar as queries?
**R:** Edite `backend/src/queries.ts` nas funções:
- `getFaturamentoDia()`
- `getFaturamentoMes()`

### P: Posso adicionar mais velocimetros?
**R:** Sim! Crie uma nova função em `queries.ts` e adicione um novo `Speedometer` em `frontend/src/App.tsx`.

### P: Os dados estão incorretos. O que fazer?
**R:** 
1. Teste a query diretamente no SQL Server Management Studio
2. Verifique as datas (hoje vs acumulado)
3. Verifique se há dados nas tabelas
4. Confirme se os filtros estão corretos

---

## 🐛 Problemas

### P: "Erro: connect ECONNREFUSED"
**R:** O SQL Server não está acessível. Verifique:
1. SQL Server está rodando
2. Endereço/porta corretos
3. Firewall permite conexão na porta 1433
4. Credenciais estão corretas

### P: "Erro: Pool must have at least one valid"
**R:** Não conseguiu conectar ao banco. Teste:
```bash
telnet SRVFASTSQL 1433
```

### P: Frontend não conecta ao backend
**R:** Verifique:
1. Backend está rodando em http://localhost:3000
2. CORS está habilitado (já está por padrão)
3. `VITE_API_URL` está correto em `frontend/.env.local`

### P: WebSocket conecta mas não recebe dados
**R:** 
1. Verifique os logs do backend
2. Confirme que as queries retornam dados
3. Tente fazer request HTTP manual: `curl http://localhost:3000/api/faturamento`

### P: Velocimetro não aparece
**R:** 
1. Verifique console do navegador (F12)
2. Confirme que Canvas é suportado (navegadores modernos)
3. Verifique se `value` e `max` são números válidos

---

## 🎨 Customização

### P: Como mudar as cores dos velocimetros?
**R:** Em `frontend/src/components/Speedometer.tsx`, procure por:
```javascript
ctx.fillStyle = '#4CAF50'; // Verde
ctx.fillStyle = '#FFC107'; // Amarelo
ctx.fillStyle = '#f44336'; // Vermelho
```

### P: Como alterar a layout do dashboard?
**R:** Edite `frontend/src/App.css`:
```css
.speedometers-grid {
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 40px;
}
```

### P: Posso adicionar mais informações no dashboard?
**R:** Sim! Adicione novos componentes e queries conforme necessário.

---

## 🔒 Segurança

### P: É seguro colocar as credenciais do banco em `.env`?
**R:** Sim, desde que:
1. `.env` está no `.gitignore`
2. Nunca faça commit de `.env` com dados sensíveis
3. Use ambiente seguro (HTTPS em produção)

### P: Como proteger a API?
**R:** Implemente autenticação:
```typescript
import jwt from 'jsonwebtoken';

app.use((req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autorizado' });
  // validar token...
});
```

### P: Posso restringir o acesso por IP?
**R:** Sim, configure o firewall do Windows ou use middleware Express:
```typescript
const allowedIPs = ['192.168.1.100', '10.0.0.0/8'];
app.use((req, res, next) => {
  if (!allowedIPs.includes(req.ip)) {
    return res.status(403).json({ error: 'IP não autorizado' });
  }
  next();
});
```

---

## 📈 Performance

### P: Como melhorar a performance?
**R:**
1. Adicione índices nas tabelas do SQL Server
2. Aumente o intervalo de atualização (menos requisições)
3. Use caching (Redis)
4. Implemente paginação se adicionar mais dados

### P: Quantos clientes o servidor suporta?
**R:** Com configuração padrão, suporta centenas de clientes simultâneos. Para milhares, use cluster ou escalação horizontal.

---

## 🆘 Suporte Técnico

### P: Onde encontro os logs?
**R:**
- **Backend:** Console do Node.js (terminal do backend)
- **Frontend:** DevTools do navegador (F12 → Console)

### P: Como fazer debug?
**R:**
```typescript
// Backend
console.log('Debug:', data);
debugger; // Node.js com --inspect

// Frontend
console.log('Debug:', data);
debugger; // DevTools
```

### P: Como reportar um bug?
**R:** Forneça:
1. Descrição do problema
2. Screenshots/vídeo
3. Logs (backend + frontend)
4. Passos para reproduzir

---

## 📚 Recursos

- [Documentação React](https://react.dev)
- [Documentação TypeScript](https://www.typescriptlang.org/docs)
- [Documentação Socket.io](https://socket.io/docs)
- [Documentação MSSQL](https://learn.microsoft.com/en-us/sql/connect/node-js/node-js-driver-for-sql-server)
- [Documentação Vite](https://vitejs.dev)

---

**Não encontrou sua resposta?** Verifique os logs ou abra uma issue no repositório!
