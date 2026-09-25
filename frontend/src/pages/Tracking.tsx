import { useState } from 'react';
import axios from 'axios';
import { Search, Truck, MapPin, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function Tracking() {
  const [codigoGuia, setCodigoGuia] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState('');

  const buscarHistorial = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResultado(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/tracking/${codigoGuia}`);
      setResultado(response.data);
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al buscar el historial de la encomienda.');
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Seguimiento de Encomiendas</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Consulte el historial detallado y la ubicación actual de cualquier envío.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px', alignItems: 'start' }}>
        
        {/* Buscador */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0f172a' }}>
            <Search size={24} color="#2563eb" />
            <h2 style={{ margin: 0, fontSize: '18px' }}>Rastrear Paquete</h2>
          </div>
          
          <form onSubmit={buscarHistorial} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '6px' }}>Código de Guía</label>
              <input 
                type="text" 
                placeholder="Ej: VZ-2026-17063" 
                value={codigoGuia}
                onChange={(e) => setCodigoGuia(e.target.value)}
                required
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              Buscar Historial
            </button>
          </form>

          {error && (
            <div style={{ marginTop: '20px', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
              <AlertCircle size={20} />
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{error}</span>
            </div>
          )}
        </div>

        {/* Línea de Tiempo (Resultados) */}
        {resultado && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>GUÍA ENCONTRADA</p>
                <h3 style={{ margin: 0, fontSize: '20px', color: '#0f172a' }}>{resultado.codigo_guia}</h3>
              </div>
              <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Estado Activo
              </div>
            </div>

            {/* CONTENEDOR DE LA LÍNEA DE TIEMPO CORREGIDO */}
            <div style={{ position: 'relative', marginTop: '10px' }}>
              {resultado.movimientos.map((mov: any, index: number) => (
                <div key={index} style={{ position: 'relative', paddingLeft: '44px', paddingBottom: index === resultado.movimientos.length - 1 ? '0' : '32px' }}>
                  
                  {/* Línea conectora central (ahora en left: 13px) */}
                  {index !== resultado.movimientos.length - 1 && (
                    <div style={{ position: 'absolute', left: '13px', top: '28px', bottom: '0', width: '2px', backgroundColor: '#e2e8f0' }}></div>
                  )}
                  
                  {/* Punto Icono (ahora en left: 0) */}
                  <div style={{ position: 'absolute', left: '0', top: '-2px', backgroundColor: index === 0 ? '#2563eb' : '#cbd5e1', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '4px solid white', boxShadow: '0 0 0 1px #e2e8f0', zIndex: 1 }}>
                    {index === 0 ? <Truck size={12} /> : <MapPin size={12} />}
                  </div>

                  {/* Contenido del texto (ahora respetando el paddingLeft de 44px) */}
                  <div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: index === 0 ? '#0f172a' : '#475569', fontWeight: index === 0 ? '700' : '500' }}>
                      {mov.estado_movimiento}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '13px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> 
                        {new Date(mov.fecha_hora).toLocaleString('es-BO')}
                      </span>
                      <span>Registrado por: <strong>{mov.registrado_por}</strong></span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}