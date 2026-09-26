import { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export default function Caja() {
  const [pendientes, setPendientes] = useState([]);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const cargarBandeja = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/caja/pendientes');
      setPendientes(res.data);
    } catch (error) {
      console.error('Error al cargar pendientes');
    }
  };

  useEffect(() => {
    cargarBandeja();
  }, []);

  const procesarCobro = async (id_encomienda: number, guia: string, monto_total: number) => {
    const confirmar = window.confirm(`¿Confirmas la recepción de Bs. ${monto_total} para la guía ${guia}?`);
    if (!confirmar) return;

    try {
      const res = await axios.post('http://localhost:3001/api/caja/cobrar', {
        id_encomienda: id_encomienda,
        id_empleado_cajero: localStorage.getItem('id_empleado') || '1',
        monto_cobrado: monto_total // <-- AHORA SÍ ENVIAMOS EL DINERO AL BACKEND
      });
      setMensaje({ texto: res.data.mensaje, tipo: 'exito' });
      cargarBandeja(); 
      
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    } catch (error: any) {
      setMensaje({ texto: error.response?.data?.mensaje || 'Error al cobrar', tipo: 'error' });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Wallet size={28} /> Módulo de Caja - Consolidación de Pagos
      </h2>

      {mensaje.texto && (
        <div style={{ 
          backgroundColor: mensaje.tipo === 'exito' ? '#dcfce7' : '#fee2e2', 
          border: `1px solid ${mensaje.tipo === 'exito' ? '#86efac' : '#fca5a5'}`, 
          color: mensaje.tipo === 'exito' ? '#166534' : '#991b1b', 
          padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' 
        }}>
          {mensaje.tipo === 'exito' ? <CheckCircle size={20} /> : <AlertCircle size={20} />} 
          {mensaje.texto}
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '16px', color: '#475569' }}>Código de Guía</th>
              <th style={{ padding: '16px', color: '#475569' }}>Clientes</th>
              <th style={{ padding: '16px', color: '#475569' }}>Modalidad</th>
              <th style={{ padding: '16px', color: '#475569', textAlign: 'right' }}>Monto a Cobrar</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {pendientes.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>No hay pagos pendientes en bandeja.</td></tr>
            ) : (
              pendientes.map((p: any) => (
                <tr key={p.id_encomienda} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '16px', fontWeight: 'bold', color: '#1e293b' }}>{p.codigo_guia}</td>
                  <td style={{ padding: '16px', fontSize: '14px' }}>
                    <div style={{ color: '#64748b' }}>De: {p.remitente}</div>
                    <div style={{ color: '#0f172a' }}>Para: {p.destinatario}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: '500',
                      backgroundColor: p.modalidad_pago.includes('Destino') ? '#fef3c7' : '#e0f2fe',
                      color: p.modalidad_pago.includes('Destino') ? '#b45309' : '#0369a1'
                    }}>
                      {p.modalidad_pago}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right', fontWeight: 'bold', color: '#16a34a', fontSize: '16px' }}>
                    Bs. {p.monto_total}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <button 
                      onClick={() => procesarCobro(p.id_encomienda, p.codigo_guia, p.monto_total)}
                      style={{ padding: '8px 16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Wallet size={16} /> Cobrar
                    </button>
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