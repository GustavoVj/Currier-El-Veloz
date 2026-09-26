import { useState, useEffect, type FormEvent } from 'react';
import axios from 'axios';

export default function Tarifas() {
  // 1. Todos los estados siempre adentro del componente
  const [datos, setDatos] = useState({ ciudades: [], formasEnvio: [], tiposEncomienda: [], tarifas: [] });
  const [formulario, setFormulario] = useState({
    id_origen: '', id_destino: '', id_forma_envio: '', id_tipo_encomienda: '', precio_base_kilo: '', fecha_vigencia: '', fecha_fin_vigencia: '', estado: 'Activo'
  });
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const cargarDatos = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/tarifas');
      setDatos(response.data);
    } catch (error) {
      console.error('Error al cargar datos');
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // 2. Función de edición reubicada adentro para tener acceso a setFormulario
  const cargarParaEdicion = (tarifa: any) => {
    try {
      setFormulario({
        // Verificamos que el ID exista antes de hacer toString()
        id_origen: tarifa.id_origen ? tarifa.id_origen.toString() : '',
        id_destino: tarifa.id_destino ? tarifa.id_destino.toString() : '',
        id_forma_envio: tarifa.id_forma_envio ? tarifa.id_forma_envio.toString() : '',
        id_tipo_encomienda: tarifa.id_tipo_encomienda ? tarifa.id_tipo_encomienda.toString() : '',
        precio_base_kilo: tarifa.precio_base_kilo || '',
        
        // Verificamos que las fechas existan antes de cortarlas con split
        fecha_vigencia: tarifa.fecha_vigencia ? tarifa.fecha_vigencia.split('T')[0] : '',
        fecha_fin_vigencia: tarifa.fecha_fin_vigencia ? tarifa.fecha_fin_vigencia.split('T')[0] : '',
        estado: tarifa.estado || 'Activo'
      });
      setIdEditando(tarifa.id_tarifa);
    } catch (error) {
      console.error("Error al cargar los datos para edición:", error);
      alert("No se pudieron cargar todos los datos de esta tarifa. Revisa la consola.");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formulario.id_origen === formulario.id_destino) {
      alert('El origen y destino no pueden ser la misma ciudad');
      return;
    }

    try {
      if (idEditando) {
        await axios.put(`http://localhost:3001/api/tarifas/${idEditando}`, formulario);
        alert('Tarifa actualizada exitosamente');
      } else {
        await axios.post('http://localhost:3001/api/tarifas', formulario);
        alert('Tarifa registrada exitosamente');
      }

      // Limpiamos todo
      setFormulario({ id_origen: '', id_destino: '', id_forma_envio: '', id_tipo_encomienda: '', precio_base_kilo: '', fecha_vigencia: '', fecha_fin_vigencia: '', estado: 'Activo' });
      setIdEditando(null);
      cargarDatos();
    } catch (error) {
      alert('Error al procesar la tarifa');
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
            <select style={inputStyle} required value={formulario.id_origen} onChange={e => setFormulario({ ...formulario, id_origen: e.target.value })}>
              <option value="">Seleccione...</option>
              {datos.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Destino</label>
            <select style={inputStyle} required value={formulario.id_destino} onChange={e => setFormulario({ ...formulario, id_destino: e.target.value })}>
              <option value="">Seleccione...</option>
              {datos.ciudades.map((c: any) => <option key={c.id_ciudad} value={c.id_ciudad}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Forma de Envío</label>
            <select style={inputStyle} required value={formulario.id_forma_envio} onChange={e => setFormulario({ ...formulario, id_forma_envio: e.target.value })}>
              <option value="">Seleccione...</option>
              {datos.formasEnvio.map((f: any) => <option key={f.id_forma_envio} value={f.id_forma_envio}>{f.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Tipo</label>
            <select style={inputStyle} required value={formulario.id_tipo_encomienda} onChange={e => setFormulario({ ...formulario, id_tipo_encomienda: e.target.value })}>
              <option value="">Seleccione...</option>
              {datos.tiposEncomienda.map((t: any) => <option key={t.id_tipo_encomienda} value={t.id_tipo_encomienda}>{t.nombre}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Precio por Kilo (Bs.)</label>
            <input type="number" step="0.10" required style={inputStyle} value={formulario.precio_base_kilo} onChange={e => setFormulario({ ...formulario, precio_base_kilo: e.target.value })} placeholder="Ej: 15.50" />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Inicio de Vigencia</label>
            <input type="date" required style={inputStyle} value={formulario.fecha_vigencia} onChange={e => setFormulario({ ...formulario, fecha_vigencia: e.target.value })} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500' }}>Fin de Vigencia (Opcional)</label>
            <input type="date" style={inputStyle} value={formulario.fecha_fin_vigencia} onChange={e => setFormulario({ ...formulario, fecha_fin_vigencia: e.target.value })} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Estado</label>
            <select style={inputStyle} required value={formulario.estado} onChange={e => setFormulario({ ...formulario, estado: e.target.value })}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          {/* Botón dinámico */}
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: idEditando ? '#eab308' : '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', height: '42px', width: '100%' }}>
            {idEditando ? 'Actualizar Tarifa' : 'Registrar Tarifa'}
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
              <th style={{ padding: '12px 16px', color: '#475569', textAlign: 'center' }}>Acciones</th>
              <th style={{ padding: '12px 16px', color: '#475569' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {datos.tarifas.map((t: any) => (
              <tr key={t.id_tarifa} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px 16px' }}><strong>{t.origen}</strong> a <strong>{t.destino}</strong></td>
                <td style={{ padding: '12px 16px' }}>{t.forma_envio} - {t.tipo_encomienda}</td>
                <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#16a34a' }}>Bs. {t.precio_base_kilo}</td>
                <td style={{ padding: '16px', textAlign: 'center' }}>
                  Desde: {new Date(t.fecha_vigencia).toLocaleDateString('es-BO')} <br />
                  {t.fecha_fin_vigencia ? `Hasta: ${new Date(t.fecha_fin_vigencia).toLocaleDateString('es-BO')}` : 'Indefinida'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <button
                    onClick={() => cargarParaEdicion(t)}
                    style={{ padding: '6px 12px', backgroundColor: '#eab308', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Editar
                  </button>
                </td>
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