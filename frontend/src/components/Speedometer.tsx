import React from 'react';
import GaugeChart from 'react-gauge-chart';
import './Speedometer.css';

interface SpeedometerProps {
  value: number;
  max: number;
  title: string;
  unit?: string;
  targetValue?: number;
  metaAcumulada?: number;
  color?: string;
}

const Speedometer: React.FC<SpeedometerProps> = ({
  value,
  max,
  title,
  unit = 'R$',
  targetValue,
  metaAcumulada = 0,
  color = '#4CAF50',
}) => {
  // Calcular porcentagem
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0;
  const percentageDecimal = max > 0 ? (value / max) : 0;
  // garantir valor finito e entre 0 e 1 (evita NaN/Infinity)
  const safePercent = isFinite(percentageDecimal)
    ? Math.max(0, Math.min(percentageDecimal, 1))
    : 0;

  return (
    <div className="speedometer-container">
      <h2>{title}</h2>
      <div className="gauge-wrapper">
        <GaugeChart
          id={`gauge-${title}`}
          nrOfLevels={3}
          arcsLength={[0.3, 0.5, 0.2]}
          colors={['#f44336', '#FFC107', '#4CAF50']}
          percent={safePercent}
          // animações longas podem causar ponteiro girando se o valor for imprevisto
          animate={false}
          arcPadding={0.02}
          textColor="#333"
          needleColor="#333"
          needleBaseColor="#333"
          formatTextValue={() => ''}
        />
        <div className="percentage-display">
          <span className="percentage-value">{percentage}%</span>
        </div>
      </div>
      {(targetValue || metaAcumulada) && (
        <div className="speedometer-info">
          {metaAcumulada > 0 && (
            <>
              <p><strong>Faturado:</strong> {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p><strong>Meta Acumulada:</strong> {metaAcumulada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p className="highlight"><strong>Diferença:</strong> {(value - metaAcumulada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Speedometer;
