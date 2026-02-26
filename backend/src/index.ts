import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB, closeDB } from './database.js';
import { getFaturamentoDia, getFaturamentoMes, getEnvioTratadorDia, getEnvioTratadorMes, getRecebimentoAtual, getRecebimentoAcumulado } from './queries.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Rota para faturamento do dia
app.get('/api/faturamento/dia', async (req, res) => {
  try {
    const data = await getFaturamentoDia();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturamento do dia' });
  }
});

// Rota para faturamento do mês
app.get('/api/faturamento/mes', async (req, res) => {
  try {
    const data = await getFaturamentoMes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar faturamento do mês' });
  }
});

// Rota para ambos os dados
app.get('/api/faturamento', async (req, res) => {
  try {
    const [dia, mes] = await Promise.all([
      getFaturamentoDia(),
      getFaturamentoMes(),
    ]);
    res.json({ dia, mes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados de faturamento' });
  }
});

// Rotas para envio tratador
app.get('/api/envio-tratador/dia', async (req, res) => {
  try {
    const data = await getEnvioTratadorDia();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar envio tratador do dia' });
  }
});

app.get('/api/envio-tratador/mes', async (req, res) => {
  try {
    const data = await getEnvioTratadorMes();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar envio tratador do mês' });
  }
});

app.get('/api/envio-tratador', async (req, res) => {
  try {
    const [dia, mes] = await Promise.all([
      getEnvioTratadorDia(),
      getEnvioTratadorMes(),
    ]);
    res.json({ dia, mes });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar envio tratador' });
  }
});

// Rotas para recebimentos
app.get('/api/recebimento/atual', async (req, res) => {
  try {
    const data = await getRecebimentoAtual();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar recebimento atual' });
  }
});

app.get('/api/recebimento/acumulado', async (req, res) => {
  try {
    const data = await getRecebimentoAcumulado();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar recebimento acumulado' });
  }
});

app.get('/api/recebimento', async (req, res) => {
  try {
    const [atual, acumulado] = await Promise.all([
      getRecebimentoAtual(),
      getRecebimentoAcumulado(),
    ]);
    res.json({ atual, acumulado });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar recebimentos' });
  }
});

// WebSocket - Atualização em tempo real
io.on('connection', async (socket) => {
  console.log(`✅ Cliente conectado: ${socket.id}`);

  // Enviar dados iniciais
  try {
    const data = await Promise.all([
      getFaturamentoDia(),
      getFaturamentoMes(),
      getEnvioTratadorDia(),
      getEnvioTratadorMes(),
      getRecebimentoAtual(),
      getRecebimentoAcumulado(),
    ]);
    socket.emit('faturamento-data', {
      dia: data[0],
      mes: data[1],
      envioTratador: {
        dia: data[2],
        mes: data[3],
      },
      recebimento: {
        atual: data[4],
        acumulado: data[5],
      },
    });
  } catch (error) {
    console.error('Erro ao enviar dados iniciais:', error);
  }

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`);
  });
});

// Atualizar dados a cada 30 segundos para todos os clientes conectados
setInterval(async () => {
  try {
    const data = await Promise.all([
      getFaturamentoDia(),
      getFaturamentoMes(),
      getEnvioTratadorDia(),
      getEnvioTratadorMes(),
      getRecebimentoAtual(),
      getRecebimentoAcumulado(),
    ]);
    io.emit('faturamento-data', {
      dia: data[0],
      mes: data[1],
      envioTratador: {
        dia: data[2],
        mes: data[3],
      },
      recebimento: {
        atual: data[4],
        acumulado: data[5],
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar dados em tempo real:', error);
  }
}, 30000); // 30 segundos

// Iniciar servidor
async function start() {
  try {
    await connectDB();
    httpServer.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
      console.log(`📡 Acesso remoto: http://<seu-ip>:${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recebido, encerrando...');
  await closeDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT recebido, encerrando...');
  await closeDB();
  process.exit(0);
});

start();
