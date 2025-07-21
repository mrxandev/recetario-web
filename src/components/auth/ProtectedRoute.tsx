import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Si está cargando, muestra un spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500"></div>
          <p className="text-gray-400 text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario, redirige al login guardando la ubicación actual
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay usuario, muestra el contenido
  return <>{children}</>;
}
