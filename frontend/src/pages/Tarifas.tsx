import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';

export default function Tarifas() {
  const [datos, setDatos] = useState({ ciudades: [], formasEnvio: [], tiposEncomienda: [], tarifas: [] });
  const [formulario, setFormulario] = useState({
    id_origen: '', id_destino: '', id_forma_envio: '', id_tipo_encomienda: '', precio_base_kilo: '', fecha_vigencia: '', estado: 'Activo'
  });

  const cargarDatos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tarifas');
      setDatos(response.data);
    } catch (error) {
      console.error('Error al cargar datos');
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formulario.id_origen === formulario.id_destino) {
      alert('El origen y destino no pueden ser la misma ciudad');
      return;
    }
    
    try {
      await axios.post('http://localhost:3001/api/tarifas', formulario);
      alert('Tarifa registrada exitosamente');
      setFormulario({ id_origen: '', id_destino: '', id_forma_envio: '', id_tipo_encomienda: '', precio_base_kilo: '', fecha_vigencia: '', estado: 'Activo' });
      cargarDatos(); 
    } catch (error) {
      alert('Error al registrar la tarifa');
    }
  };

  const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%', boxSizing: 'border-box' as const };

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Gestión de Tarifas (Matriz)</h2>
      
      <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Origen</label>
            <select style={inputStyle} required value={formulario.id_origen} onChange={e => setFormulario({...formulario, id_origen: e.target.value})}>
              <option value="">Seleccione...</option>
              {datos.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Destino</label>
            <select style={inputStyle} required value={formulario.id_destino} onChange={e => setFormulario({...formulario, id_destino: e.target.value})}>
              <option value="">Seleccione...</option>
              {datos.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Forma de Envío</label>
            <select style={inputStyle} required value={formulario.id_forma_envio} onChange={e => setFormulario({...formulario, id_forma_envio: e.target.value})}>
              <option value="">Seleccione...</option>
              {datos.formasEnvio.map((f: any) => <option key={f.id_forma_envio} value={f.id_forma_envio}>{f.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipo</label>
            <select style={inputStyle} required value={formulario.id_tipo_encomienda} onChange={e => setFormulario({...formulario, id_tipo_encomienda: e.target.value})}>
              <option value="">Seleccione...</option>
              {datos.tiposEncomienda.map((t: any) => <option key={t.id_tipo_encomienda} value={t.id_tipo_encomienda}>{t.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Precio por Kilo (Bs.)</label>
            <input type="number" step="0.10" required style={inputStyle} value={formulario.precio_base_kilo} onChange={e => setFormulario({...formulario, precio_base_kilo: e.target.value})} placeholder="Ej: 15.50" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Inicio de Vigencia</label>
            <input type="date" required style={inputStyle} value={formulario.fecha_vigencia} onChange={e => setFormulario({...formulario, fecha_vigencia: e.target.value})} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Estado</label>
            <select style={inputStyle} required value={formulario.estado} onChange={e => setFormulario({...formulario, estado: e.target.value})}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px', width: '100%' }}>
            Registrar Tarifa
          </button>
        </form>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Ruta</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Modalidad</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Precio Base</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Vigencia</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.tarifas.map((t: any) => (
              <tr key={t.id_tarifa} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px' }}><strong>{t.origen}</strong> a <strong>{t.destino}</strong></td>
                <td style={{ padding: '12px 16px' }}>{t.forma_envio} - {t.tipo_encomienda}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#16a34a' }}>Bs. {t.precio_base_kilo}</td>
                <td style={{ padding: '12px 16px' }}>{new Date(t.fecha_vigencia).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: t.estado === 'Activo' ? '#dcfce7' : '#fee2e2',
                    color: t.estado === 'Activo' ? '#166534' : '#991b1b'
                  }}>
                    {t.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}