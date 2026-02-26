# Dashboard de Velocimetro de Faturamento

Dashboard em **React TypeScript** com **Node.js** backend, conectado ao **Microsoft SQL Server** para monitoramento de faturamento em tempo real.

## 📋 Características

✅ Dois velocímetros (Faturamento Diário e Mensal)  
✅ Atualização em tempo real via WebSocket  
✅ Integração com Microsoft SQL Server  
✅ Interface responsiva e moderna  
✅ Fallback para HTTP caso WebSocket falhe  
✅ Indicador de status de conexão  

## 📁 Estrutura do Projeto

```
velocimetro-faturamento/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Servidor Express + Socket.io
│   │   ├── database.ts       # Conexão com MSSQL
│   │   └── queries.ts        # Queries do banco
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Speedometer.tsx
    │   │   └── Speedometer.css
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   └── index.css
    ├── vite.config.ts
    ├── tsconfig.json
    └── package.json
```

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 16+ instalado
- SQL Server rodando e acessível
- Credenciais do banco (fornecidas)

### Backend

1. **Navegar para a pasta backend:**
```bash
cd backend
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Criar arquivo `.env` (copiar de `.env.example`):**
```bash
cp .env.example .env
```

O arquivo `.env` já possui as credenciais:
```
DB_SERVER=SRVFASTSQL
DB_USER=consulta
DB_PASSWORD=fastcon0321
DB_NAME=PROTHEUS_PRODUCAO
DB_PORT=1433
API_PORT=3000
```

4. **Iniciar o servidor (modo desenvolvimento):**
```bash
npm run dev
```

Ou compilar e rodar em produção:
```bash
npm run build
npm start
```

O servidor estará disponível em `http://localhost:3000`

### Frontend

1. **Abrir novo terminal e navegar para a pasta frontend:**
```bash
cd frontend
```

2. **Instalar dependências:**
```bash
npm install
```

3. **Iniciar o servidor de desenvolvimento:**
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## 📊 Como Funciona

### Backend

- **Express**: Fornece a API REST
- **Socket.io**: Conexão WebSocket para atualização em tempo real
- **mssql**: Driver para SQL Server
- **Queries personalizadas**: Faturamento diário e mensal do banco PROTHEUS_PRODUCAO

**Endpoints disponíveis:**
- `GET /api/health` - Health check
- `GET /api/faturamento/dia` - Faturamento do dia
- `GET /api/faturamento/mes` - Faturamento do mês
- `GET /api/faturamento` - Ambos os dados
- `WebSocket` - Atualização automática a cada 30 segundos

### Frontend

- **React**: Interface de usuário
- **TypeScript**: Type safety
- **Canvas**: Renderização dos velocímetros
- **Socket.io Client**: Conexão WebSocket
- **Axios**: Fallback HTTP
- **Vite**: Build tool rápido

## 📈 Velocimetros

Cada velocimetro exibe:
- ✅ Percentual da meta alcançada (0-100%)
- ✅ Valor total faturado
- ✅ Meta estabelecida
- ✅ Cores indicativas: Verde (bom), Amarelo (intermediário), Vermelho (crítico)

## 🔄 Atualização em Tempo Real

Os dados são atualizados automaticamente a cada **30 segundos** via WebSocket.

Se a conexão WebSocket falhar, o frontend tenta fazer requisições HTTP como fallback.

## 🛠️ Troubleshooting

### "Erro ao conectar ao SQL Server"

1. Verifique se o SQL Server está rodando
2. Confirme as credenciais em `.env`
3. Teste a conectividade:
   ```bash
   telnet SRVFASTSQL 1433
   ```

### "WebSocket não conecta"

1. Verifique a porta 3000 não está em uso
2. Confirme o firewall permite a conexão
3. Verifique o console do navegador para erros

### "Dados não aparecem"

1. Verifique se as tabelas (SE1010, SD2010, SZV010) existem no banco
2. Veja os logs do backend para erros de query
3. Teste as queries diretamente no SQL Server Management Studio

## 📝 Queries Personalizadas

As queries foram otimizadas para o banco PROTHEUS_PRODUCAO:

**Faturamento Diário:**
- Soma de E1_VALOR (SE1010) para o dia atual
- Nota Fiscal (E1_TIPO = 'NF') com status ativo (E1_STATUS = 'A')
- Meta do dia (SZV010)

**Faturamento Mensal:**
- Soma de D2_TOTAL (SD2010) para o mês atual
- Vendas de saída (D2_TIPO = 'N')
- Notas selecionadas por CFOP (5124, 5101)
- Exclui devoluções (D1010)
- Meta acumulada do mês (SZV010)

## 🔐 Segurança

- Use variáveis de ambiente para credenciais
- Nunca commit `.env` com dados sensíveis
- Considere usar connection pooling em produção
- Implemente autenticação no frontend se necessário

## 📱 Responsividade

O dashboard é totalmente responsivo:
- Desktop: 2 velocimetros lado a lado
- Tablet: 1-2 velocimetros
- Mobile: 1 velocimetro por linha

## 🎨 Customização

Para alterar cores, tamanhos ou temas, edite:
- `frontend/src/components/Speedometer.css` - Estilos dos velocimetros
- `frontend/src/App.css` - Estilos gerais do dashboard
- `frontend/src/components/Speedometer.tsx` - Lógica de renderização

## 🚢 Deploy

### Backend (Heroku/Railway/Azure)

1. Criar `Procfile`:
```
web: npm run build && npm start
```

2. Deploy via CLI do serviço escolhido

### Frontend (Vercel/Netlify)

1. Atualizar `VITE_API_URL` no deploy
2. Push para repositório Git
3. Deploy automático via CI/CD

## 📞 Suporte

Para dúvidas ou problemas, consulte os logs:
- Backend: `console` do Node.js
- Frontend: `DevTools` do navegador (F12)

## 📜 Licença

MIT

---

**Criado em:** Fevereiro de 2026  
**Versão:** 1.0.0
