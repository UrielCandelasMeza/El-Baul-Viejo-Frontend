import { useState, useEffect, useRef } from "react";
import { MdAddPhotoAlternate, MdClose } from "react-icons/md";
import { getCategories } from "../../connection/categories";
import { createPiece } from "../../connection/pieces";
import Modal from "../../components/Modal";
import { useAuth } from "../../context/AuthContext";

const STATUS_OPTIONS = [
  { value: "available", label: "Disponible" },
  { value: "sold",      label: "Vendido" },
];

function CreatePiece() {

  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [name,        setName]        = useState("");
  const [price,       setPrice]       = useState("");
  const [description, setDescription] = useState("");
  const [status,      setStatus]      = useState("available");
  const [categoryIds, setCategoryIds] = useState([]);
  const [images,      setImages]      = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [modal,       setModal]       = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data.categories ?? res.data);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview));
  }, [images]);

  const MAX_IMAGES = 5;

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => {
      const remaining = MAX_IMAGES - prev.length;
      if (remaining <= 0) return prev;
      const added = files.slice(0, remaining).map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prev, ...added];
    });
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const toggleCategory = (id) => {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price || images.length === 0 || categoryIds.length === 0) {
      setModal({ type: "error", message: "El nombre, el precio, las imágenes y las categorías son obligatorios." });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("status", status);
      categoryIds.forEach((id) => formData.append("category_ids", id));
      images.forEach((img) => formData.append("photos", img.file));

      const res = await createPiece(formData);
      setModal({ type: "message", message: res.data.message });
      setName("");
      setPrice("");
      setDescription("");
      setStatus("available");
      setCategoryIds([]);
      setImages([]);
    } catch (error) {
      const msg = error.response?.data?.message ?? "Error al crear la pieza.";
      setModal({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `
    w-full rounded-lg border border-border bg-ivory-dark
    px-4 py-2.5 text-sm text-dark placeholder:text-muted
    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
    transition duration-200
  `;
  const labelClass = "block text-sm font-medium text-dark-light mb-1.5";

  return (
    <main className="flex-1 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-fade-up">

        {/* Título */}
        <div className="mb-8">
          <h1
            className="text-2xl font-semibold text-dark tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Añadir pieza
          </h1>
          <div className="mt-2 h-0.5 w-12 bg-gold rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-[0_8px_32px_rgba(62,47,35,0.10)] px-8 py-10">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* Nombre */}
            <div>
              <label htmlFor="name" className={labelClass}>Nombre</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Reloj de bolsillo antiguo"
                className={inputClass}
              />
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className={labelClass}>Precio (MXN)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className={labelClass}>Descripción</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe la pieza: época, materiales, estado, historia…"
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="status" className={labelClass}>Estado</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Categorías */}
            <div>
              <label className={labelClass}>Categorías</label>
              {categories.length === 0 ? (
                <p className="text-sm text-muted italic">Sin categorías disponibles.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => {
                    const selected = categoryIds.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`
                          px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
                          ${selected
                            ? "bg-dark text-ivory border-dark"
                            : "bg-ivory-dark text-dark-light border-border hover:border-gold hover:text-gold"
                          }
                        `}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div>
              <label className={labelClass}>Imágenes</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={images.length >= MAX_IMAGES}
                className="
                  w-full flex items-center justify-center gap-2
                  border-2 border-dashed border-border rounded-xl
                  py-3 text-sm text-muted hover:border-gold hover:text-gold
                  transition-colors duration-200 cursor-pointer
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border disabled:hover:text-muted
                "
              >
                <MdAddPhotoAlternate size={20} />
                {images.length >= MAX_IMAGES ? `Límite alcanzado (${MAX_IMAGES})` : `Subir imágenes (${images.length}/${MAX_IMAGES})`}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFiles}
              />

              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.preview}
                        alt={img.file.name}
                        className="w-full aspect-square object-cover rounded-xl border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="
                          absolute top-1.5 right-1.5
                          bg-dark/80 hover:bg-dark text-ivory
                          rounded-full p-0.5
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-150
                        "
                        aria-label="Eliminar imagen"
                      >
                        <MdClose size={14} />
                      </button>
                      <span className="
                        absolute bottom-1.5 left-1.5
                        text-[10px] text-ivory bg-dark/60 rounded px-1.5 py-0.5
                        opacity-0 group-hover:opacity-100 transition-opacity
                      ">
                        Eliminar
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botón crear */}
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
              {loading ? "Creando…" : "Crear pieza"}
            </button>

          </form>
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

export default CreatePiece;