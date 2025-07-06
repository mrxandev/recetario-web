import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const error = await signup(email, password);
    if (error) {
      setErrorMsg(error.message);
    } else {
      setErrorMsg(null);
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex flex-col p-4 justify-center items-center">
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-2xl mb-4 text-center font-bold">
              Crear Cuenta
            </h2>
            <p className="text-center font-semibold text-gray-300">
              Completa los datos para registrarte en nuestra plataforma
            </p>
          </div>
          <div className="mb-4">
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}
          </div>

          <div className="mb-4">
          <label htmlFor="email" className="block mb-2 font-semibold">
            Correo Electrónico
          </label>
          <input
            type="email"
            placeholder="example@email.com"
            className="border p-2 mb-4 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password" className="block mb-2 font-semibold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Contraseña"
            className="border p-2 mb-4 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 w-full cursor-pointer hover:bg-blue-800 transition-colors duration-300">
            Registrarse
          </button>

          <div className="flex gap-2 mt-4 justify-center text-gray-600 font-semibold">
            <p className="">¿Ya tienes una cuenta? |</p>
            <a href="/login" className="hover:underline">
              Iniciar sesión
            </a>
          </div>
        </form>
      </div>
    </>
  );
}
