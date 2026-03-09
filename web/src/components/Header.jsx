import { useNavigate } from "react-router";
import { MdAdd, MdCategory, MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

function Header({ variant = "public" }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth?.() ?? {};

  const isAdmin = variant === "admin";

  return (
    <header className="bg-dark sticky top-0 z-50 shadow-[0_2px_14px_rgba(62,47,35,0.4)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <a
          href="/"
          className="font-serif text-gold text-xl font-semibold tracking-wide hover:text-gold-light transition-colors duration-200"
        >
          El Baúl Viejo
        </a>

        {/* Nav según variante */}
        <nav className="flex items-center gap-6">
          {isAdmin ? (
            <>
              <button
                onClick={() => navigate("/admin/piece/create")}
                className="flex items-center gap-1.5 text-gold text-sm font-medium hover:text-gold-light transition-colors"
              >
                <MdAdd size={16} />
                Añadir pieza
              </button>
              <button
                onClick={() => navigate("/admin/categories")}
                className="flex items-center gap-1.5 text-ivory/70 text-sm hover:text-ivory transition-colors"
              >
                <MdCategory size={16} />
                Gestionar categorías
              </button>
              <button
                onClick={() => navigate("/admin/login")}
                className="flex items-center gap-1.5 text-ivory/50 text-sm hover:text-red-400 transition-colors"
              >
                <MdLogout size={16} />
                Cerrar sesión
              </button>
            </>
          ) : (
            <a
              href="#contacto"
              className="text-ivory/80 text-sm font-medium hover:text-gold transition-colors duration-200 px-2 py-1"
            >
              Contáctanos
            </a>
          )}
        </nav>

      </div>
    </header>
  );
}

export default Header;
