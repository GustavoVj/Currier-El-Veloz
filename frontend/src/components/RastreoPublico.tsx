import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Search, Package, MapPin, CheckCircle, Truck } from 'lucide-react';

export default function RastreoPublico() {
  const [codigoBusqueda, setCodigoBusqueda] = useState('');
  const [datosGuia, setDatosGuia] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [buscando, setBuscando] = useState(false);

  const buscarGuia = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setDatosGuia(null);
    setBuscando(true);
    
    const codigoLimpio = codigoBusqueda.trim(); 

    try {
      // Reutilizamos la misma API robusta que ya construimos
      const res = await axios.get(`http://localhost:3001/api/tracking/${codigoLimpio}`);
      setDatosGuia(res.data);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.mensaje || 'No pudimos encontrar este código de guía. Por favor, verifíquelo.');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '28px', color: '#1e293b', marginBottom: '10px' }}>Rastrea tu Paquete</h2>
        <p style={{ color: '#64748b' }}>Ingresa tu código de guía corporativo para conocer el estado actual de tu envío en tiempo real.</p>
      </div>

      {/* Buscador */}
      <form onSubmit={buscarGuia} style={{ display: 'flex', gap: '10px', maxWidth: '600px', margin: '0 auto 30px auto' }}>
        <div style={{ position: 'relative', flexGrow: 1 }}>
          <div style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }}>
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Ej: VZ-2026-00001" 
            value={codigoBusqueda}
            onChange={(e) => setCodigoBusqueda(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '16px', boxSizing: 'border-box' }}
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={buscando}
          style={{ padding: '0 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: buscando ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s' }}
        >
          {buscando ? 'Buscando...' : 'Rastrear'}
        </button>
      </form>

      {/* Mensaje de Error */}
      {errorMsg && (
        <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '16px', borderRadius: '8px', textAlign: 'center', fontWeight: '500' }}>
          {errorMsg}
        </div>
      )}

      {/* Resultados de la Búsqueda */}
      {datosGuia && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          
          {/* Cabecera del Paquete */}
          <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748b', fontWeight: 'bold' }}>GUÍA ENCONTRADA</p>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '24px', color: '#0f172a' }}>{datosGuia.codigo_guia}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#166534', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px' }}>
              <Package size={18} />
              Estado Activo
            </div>
          </div>

          {/* Línea de Tiempo del Cliente */}
          <div style={{ padding: '30px 20px' }}>
            <div style={{ position: 'relative', borderLeft: '2px solid #e2e8f0', marginLeft: '12px', paddingLeft: '24px' }}>
              {datosGuia.movimientos.map((mov: any, index: number) => {
                const esUltimo = index === datosGuia.movimientos.length - 1;
                
                // Asignamos iconos visuales dependiendo del estado
                let Icono = MapPin;
                let colorIcono = '#94a3b8';
                
                if (mov.estado_movimiento.includes('Registrado')) { Icono = Package; colorIcono = '#3b82f6'; }
                if (mov.estado_movimiento.includes('Tránsito')) { Icono = Truck; colorIcono = '#eab308'; }
                if (mov.estado_movimiento.includes('Entregado')) { Icono = CheckCircle; colorIcono = '#16a34a'; }

                return (
                  <div key={index} style={{ position: 'relative', marginBottom: esUltimo ? '0' : '28px' }}>
                    {/* Círculo indicador */}
                    <div style={{ position: 'absolute', left: '-36px', top: '0', backgroundColor: 'white', padding: '4px', borderRadius: '50%' }}>
                      <Icono size={20} color={esUltimo ? colorIcono : '#cbd5e1'} />
                    </div>
                    
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: esUltimo ? '#0f172a' : '#475569' }}>
                        {mov.estado_movimiento}
                      </h4>
                      <div style={{ fontSize: '14px', color: '#64748b' }}>
                        {new Date(mov.fecha_hora).toLocaleString('es-BO', { 
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}