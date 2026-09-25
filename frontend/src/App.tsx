import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Clientes from './pages/Clientes';
import Recepcion from './pages/Recepcion';
import Caja from './pages/Caja';
import Tracking from './pages/Tracking';
import Tarifas from './pages/Tarifas';
import Layout from './components/Layout';
import Despacho from './pages/Despacho';
import Trazabilidad from './pages/Trazabilidad';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas (Sin menú lateral y sin protección) */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Panel Principal y Tracking interno: Acceso para TODOS los empleados logueados */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
        } />
        <Route path="/tracking" element={
          <ProtectedRoute><Layout><Tracking /></Layout></ProtectedRoute>
        } />

        {/* MÓDULOS RESTRINGIDOS SEGÚN EL DOCUMENTO (HUs) */}
        
        {/* Solo Admin y Recepcionista */}
        <Route path="/clientes" element={
          <ProtectedRoute rolesPermitidos={['Administrador', 'Recepcionista']}>
            <Layout><Clientes /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/recepcion" element={
          <ProtectedRoute rolesPermitidos={['Administrador', 'Recepcionista']}>
            <Layout><Recepcion /></Layout>
          </ProtectedRoute>
        } />

        {/* Solo Admin y Cajero */}
        <Route path="/caja" element={
          <ProtectedRoute rolesPermitidos={['Administrador', 'Cajero']}>
            <Layout><Caja /></Layout>
          </ProtectedRoute>
        } />

        {/* Solo Admin y Despachante */}
        <Route path="/despacho" element={
          <ProtectedRoute rolesPermitidos={['Administrador', 'Despachante']}>
            <Layout><Despacho /></Layout>
          </ProtectedRoute>
        } />

        {/* Solo Administrador (Control Total y Auditoría) */}
        <Route path="/tarifas" element={
          <ProtectedRoute rolesPermitidos={['Administrador']}>
            <Layout><Tarifas /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/trazabilidad" element={
          <ProtectedRoute rolesPermitidos={['Administrador']}>
            <Layout><Trazabilidad /></Layout>
          </ProtectedRoute>
        } />

        {/* Redirección por defecto si el usuario ingresa una URL que no existe */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;