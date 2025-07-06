import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const error = await login(email, password);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg(null);
      navigate("/")

    }
  };

  return (
    <>
      <div className="w-[90%] h-screen flex justify-center items-center ">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 ">
          <h2 className="text-2xl mb-4">Login</h2>
          {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          <input
            type="email"
            placeholder="Email"
            className="border p-2 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="border p-2 mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white py-2 w-full">Acceder</button>

          <div className="flex gap-2 mt-4">
            <p className=''>¿Necesitas una cuenta? |</p>
            <a href="/signup">Registar</a>
          </div>
        </form>
      </div>
    </>
  );
}
