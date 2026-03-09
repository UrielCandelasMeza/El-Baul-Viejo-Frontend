import { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { getCategories, createCategory, deleteCategory } from "../../connection/categories";
import Modal from "../../components/Modal";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [newName,    setNewName]    = useState("");
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [modal,      setModal]      = useState({ type: "", message: "" });

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data.categories ?? res.data);
    } catch {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setModal({ type: "error", message: "El nombre de la categoría no puede estar vacío." });
      return;
    }
    try {
      setLoadingAdd(true);
      await createCategory({ name: trimmed });
      setNewName("");
      await fetchCategories();
      setModal({ type: "message", message: `Categoría "${trimmed}" creada correctamente.` });
    } catch (err) {
      setModal({ type: "error", message: err.response?.data?.message ?? "Error al crear la categoría." });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDelete = async (id, name) => {
    try {
      setDeletingId(id);
      await deleteCategory(id);
      await fetchCategories();
      setModal({ type: "message", message: `Categoría "${name}" eliminada.` });
    } catch (err) {
      setModal({ type: "error", message: err.response?.data?.message ?? "Error al eliminar la categoría." });
    } finally {
      setDeletingId(null);
    }
  };

  const inputClass = `
    w-full rounded-lg border border-border bg-ivory-dark
    px-4 py-2.5 text-sm text-dark placeholder:text-muted
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
    transition duration-200
  `;

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-4xl animate-fade-up">

        {/* Título */}
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold text-dark tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestionar categorías
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-gold rounded-full" />
        </div>

        {/* Layout dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ── Panel izquierdo: Categorías actuales ── */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_32px_rgba(62,47,35,0.10)] px-6 py-8">
            <h2
              className="text-base font-semibold text-dark mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Categorías actuales
            </h2>

            {categories.length === 0 ? (
              <p className="text-sm text-muted italic">No hay categorías todavía.</p>
            ) : (
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-dark truncate">{cat.name}</span>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      aria-label={`Eliminar ${cat.name}`}
                      className="
                        text-muted hover:text-red-500 transition-colors
                        disabled:opacity-40 disabled:cursor-not-allowed shrink-0
                      "
                    >
                      <MdDeleteOutline size={20} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Panel derecho: Crear categoría ── */}
          <div className="bg-card border border-border rounded-2xl shadow-[0_8px_32px_rgba(62,47,35,0.10)] px-6 py-8">
            <h2
              className="text-base font-semibold text-dark mb-5"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Crear categoría
            </h2>

            <form onSubmit={handleCreate} noValidate className="space-y-5">
              <div>
                <label htmlFor="cat-name" className="block text-sm font-medium text-dark-light mb-1.5">
                  Nombre
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej. Relojes, Porcelana…"
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loadingAdd}
                className="
                  w-full rounded-lg bg-dark text-ivory font-semibold text-sm
                  px-5 py-2.5
                  border-2 border-dark
                  hover:bg-dark-light hover:border-dark-light
                  active:scale-[0.98]
                  disabled:opacity-60 disabled:cursor-not-allowed
                  transition-all duration-200
                "
              >
                {loadingAdd ? "Añadiendo…" : "Añadir"}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Modal
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ type: "", message: "" })}
      />
    </main>
  );
}

export default ManageCategories;
