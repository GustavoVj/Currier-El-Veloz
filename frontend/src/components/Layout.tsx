import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wallet, 
  Truck, 
  LogOut,
  UserCircle,
  Settings,
  Activity
} from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const rol = localStorage.getItem('rol') || 'Usuario';
  
  // Manejo seguro del nombre extraído del login
  let nombre = localStorage.getItem('nombre');
  if (!nombre || nombre === 'undefined') {
    nombre = 'Empleado';
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('nombre'); // Limpiamos el nombre por seguridad
    navigate('/login');
  };

  const linkStyle = {
    display: 'flex', 
    alignItems: 'center', 
    gap: '12px', 
    padding: '12px 16px', 
    color: '#cbd5e1', 
    textDecoration: 'none', 
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", sans-serif', backgroundColor: '#f8fafc' }}>
      
      {/* Sidebar Corporativo */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1e293b' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#ffffff', letterSpacing: '0.5px' }}>
            LA VELOZ
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
            Sistema de Gestión Logística
          </p>
        </div>
        
        {/* Menú de Navegación Condicional */}
        {/* Menú de Navegación Condicional */}
        <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          <Link to="/dashboard" style={linkStyle}><LayoutDashboard size={20} /> Panel Principal</Link>
          
          {/* Módulos de Operación (Admin y Recepcionista) */}
          {(rol === 'Administrador' || rol === 'Recepcionista') && (
            <>
              <Link to="/clientes" style={linkStyle}><Users size={20} /> Gestión de Clientes</Link>
              <Link to="/recepcion" style={linkStyle}><Package size={20} /> Recepción</Link>
            </>
          )}

          {/* Módulos Financieros (Admin y Cajero) */}
          {(rol === 'Administrador' || rol === 'Cajero') && (
            <Link to="/caja" style={linkStyle}><Wallet size={20} /> Caja y Cobros</Link>
          )}

          {/* Módulos Públicos/Generales (Todos) */}
          <Link to="/tracking" style={linkStyle}><Truck size={20} /> Seguimiento</Link>

          {/* Módulo Exclusivo Administrador */}
          {rol === 'Administrador' && (
            <Link to="/tarifas" style={linkStyle}><Settings size={20} /> Matriz de Tarifas</Link>
          )}

          {/* Módulos de Despacho (Admin y Despachante) */}
          {(rol === 'Administrador' || rol === 'Despachante') && (
            <Link to="/despacho" style={linkStyle}><Package size={20} /> Despachos</Link>
          )}

          {/* Módulo Exclusivo Administrador - Auditoría */}
          {rol === 'Administrador' && (
            <Link to="/trazabilidad" style={linkStyle}><Activity size={20} /> Trazabilidad</Link>
          )}
        </nav>

        {/* Sección de Usuario */}
        <div style={{ padding: '20px', borderTop: '1px solid #1e293b', backgroundColor: '#0b1120' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#f8fafc' }}>
            <UserCircle size={32} color="#94a3b8" />
            <div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{nombre}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>{rol}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
          >
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </div>
    </div>
  );
}