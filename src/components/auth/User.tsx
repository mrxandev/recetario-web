
import { useAuth } from '../../context/AuthContext';

export default function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-4 max-w-sm mx-auto">
      <p className="mb-2">Hola, {user.email}</p>
      <button onClick={logout} className="bg-red-600 text-white py-2 w-full">
        Cerrar sesión
      </button>
    </div>
  );
}
