import { useState } from 'react';
import axios from 'axios';
import { Search, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Clientes() {
  const [ciBuscador, setCiBuscador] = useState('');
  const [cliente, setCliente] = useState<any>(null);
  
  // Estados para el formulario de nuevo cliente
  const [ciNuevo, setCiNuevo] = useState('');
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [telefonoNuevo, setTelefonoNuevo] = useState('');
  
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Función para buscar cliente por CI
  const buscarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });
    
    try {
      const response = await axios.get(`http://localhost:3001/api/clientes/${ciBuscador}`);
      setCliente(response.data.cliente);
      setMensaje({ texto: 'Cliente encontrado exitosamente.', tipo: 'exito' });
    } catch (error: any) {
      setCliente(null);
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al buscar cliente', 
        tipo: 'error' 
      });
    }
  };

  // Función para registrar nuevo cliente
  const registrarCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ texto: '', tipo: '' });

    try {
      await axios.post('http://localhost:3001/api/clientes', {
        ci: ciNuevo,
        nombre_completo: nombreNuevo,
        telefono: telefonoNuevo
      });
      
      setMensaje({ texto: 'Cliente registrado exitosamente.', tipo: 'exito' });
      // Limpiar formulario
      setCiNuevo(''); setNombreNuevo(''); setTelefonoNuevo('');
    } catch (error: any) {
      setMensaje({ 
        texto: error.response?.data?.mensaje || 'Error al registrar cliente', 
        tipo: 'error' 
      });
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  };

  const inputStyle = {
    width: '100%', padding: '10px 12px', borderRadius: '6px', 
    border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box' as const,
    marginTop: '6px'
  };

  // AQUÍ QUITAMOS EL <Layout> QUE ENVOLVÍA TODO
  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Gestión de Clientes</h1>
        <p style={{ color: '#64748b', margin: 0 }}>Busque clientes existentes o registre nuevos remitentes/destinatarios.</p>
      </div>

      {/* Alertas de Mensajes */}
      {mensaje.texto && (
        <div style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: mensaje.tipo === 'exito' ? '#dcfce7' : '#fef2f2',
          color: mensaje.tipo === 'exito' ? '#16a34a' : '#dc2626',
          border: `1px solid ${mensaje.tipo === 'exito' ? '#bbf7d0' : '#fecaca'}`
        }}>
          {mensaje.tipo === 'exito' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: '500' }}>{mensaje.texto}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* Panel Izquierdo: Buscador */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#0f172a' }}>
            <Search size={24} color="#2563eb" />
            <h2 style={{ margin: 0, fontSize: '18px' }}>Buscar Cliente</h2>
          </div>
          
          <form onSubmit={buscarCliente} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Ingrese el Carnet de Identidad" 
              value={ciBuscador}
              onChange={(e) => setCiBuscador(e.target.value)}
              required
              style={{ ...inputStyle, marginTop: 0, flexGrow: 1 }}
            />
            <button type="submit" style={{ padding: '0 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Buscar
            </button>
          </form>

          {/* Resultado de la Búsqueda */}
          {cliente && (
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '13px' }}>RESULTADO:</p>
              <p style={{ margin: '0 0 4px 0', color: '#0f172a', fontWeight: 'bold' }}>{cliente.nombre_completo}</p>
              <p style={{ margin: '0 0 4px 0', color: '#475569', fontSize: '14px' }}>CI: {cliente.ci}</p>
              <p style={{ margin: 0, color: '#475569', fontSize: '14px' }}>Teléfono: {cliente.telefono}</p>
            </div>
          )}
        </div>

        {/* Panel Derecho: Registro Nuevo */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', color: '#0f172a' }}>
            <UserPlus size={24} color="#10b981" />
            <h2 style={{ margin: 0, fontSize: '18px' }}>Registrar Nuevo</h2>
          </div>

          <form onSubmit={registrarCliente} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Carnet de Identidad</label>
              <input type="text" value={ciNuevo} onChange={(e) => setCiNuevo(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Nombre Completo</label>
              <input type="text" value={nombreNuevo} onChange={(e) => setNombreNuevo(e.target.value)} required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Teléfono / Celular</label>
              <input type="text" value={telefonoNuevo} onChange={(e) => setTelefonoNuevo(e.target.value)} required style={inputStyle} />
            </div>
            
            <button type="submit" style={{ marginTop: '8px', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
              Guardar Cliente
            </button>
          </form>
        </div>

      </div>
    </>
  );
}