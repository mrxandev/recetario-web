import  { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const error = await signup(email, password);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg(null);
 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <h2 className="text-2xl mb-4">Registro</h2>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <input
        type="email"
        placeholder="Email"
        className="border p-2 mb-2 w-full"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2 mb-2 w-full"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="bg-green-600 text-white py-2 w-full">Registrarse</button>
    </form>
  );
}
