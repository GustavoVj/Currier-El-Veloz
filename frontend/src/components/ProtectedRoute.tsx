import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface Props {
  children: ReactNode; // Usamos ReactNode en lugar de JSX.Element
  rolesPermitidos?: string[]; 
}

export default function ProtectedRoute({ children, rolesPermitidos }: Props) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // 1. Si no hay token, lo mandamos al Login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // 2. Si la ruta tiene restricciones de rol, verificamos que el usuario cumpla
  if (rolesPermitidos && rol && !rolesPermitidos.includes(rol)) {
    // Si intenta entrar a una URL prohibida para su rol, lo devolvemos al Panel Principal
    return <Navigate to="/dashboard" />;
  }

  // 3. Si pasa ambas pruebas, renderizamos la pantalla
  return <>{children}</>;
}