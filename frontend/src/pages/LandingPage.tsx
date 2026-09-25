import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Truck, Package, MapPin } from 'lucide-react';

export default function LandingPage() {
  const [tarifas, setTarifas] = useState([]);

  useEffect(() => {
    const cargarTarifasPublicas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/tarifas');
        setTarifas(response.data.tarifas);
      } catch (error) {
        console.error('Error al cargar tarifas referenciales');
      }
    };
    cargarTarifasPublicas();
  }, []);

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Barra de Navegación Pública */}
      <nav style={{ backgroundColor: '#0f172a', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'white' }}>
          <Truck size={32} color="#3b82f6" />
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', letterSpacing: '1px' }}>LA VELOZ</h1>
        </div>
        <div>
          <Link to="/tracking" style={{ color: '#cbd5e1', textDecoration: 'none', marginRight: '24px', fontWeight: '500' }}>Rastrear Paquete</Link>
          <Link to="/login" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Acceso Empleados</Link>
        </div>
      </nav>

      {/* Sección Hero */}
      <header style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#1e293b', color: 'white' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '16px' }}>Envíos seguros a todo el país</h2>
        <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '600px', margin: '0 auto' }}>
          Consulta nuestras tarifas referenciales. Transparencia y velocidad en cada entrega.
        </p>
      </header>

      {/* Tabla de Tarifas Públicas */}
      <main style={{ padding: '60px 40px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: '#0f172a' }}>
          <MapPin size={28} />
          <h3 style={{ fontSize: '24px', margin: 0 }}>Tarifas Referenciales por Kilo</h3>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', color: '#475569' }}>Origen</th>
                <th style={{ padding: '16px', color: '#475569' }}>Destino</th>
                <th style={{ padding: '16px', color: '#475569' }}>Modalidad</th>
                <th style={{ padding: '16px', color: '#475569' }}>Costo Base</th>
              </tr>
            </thead>
            <tbody>
              {tarifas.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center' }}>Cargando tarifas...</td></tr>
              ) : (
                tarifas.map((t: any) => (
                  <tr key={t.id_tarifa} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{t.origen}</td>
                    <td style={{ padding: '16px', fontWeight: '500' }}>{t.destino}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={16} color="#64748b" /> {t.forma_envio} - {t.tipo_encomienda}
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: '#16a34a', fontSize: '16px' }}>
                      Bs. {t.precio_base_kilo}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}