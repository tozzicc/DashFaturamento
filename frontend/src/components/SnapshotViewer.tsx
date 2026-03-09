import React from 'react';
import Speedometer from './Speedometer';
import './SnapshotViewer.css';

export interface FaturamentoData {
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

const SnapshotViewer: React.FC<{ data: FaturamentoData; compact?: boolean }> = ({ data, compact = false }) => {
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
    <div className={`snapshot-viewer ${compact ? 'compact' : 'full'}`}>
    <>
      <div className="speedometers-grid">
        <Speedometer
          title="FATURAMENTO DIÁRIO"
          value={data.total_dia}
          max={data.meta_dia}
          unit="R$"
          targetValue={data.meta_dia}
          color="#4CAF50"
          centerAsCurrency={false}
          showCenter={true}
        />
        <Speedometer
          title="FATURAMENTO MENSAL"
          value={data.fat_total}
          max={Math.max(data.fat_total, data.meta_mes || data.meta_acumulada_mes || 0) * 1.2}
          unit="R$"
          targetValue={data.meta_mes}
          metaAcumulada={data.meta_acumulada_mes}
          centerAsCurrency={false}
          showCenter={true}
          color="#2196F3"
        />
        <Speedometer
          title="ENVIO TRATADOR DIÁRIO"
          value={data.envio_tratador ? data.envio_tratador.dia.total_trat_dia : 0}
          max={data.envio_tratador ? data.envio_tratador.dia.meta_dia : 1}
          unit="R$"
          targetValue={data.envio_tratador ? data.envio_tratador.dia.meta_dia : undefined}
          color="#FF5722"
          centerAsCurrency={false}
          showCenter={true}
        />
        <Speedometer
          title="ENVIO TRATADOR MENSAL"
          value={data.envio_tratador ? data.envio_tratador.mes.fat_total : 0}
          max={data.envio_tratador ? Math.max(data.envio_tratador.mes.fat_total, data.envio_tratador.mes.meta_mes || data.envio_tratador.mes.meta_acumulada_mes || 0) * 1.2 : 100}
          unit="R$"
          targetValue={data.envio_tratador ? data.envio_tratador.mes.meta_mes : undefined}
          metaAcumulada={data.envio_tratador ? data.envio_tratador.mes.meta_acumulada_mes : 0}
          centerAsCurrency={false}
          showCenter={true}
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
            <span className="label">Meta:</span>
            <span className="value">{formatCurrency(data.meta_mes)}</span>
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
                ? (calculatePercentage(
                    data.envio_tratador.dia.total_trat_dia,
                    data.envio_tratador.dia.meta_dia
                  ).toFixed(1) + '%')
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
            <span className="label">Meta:</span>
            <span className="value">
              {data.envio_tratador
                ? formatCurrency(data.envio_tratador.mes.meta_mes)
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
    </div>
  );
};

export default SnapshotViewer;
