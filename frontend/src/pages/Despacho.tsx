import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Truck, ShieldAlert, CheckCircle, Search } from 'lucide-react';

export default function Despacho() {
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [datosGuia, setDatosGuia] = useState<any>(null);
  const [nuevoEstado, setNuevoEstado] = useState('En Tránsito');
  const [ciVerificacion, setCiVerificacion] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [exitoMsg, setExitoMsg] = useState('');

  const buscarGuia = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setExitoMsg('');
    try {
      const res = await axios.get(`http://localhost:3001/api/tracking/${codigoBusqueda}`);
      setDatosGuia(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.mensaje || 'Guía no encontrada');
      setDatosGuia(null);
    }
  };

  const ejecutarActualizacion = async () => {
    setErrorMsg('');
    setExitoMsg('');
    try {
      const payload = {
        id_encomienda: datosGuia.encomienda.id_encomienda,
        nuevo_estado: nuevoEstado,
        id_empleado: 2, // Ajustar según el ID del empleado despachante en sesión
        ci_destinatario_verificacion: ciVerificacion
      };

      const res = await axios.post('http://localhost:3001/api/tracking/actualizar', payload);
      setExitoMsg(res.data.mensaje);
      // Recargar datos actualizados
      const actualizado = await axios.get(`http://localhost:3001/api/tracking/${codigoBusqueda}`);
      setDatosGuia(actualizado.data);
      setCiVerificacion('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.mensaje || 'Error al actualizar el estado');
    }
  };

  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Truck size={28} /> Control de Estados y Despachos
      </h2>

      {/* Buscador de Guía */}
      <form onSubmit={buscarGuia} style={{ display: 'flex', gap: '12px', marginBottom: '24px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <input 
          type="text" 
          style={inputStyle} 
          placeholder="Ingrese Código de Guía (Ej: VZ-2026-00001)" 
          value={codigoBusqueda} 
          onChange={e => setCodigoBusqueda(e.target.value)} 
          required 
        />
        <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Search size={18} /> Buscar
        </button>
      </form>

      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={20} /> {errorMsg}
        </div>
      )}

      {exitoMsg && (
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> {exitoMsg}
        </div>
      )}

      {/* Panel de Gestión de la Guía Encontrada */}
      {datosGuia && (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>Guía: {datosGuia.encomienda.codigo_guia}</h3>
              <p style={{ margin: '4px 0 0 0', color: '#64748b' }}>Modalidad: <strong>{datosGuia.encomienda.modalidad_pago}</strong> | Estado Pago: <strong style={{ color: datosGuia.encomienda.estado_pago === 'Pagado' ? '#16a34a' : '#dc2626' }}>{datosGuia.encomienda.estado_pago || 'Pendiente'}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
                Estado Actual: {datosGuia.encomienda.estado}
              </span>
            </div>
          </div>

          {/* Selector de Nuevo Estado */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#334155' }}>Actualizar Hito Logístico</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Seleccionar Siguiente Estado</label>
                <select style={inputStyle} value={nuevoEstado} onChange={e => setNuevoEstado(e.target.value)}>
                  <option value="En Tránsito">En Tránsito (Salida)</option>
                  <option value="Llegada a Destino">Llegada a Destino</option>
                  <option value="Entregado">Entregado al Cliente Final</option>
                </select>
              </div>

              {nuevoEstado === 'Entregado' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Verificar CI Destinatario ({datosGuia.encomienda.destinatario})</label>
                  <input 
                    type="text" 
                    style={inputStyle} 
                    placeholder="Ingrese CI físico del receptor" 
                    value={ciVerificacion} 
                    onChange={e => setCiVerificacion(e.target.value)} 
                  />
                </div>
              )}
            </div>

            <button type="button" onClick={ejecutarActualizacion} style={{ padding: '12px 24px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Confirmar y Registrar Hito
            </button>
          </div>

          {/* Historial de Movimientos (Línea de tiempo) */}
          <h4 style={{ margin: '0 0 12px 0', color: '#334155' }}>Trazabilidad Histórica</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {datosGuia.historial.map((h: any, index: number) => (
              <li key={index} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {/* Aquí cambiamos h.estado por h.estado_movimiento */}
                  <strong style={{ color: '#0f172a' }}>{h.estado_movimiento}</strong>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Operario: {h.empleado}</div>
                </div>
                <div style={{ fontSize: '13px', color: '#475569' }}>
                  {new Date(h.fecha_hora).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}