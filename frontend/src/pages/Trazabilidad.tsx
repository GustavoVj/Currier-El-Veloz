import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';
import { Activity, Search, Calendar, Filter } from 'lucide-react';

export default function Trazabilidad() {
  const [movimientos, setMovimientos] = useState([]);
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    codigo_guia: ''
  });

  const cargarReporte = async (parametros = {}) => {
    try {
      const res = await axios.get('http://localhost:3001/api/trazabilidad/reporte', { params: parametros });
      setMovimientos(res.data);
    } catch (error) {
      console.error('Error al cargar la trazabilidad');
    }
  };

  // Cargar los últimos 200 movimientos al entrar a la pantalla
  useEffect(() => {
    cargarReporte();
  }, []);

  const aplicarFiltros = (e: FormEvent) => {
    e.preventDefault();
    cargarReporte(filtros);
  };

  const limpiarFiltros = () => {
    setFiltros({ fechaInicio: '', fechaFin: '', codigo_guia: '' });
    cargarReporte();
  };

  const inputStyle = { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={28} /> Reporte Global de Trazabilidad
      </h2>

      {/* Panel de Filtros */}
      <form onSubmit={aplicarFiltros} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            <Calendar size={16} /> Fecha Inicio
          </label>
          <input type="date" style={inputStyle} value={filtros.fechaInicio} onChange={e => setFiltros({...filtros, fechaInicio: e.target.value})} />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            <Calendar size={16} /> Fecha Fin
          </label>
          <input type="date" style={inputStyle} value={filtros.fechaFin} onChange={e => setFiltros({...filtros, fechaFin: e.target.value})} />
        </div>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>
            <Search size={16} /> Buscar por Guía
          </label>
          <input type="text" placeholder="Ej: VZ-2026-00012" style={inputStyle} value={filtros.codigo_guia} onChange={e => setFiltros({...filtros, codigo_guia: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={18} /> Filtrar
          </button>
          <button type="button" onClick={limpiarFiltros} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
            Limpiar
          </button>
        </div>
      </form>

      {/* Tabla de Auditoría */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#475569' }}>Fecha y Hora</th>
              <th style={{ padding: '16px', color: '#475569' }}>Guía</th>
              <th style={{ padding: '16px', color: '#475569' }}>Hito Logístico</th>
              <th style={{ padding: '16px', color: '#475569' }}>Operario Responsable</th>
              <th style={{ padding: '16px', color: '#475569' }}>Ruta (Remitente a Destinatario)</th>
            </tr>
          </thead>
          <tbody>
            {movimientos.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No se encontraron registros en este periodo.</td></tr>
            ) : (
              movimientos.map((m: any) => (
                <tr key={m.id_movimiento} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(m.fecha_hora).toLocaleString()}
                  </td>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#0f172a' }}>{m.codigo_guia}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                      backgroundColor: m.estado_movimiento.includes('Entregado') ? '#dcfce7' : '#f1f5f9',
                      color: m.estado_movimiento.includes('Entregado') ? '#166534' : '#334155'
                    }}>
                      {m.estado_movimiento}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontWeight: '500' }}>{m.empleado}</td>
                  <td style={{ padding: '16px', color: '#475569', fontSize: '13px' }}>
                    {m.remitente} ➔ {m.destinatario}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}