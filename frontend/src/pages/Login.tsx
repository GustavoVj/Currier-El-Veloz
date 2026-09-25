import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Lock, User } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem('nombre', response.data.nombre); // <-- AGREGAR ESTA LÍNEA
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.mensaje || 'Error al conectar con el servidor');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box' as const,
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
      
      {/* Contenedor del Formulario */}
      <div style={{ padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', width: '100%', maxWidth: '420px' }}>
        
        {/* Logo y Título */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', color: '#2563eb', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
            <Package size={36} />
          </div>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: 'bold' }}>Currier La Veloz</h2>
          <p style={{ margin: '8px 0 0 0', color: '#64748b', fontSize: '14px' }}>Portal de Gestión Logística</p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Usuario</label>
            <User size={18} color="#94a3b8" style={{ position: 'absolute', bottom: '13px', left: '12px' }} />
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              placeholder="Ingrese su usuario"
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#475569' }}>Contraseña</label>
            <Lock size={18} color="#94a3b8" style={{ position: 'absolute', bottom: '13px', left: '12px' }} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            style={{ marginTop: '10px', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
          >
            Iniciar Sesión
          </button>
        </form>

      </div>
    </div>
  );
}