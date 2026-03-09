import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ControleProducao.css';

interface Props {
  apiBase: string;
}

const ControleProducao: React.FC<Props> = ({ apiBase }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(200);
  const [pnFilter, setPnFilter] = useState<string>('');
  const [ocFilter, setOcFilter] = useState<string>('');
  const [opFilter, setOpFilter] = useState<string>('');
  const [forceLight, setForceLight] = useState<boolean>(false);
  const [usedFallback, setUsedFallback] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
              const res = await axios.post(`${apiBase}/api/controle-producao`, { page, pageSize, filters: { pn_principal: pnFilter || undefined, oc_it: ocFilter || undefined, op_cliente: opFilter || undefined }, light: forceLight });
        const payload = res.data;
        if (payload && Array.isArray(payload.rows)) {
          setRows(payload.rows);
          setTotal(payload.total || 0);
                setUsedFallback(!!payload.fallback);
        } else if (Array.isArray(payload)) {
          setRows(payload);
          setTotal(payload.length);
                setUsedFallback(false);
        } else {
          setRows([]);
          setTotal(0);
                setUsedFallback(false);
        }
      } catch (err: any) {
        console.error('Erro ao buscar controle de producao', err);
        const serverMsg = err?.response?.data?.details || err?.response?.data?.error;
        setError(serverMsg || err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiBase, page, pageSize]);

  if (loading) return <div>Carregando Controle de Produção...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!rows || rows.length === 0) return <div>Nenhum registro encontrado.</div>;

  const columns = Object.keys(rows[0]);

  return (
    <div className="controle-container">
      <h2>Controle de Produção</h2>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
        <label>PN: <input value={pnFilter} onChange={(e) => setPnFilter(e.target.value)} style={{marginRight: 8}} /></label>
        <label>OC/IT: <input value={ocFilter} onChange={(e) => setOcFilter(e.target.value)} style={{marginRight: 8}} /></label>
        <label>OP Cliente: <input value={opFilter} onChange={(e) => setOpFilter(e.target.value)} style={{marginRight: 8}} /></label>
        <button onClick={() => { setPage(1); /* effect will refetch */ }}>Buscar</button>
        <label style={{marginLeft: 12}}>
          <input type="checkbox" checked={forceLight} onChange={(e) => { setForceLight(e.target.checked); setPage(1); }} /> Forçar leve
        </label>
        {usedFallback && <span style={{marginLeft: 8, color: '#d35400'}}>Modo leve (fallback) ativo</span>}
      </div>
      <div style={{display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8}}>
        <div>Total: {total}</div>
        <div>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Anterior</button>
          <span style={{margin: '0 8px'}}>Página {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page * pageSize >= total}>Próxima</button>
        </div>
        <div>
          <label>Linhas: </label>
          <select value={pageSize} onChange={(e) => { setPageSize(parseInt(e.target.value,10)); setPage(1); }}>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>
      </div>
      <div className="table-wrap">
        <table className="controle-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col}>{r[col] !== null && r[col] !== undefined ? String(r[col]) : ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ControleProducao;
