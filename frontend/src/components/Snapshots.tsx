import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SnapshotViewer from './SnapshotViewer';

const Snapshots: React.FC<{ apiBase: string }> = ({ apiBase }) => {
  const [list, setList] = useState<Array<any>>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [compact, setCompact] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${apiBase}/api/snapshots`);
      setList(res.data);
    } catch (err) {
      console.error('Erro ao listar snapshots', err);
    }
  };

  const viewSnapshot = async (file: string) => {
    try {
      const res = await axios.get(`${apiBase}/api/snapshots/${file}`);
      setSelected(file);
      // map snapshot structure to FaturamentoData expected by viewer
      const s = res.data;
      const mapped = {
        total_dia: s.faturamento?.dia?.total_dia || 0,
        meta_dia: s.faturamento?.dia?.meta_dia || 0,
        fat_total: s.faturamento?.mes?.fat_total || 0,
        meta_mes: s.faturamento?.mes?.meta_mes || 0,
        meta_acumulada_mes: s.faturamento?.mes?.meta_acumulada_mes || 0,
        envio_tratador: s.envioTratador ? {
          dia: {
            total_trat_dia: s.envioTratador.dia?.total_trat_dia || 0,
            meta_dia: s.envioTratador.dia?.meta_dia || 0,
          },
          mes: {
            fat_total: s.envioTratador.mes?.fat_total || 0,
            meta_mes: s.envioTratador.mes?.meta_mes || 0,
            meta_acumulada_mes: s.envioTratador.mes?.meta_acumulada_mes || 0,
          }
        } : undefined,
      };
      setData(mapped);
    } catch (err) {
      console.error('Erro ao obter snapshot', err);
      setData(null);
    }
  };

  return (
    <div className="snapshots-view">
      <h2>Histórico</h2>
      <div style={{display: 'flex', gap: '16px'}}>
        <div style={{width: '320px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 style={{margin: 0}}>Lista</h3>
            <div>
              <button onClick={fetchList} style={{padding: '6px 10px', fontSize: '0.9rem', marginRight: 8}}>Atualizar</button>
              <button onClick={() => setCompact(c => !c)} style={{padding: '6px 10px', fontSize: '0.9rem'}}>{compact ? 'Compacto: ON' : 'Compacto: OFF'}</button>
            </div>
          </div>
          {list.length === 0 ? <p>Nenhum snapshot</p> : (
            <ul>
              {list.map((f: any) => (
                <li key={f.file}>
                  <button onClick={() => viewSnapshot(f.file)}>{f.file} ({Math.round(f.size/1024)} KB)</button>
                </li>
              ))}
            </ul>
          )}
        </div>
          <div style={{flex: 1}}>
          <h3>Visualização</h3>
          {data ? (
            <SnapshotViewer data={data} compact={compact} />
          ) : (
            <p>Selecione um snapshot para visualizar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Snapshots;
