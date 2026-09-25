import { useState, useEffect } from 'react';
import { Users, PackageCheck, TrendingUp } from 'lucide-react';
import axios from 'axios';

export default function Dashboard() {
  const rol = localStorage.getItem('rol') || 'Usuario';
  
  // Estado para guardar los datos reales de la base de datos
  const [stats, setStats] = useState({
    clientesAtendidos: 0,
    encomiendasHoy: 0,
    enTransito: 0
  });

  // useEffect se ejecuta automáticamente al cargar la pantalla
  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar las estadísticas", error);
      }
    };

    cargarEstadisticas();
  }, []);

  const cardStyle = {
    backgroundColor: '#ffffff', padding: '24px', borderRadius: '12px',
    border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex', alignItems: 'center', gap: '20px'
  };

  const iconWrapperStyle = (bgColor: string, color: string) => ({
    backgroundColor: bgColor, color: color, padding: '16px', 
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
  });

  return (
    <>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#0f172a', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
          Resumen de Operaciones
        </h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>
          Bienvenido de nuevo, {rol}. Estos son los datos actualizados en tiempo real.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Tarjeta 1: Clientes Reales */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle('#dbeafe', '#2563eb')}>
            <Users size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Clientes Atendidos</p>
            <p style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>
              {stats.clientesAtendidos}
            </p>
          </div>
        </div>
        
        {/* Tarjeta 2: Encomiendas Reales */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle('#dcfce7', '#16a34a')}>
            <PackageCheck size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Total Encomiendas</p>
            <p style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>
              {stats.encomiendasHoy}
            </p>
          </div>
        </div>

        {/* Tarjeta 3: En Tránsito (Pagadas) Reales */}
        <div style={cardStyle}>
          <div style={iconWrapperStyle('#fef3c7', '#d97706')}>
            <TrendingUp size={28} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '14px', fontWeight: '600' }}>Listas para Despacho</p>
            <p style={{ margin: 0, color: '#0f172a', fontSize: '28px', fontWeight: '700' }}>
              {stats.enTransito}
            </p>
          </div>
        </div>

      </div>
    </>
  );
}