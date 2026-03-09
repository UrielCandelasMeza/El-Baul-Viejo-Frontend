import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";

function LoginPage() {

  const {login, error, setError, loading} = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Por favor completa todos los campos.");
      return;
    }

    await login({ username, password });
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="animate-fade-up w-full max-w-md">

          {/* Card del formulario */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_32px_rgba(62,47,35,0.12)] px-8 py-10">

            {/* Encabezado */}
            <div className="mb-8">
              <h1 className="font-display text-2xl font-semibold text-dark tracking-wide">
                Iniciar Sesión
              </h1>
              <div className="mt-2 h-0.5 w-12 bg-gold rounded-full" />
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

              {/* Campo: Nombre de usuario */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-dark-light mb-1.5"
                >
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="tu_usuario"
                  className="
                    w-full rounded-lg border border-border bg-ivory-dark
                    px-4 py-2.5 text-sm text-dark placeholder:text-muted
                    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                    transition duration-200
                  "
                />
              </div>

              {/* Campo: Contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-dark-light mb-1.5"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="
                    w-full rounded-lg border border-border bg-ivory-dark
                    px-4 py-2.5 text-sm text-dark placeholder:text-muted
                    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                    transition duration-200
                  "
                />
              </div>

              {/* Mensaje de error */}

              {/* Botón de submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full rounded-lg bg-dark text-ivory font-semibold text-sm
                  px-5 py-3 mt-2
                  border-2 border-dark
                  hover:bg-dark-light hover:border-dark-light
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loading ? "Verificando…" : "Iniciar sesión"}
              </button>

            </form>
          </div>
        </div>

        {error && (
          <Modal type="error" message={error} onClose={() => setError(null)} />
        )}
    </main>
  );
}

export default LoginPage;
