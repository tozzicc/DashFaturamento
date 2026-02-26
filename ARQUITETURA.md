# 🏗️ ARQUITETURA DO PROJETO

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Frontend (React TypeScript)                                    │
│  ├─ App.tsx (componente principal)                             │
│  ├─ Speedometer.tsx (componente velocimetro)                   │
│  └─ Comunicação via WebSocket + HTTP                           │
│                                                                 │
│  ↕️  (WebSocket port 3000)                                      │
│                                                                 │
│  Backend (Node.js + Express)                                   │
│  ├─ index.ts (servidor + rotas)                                │
│  ├─ database.ts (conexão MSSQL)                                │
│  └─ queries.ts (queries customizadas)                          │
│                                                                 │
│  ↕️  (TCP port 1433)                                            │
│                                                                 │
│  SQL Server (PROTHEUS_PRODUCAO)                                │
│  ├─ SE1010 (contas a receber)                                  │
│  ├─ SD2010 (detalhe NF)                                        │
│  ├─ SA1010 (clientes)                                          │
│  └─ SZV010 (metas)                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Componentes Principais

### Backend (`/backend`)

**index.ts** - Servidor Express
- Express para servir a API
- Socket.io para WebSocket
- CORS configurado
- Rotas para faturamento
- Loop de atualização a cada 30s

**database.ts** - Gerenciador de Banco
- Conexão com SQL Server via `mssql`
- Pool de conexões
- Tratamento de erros
- Graceful shutdown

**queries.ts** - Funções de Query
- `getFaturamentoDia()` - Dados do dia
- `getFaturamentoMes()` - Dados do mês
- Cálculos de totais e metas
- TypeScript interfaces

### Frontend (`/frontend`)

**App.tsx** - Componente Principal
- Gerencia estado global (loading, data, connected)
- Socket.io com reconnection automática
- HTTP fallback
- Formatação de moeda
- Cálculo de percentuais

**Speedometer.tsx** - Componente Velocimetro
- Renderização em Canvas HTML5
- Cálculo de ângulos (escala 0-180°)
- Cores dinâmicas (verde/amarelo/vermelho)
- Display de valor + meta + percentual

**App.css** - Estilos Globais
- Layout responsivo
- Animações (conexão, loading)
- Gradiente de fundo
- Card design

## Comunicação

### WebSocket (Tempo Real)

```javascript
// Cliente (Frontend)
socket.on('faturamento-data', (data) => {
  // Recebe dados a cada 30s
  setData(data);
});

// Servidor (Backend)
io.emit('faturamento-data', {
  dia: getFaturamentoDia(),
  mes: getFaturamentoMes(),
});
```

### HTTP (Fallback)

```
GET http://localhost:3000/api/faturamento

Response:
{
  "dia": {
    "total_dia": 269627.35,
    "meta_dia": 435000.00
  },
  "mes": {
    "fat_total": 4664126.50,
    "meta_mes": 7830000.00
  }
}
```

## TypeScript Interfaces

### Backend

```typescript
interface FaturamentoDia {
  total_dia: number;
  meta_dia: number;
}

interface FaturamentoMes {
  fat_total: number;
  meta_mes: number;
}
```

### Frontend

```typescript
interface FaturamentoData {
  total_dia: number;
  meta_dia: number;
  fat_total: number;
  meta_mes: number;
}

interface SpeedometerProps {
  value: number;
  max: number;
  title: string;
  unit?: string;
  targetValue?: number;
  color?: string;
}
```

## Ciclo de Vida

### Backend Startup
1. Carrega variáveis de ambiente (.env)
2. Estabelece conexão com SQL Server
3. Inicializa Express + Socket.io
4. Inicia loop de atualização (30s)
5. Aguarda conexões de clientes

### Frontend Startup
1. Monta App.tsx
2. Conecta ao WebSocket
3. Recebe dados iniciais via socket
4. Renderiza Speedometers
5. Continua recebendo atualizações

### Atualização de Dados
1. Backend: a cada 30s executa queries
2. Backend: envia dados para TODOS os clientes conectados
3. Frontend: recebe dados via socket.on()
4. Frontend: atualiza estado (setData)
5. Frontend: React re-renderiza velocimetros

## Tratamento de Erros

### Backend
- Erros de conexão: log no console + tratamento
- Erros de query: try/catch + API 500
- Clientes desconectados: log automático

### Frontend
- Erro de socket: fallback para HTTP
- Erro HTTP: banner de erro
- Loading: spinner durante carregamento
- Desconexão: indicador visual + tentativas de reconexão

## Performance

- **Atualização**: 30 segundos (configurável em index.ts)
- **Conexão**: Pool de conexões reutilizadas
- **Renderização**: Canvas otimizado
- **Bundle**: Vite otimiza automaticamente

## Segurança

- Credenciais em `.env` (nunca no código)
- TypeScript para type safety
- Queries parametrizadas
- CORS configurável
- Sem dependências desatualizadas

## Escalabilidade

Para múltiplos servidores:
1. Redis para compartilhar sessões
2. Load balancer (Nginx)
3. SQL Server com replicação
4. Frontend em CDN

---

**Versão**: 1.0.0  
**Data**: Fevereiro 2026
