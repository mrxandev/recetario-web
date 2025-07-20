import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Eye, EyeOff, Mail, Lock, UserPlus, ChefHat } from "lucide-react";

export default function Signup() {
  const { signup } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    
    const error = await signup(email, password);
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccess(true);
    }
    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4">
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
            <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl mb-4">
              <ChefHat className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">¡Cuenta creada!</h2>
            <p className="text-gray-400 mb-6">
              Revisa tu correo electrónico para confirmar tu cuenta
            </p>
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
            >
              Ir al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black flex items-center justify-center px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl mb-4">
            <ChefHat className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Únete a nosotros
          </h2>
          <p className="text-gray-400">
            Crea tu cuenta para guardar tus recetas favoritas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-gray-700">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-10 pr-12 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Debe tener al menos 6 caracteres
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-indigo-500/25 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Crear Cuenta
              </>
            )}
          </button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-400">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-200"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
