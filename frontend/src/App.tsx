import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Speedometer from './components/Speedometer';
import './App.css';

interface FaturamentoData {
  total_dia: number;
  meta_dia: number;
  fat_total: number;
  meta_mes: number;
  meta_acumulada_mes: number;
  envio_tratador?: {
    dia: {
      total_trat_dia: number;
      meta_dia: number;
    };
    mes: {
      fat_total: number;
      meta_mes: number;
      meta_acumulada_mes: number;
    };
  };
}

const DashboardContent: React.FC<{ data: FaturamentoData }> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  const calculatePercentage = (value: number, target: number) => {
    if (target === 0) return 0;
    return (value / target) * 100;
  };

  return (
    <>
      <div className="speedometers-grid">
        <Speedometer
          title="FATURAMENTO DIÁRIO"
          value={calculatePercentage(data.total_dia, data.meta_dia)}
          max={100}
          unit="%"
          targetValue={data.meta_dia}
          color="#4CAF50"
        />
        <Speedometer
          title="FATURAMENTO MENSAL"
          value={data.fat_total}
          max={Math.max(data.fat_total, data.meta_acumulada_mes) * 1.2}
          unit="R$"
          metaAcumulada={data.meta_acumulada_mes}
          color="#2196F3"
        />
        <Speedometer
          title="ENVIO TRATADOR DIÁRIO"
          value={data.envio_tratador ? calculatePercentage(data.envio_tratador.dia.total_trat_dia, data.envio_tratador.dia.meta_dia) : 0}
          max={100}
          unit="%"
          targetValue={data.envio_tratador ? data.envio_tratador.dia.meta_dia : undefined}
          color="#FF5722"
        />
        <Speedometer
          title="ENVIO TRATADOR MENSAL"
          value={data.envio_tratador ? data.envio_tratador.mes.fat_total : 0}
          max={data.envio_tratador ? Math.max(data.envio_tratador.mes.fat_total, data.envio_tratador.mes.meta_acumulada_mes) * 1.2 : 100}
          unit="R$"
          metaAcumulada={data.envio_tratador ? data.envio_tratador.mes.meta_acumulada_mes : 0}
          color="#9C27B0"
        />
      </div>

      <div className="info-panel">
        <div className="info-card">
          <h3>Faturamento Diário</h3>
          <div className="info-row">
            <span className="label">Faturado:</span>
            <span className="value">{formatCurrency(data.total_dia)}</span>
          </div>
          <div className="info-row">
            <span className="label">Meta:</span>
            <span className="value">{formatCurrency(data.meta_dia)}</span>
          </div>
          <div className="info-row highlight">
            <span className="label">% da Meta:</span>
            <span className="value">{calculatePercentage(data.total_dia, data.meta_dia).toFixed(1)}%</span>
          </div>
        </div>

        <div className="info-card">
          <h3>Faturamento Mensal</h3>
          <div className="info-row">
            <span className="label">Faturado:</span>
            <span className="value">{formatCurrency(data.fat_total)}</span>
          </div>
          <div className="info-row">
            <span className="label">Meta Acumulada:</span>
            <span className="value">{formatCurrency(data.meta_acumulada_mes)}</span>
          </div>
          <div className="info-row highlight">
            <span className="label">Diferença:</span>
            <span className="value">{formatCurrency(data.fat_total - data.meta_acumulada_mes)}</span>
          </div>
        </div>

        <div className="info-card">
          <h3>Envio Tratador Diário</h3>
          <div className="info-row">
            <span className="label">Faturado:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(data.envio_tratador.dia.total_trat_dia)
                : '-'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Meta:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(data.envio_tratador.dia.meta_dia)
                : '-'}
            </span>
          </div>
          <div className="info-row highlight">
            <span className="label">% da Meta:</span>
            <span className="value">
              {data.envio_tratador
                ? calculatePercentage(
                  data.envio_tratador.dia.total_trat_dia,
                  data.envio_tratador.dia.meta_dia
                ).toFixed(1) + '%'
                : '-'}
            </span>
          </div>
        </div>

        <div className="info-card">
          <h3>Envio Tratador Mensal</h3>
          <div className="info-row">
            <span className="label">Faturado:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(data.envio_tratador.mes.fat_total)
                : '-'}
            </span>
          </div>
          <div className="info-row">
            <span className="label">Meta Acumulada:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(data.envio_tratador.mes.meta_acumulada_mes)
                : '-'}
            </span>
          </div>
          <div className="info-row highlight">
            <span className="label">Diferença:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(
                  data.envio_tratador.mes.fat_total -
                  data.envio_tratador.mes.meta_acumulada_mes
                )
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [data, setData] = useState<FaturamentoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'dashboard' | 'history' | 'recebimentos'>('dashboard');
  const [history, setHistory] = useState<Array<{ date: string; data: FaturamentoData }>>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [recebimentos, setRecebimentos] = useState<{ atual: Record<string, number>; acumulado: Record<string, number> } | null>(null);
  const [now, setNow] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleString('pt-BR', { hour12: false });
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
  // Usa a mesma variável de ambiente para o Socket, removendo o hardcode que causa erro na Vercel
  const SOCKET_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3000`;

  useEffect(() => {
    // carregar histórico do localStorage
    const stored = localStorage.getItem('faturamento_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        // ignore
      }
    }

    // Atualiza relógio da UI a cada segundo
    const timer = setInterval(() => {
      const d = new Date();
      setNow(d.toLocaleString('pt-BR', { hour12: false }));
    }, 1000);

    // Conectar ao WebSocket
    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
      setConnected(true);
      setError(null);
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
      setConnected(false);
    });

    socket.on('faturamento-data', (faturamentoData: any) => {
      console.log('📊 Dados recebidos:', faturamentoData);
      const newData = {
        total_dia: faturamentoData.dia.total_dia,
        meta_dia: faturamentoData.dia.meta_dia,
        fat_total: faturamentoData.mes.fat_total,
        meta_mes: faturamentoData.mes.meta_mes,
        meta_acumulada_mes: faturamentoData.mes.meta_acumulada_mes || 0,
        envio_tratador: faturamentoData.envioTratador || undefined,
      };
      setData(newData);
      setLoading(false);
      saveToHistory(newData);
      // Atualizar recebimentos se disponível
      if (faturamentoData.recebimento) {
        setRecebimentos(faturamentoData.recebimento);
      }
    });

    socket.on('connect_error', (err: any) => {
      console.error('Erro de conexão:', err.message);
      setError(`Erro ao conectar: ${err.message}`);
      // Tentar buscar dados via HTTP como fallback
      fetchDataHTTP();
    });

    socket.on('error', (err: any) => {
      console.error('Erro do socket:', err);
      setError(`Erro: ${err}`);
    });

    return () => {
      socket.disconnect();
      // limpar timer do relógio
      // (timer cleanup handled by return in outer useEffect)
    };
  }, [API_BASE_URL]);

  const fetchDataHTTP = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/faturamento`);
      const newData = {
        total_dia: response.data.dia.total_dia,
        meta_dia: response.data.dia.meta_dia,
        fat_total: response.data.mes.fat_total,
        meta_mes: response.data.mes.meta_mes,
        meta_acumulada_mes: response.data.mes.meta_acumulada_mes || 0,
        envio_tratador: undefined,
      };
      setData(newData);
      setLoading(false);
      setConnected(true);
      saveToHistory(newData);
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(`Erro ao buscar dados: ${err.message}`);
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculatePercentage = (value: number, target: number): number => {
    if (target === 0) return 0;
    return (value / target) * 100;
  };

  const saveToHistory = (newData: FaturamentoData) => {
    const today = new Date().toISOString().slice(0, 10);
    setHistory(prev => {
      // Verifica se já existe entrada para hoje
      const existingIndex = prev.findIndex(entry => entry.date === today);
      let updated;

      if (existingIndex >= 0) {
        // Atualiza a entrada existente com os novos dados
        updated = [...prev];
        updated[existingIndex] = { date: today, data: newData };
      } else {
        // Cria nova entrada
        updated = [...prev, { date: today, data: newData }];
      }

      localStorage.setItem('faturamento_history', JSON.stringify(updated));
      return updated;
    });
  };

  const formatDateDisplay = (dateStr: string): string => {
    // Converte YYYY-MM-DD para DD/MM/YYYY
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrencyValue = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-area">
          <img src="/logo.png" alt="Fastwork" className="app-logo" />
          <div className="logo-datetime">{now}</div>
        </div>
        <h1>Dashboard de Faturamento</h1>
        <nav className="main-nav">
          <button
            className={view === 'dashboard' ? 'active' : ''}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={view === 'recebimentos' ? 'active' : ''}
            onClick={() => setView('recebimentos')}
          >
            Recebimentos
          </button>
          <button
            className={view === 'history' ? 'active' : ''}
            onClick={() => setView('history')}
          >
            Histórico
          </button>
        </nav>
        <div className="connection-status">
          <div className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></div>
          <span>{connected ? 'Conectado' : 'Desconectado'}</span>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          <p>⚠️ {error}</p>
        </div>
      )}

      {view === 'recebimentos' ? (
        <div className="recebimentos-view">
          <h2>Recebimentos</h2>
          <div className="recebimentos-container">
            <div className="recebimentos-section">
              <h3>Recebimento Atual</h3>
              <div className="recebimentos-list">
                {recebimentos && Object.entries(recebimentos.atual).length > 0 ? (
                  Object.entries(recebimentos.atual)
                    .reverse()
                    .map(([vencimento, valor]) => (
                      <div key={vencimento} className="recebimento-item">
                        <span className="recebimento-vencimento">{vencimento}</span>
                        <span className="recebimento-valor">{formatCurrencyValue(valor)}</span>
                      </div>
                    ))
                ) : (
                  <p>Sem dados disponíveis</p>
                )}
              </div>
            </div>
            <div className="recebimentos-section">
              <h3>Recebimento Acumulado</h3>
              <div className="recebimentos-list">
                {recebimentos && Object.entries(recebimentos.acumulado).length > 0 ? (
                  Object.entries(recebimentos.acumulado)
                    .map(([vencimento, valor]) => ({ vencimento, valor }))
                    .sort((a, b) => {
                      // vencimento format: MM/YYYY -> ordenar por YYYYMM desc
                      const [am, ay] = a.vencimento.split('/').map(s => parseInt(s, 10));
                      const [bm, by] = b.vencimento.split('/').map(s => parseInt(s, 10));
                      const aval = (ay || 0) * 100 + (am || 0);
                      const bval = (by || 0) * 100 + (bm || 0);
                      return bval - aval;
                    })
                    .map(({ vencimento, valor }) => (
                      <div key={vencimento} className="recebimento-item">
                        <span className="recebimento-vencimento">{vencimento}</span>
                        <span className="recebimento-valor">{formatCurrencyValue(valor)}</span>
                      </div>
                    ))
                ) : (
                  <p>Sem dados disponíveis</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : view === 'history' ? (
        <div className="history-view">
          <h2>Histórico de dados</h2>
          <div className="history-list">
            {history.length > 0 ? (
              history
                .filter(entry => entry.date !== new Date().toISOString().slice(0, 10))
                .map(entry => (
                  <button
                    key={entry.date}
                    className={entry.date === selectedDate ? 'selected' : ''}
                    onClick={() => setSelectedDate(entry.date)}
                  >
                    {formatDateDisplay(entry.date)}
                  </button>
                ))
            ) : (
              <p>Sem registros salvos.</p>
            )}
          </div>
          {selectedDate && (
            <button onClick={() => setSelectedDate(null)}>Voltar</button>
          )}
          {selectedDate && (
            <div className="dashboard">
              {/* reusar a mesma renderização do dashboard com dados de history */}
              <DashboardContent
                data={history.find(e => e.date === selectedDate)!.data}
              />
            </div>
          )}
        </div>
      ) : loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      ) : data ? (
        <div className="dashboard">
          <DashboardContent data={data} />
        </div>
      ) : (
        <div className="no-data">
          <p>Nenhum dado disponível</p>
        </div>
      )}

      <footer className="app-footer">
        <p>Atualizado em tempo real</p>
      </footer>
    </div>
  );
};

export default App;
