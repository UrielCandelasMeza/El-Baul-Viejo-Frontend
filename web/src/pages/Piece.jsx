import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { FiChevronLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BsMessenger } from "react-icons/bs";
import PieceDetailSkeleton from "../components/PieceDetailSkelleton";
import ContactButton from "../components/ContactButton";
import Carousel from "../components/Carousel";
import SimilarPieceCard from "../components/SimilarPieceCard";
import CategoryBadge from "../components/CategoryBadge";
import StatusBadge from "../components/StatusBadge";
import { getPieceById, getAvailablePieces } from "../connection/pieces";
import { getCategories } from "../connection/categories";

export default function PieceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [piece, setPiece]       = useState(null);
  const [similar, setSimilar]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ── Carga la pieza y categorías ─────────────────────────── */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [pieceRes, catsRes] = await Promise.all([
          getPieceById(id),
          getCategories(),
        ]);

        if (!pieceRes.data.success) {
          setNotFound(true);
          return;
        }

        setPiece(pieceRes.data.piece);
        setCategories(catsRes.data.categories ?? []);
      } catch (err) {
        console.error("Error cargando pieza:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  /* ── Calcula piezas similares ────────────────────────────── */
  useEffect(() => {
    if (!piece) return;
    const fetchSimilar = async () => {
      try {
        const res = await getAvailablePieces();
        const all = res.data.pieces ?? [];
        const sim = all
          .filter(
            (p) =>
              p.id !== piece.id &&
              p.category_ids.some((c) => piece.category_ids.includes(c)),
          )
          .slice(0, 4);
        setSimilar(sim);
      } catch {
        setSimilar([]);
      }
    };
    fetchSimilar();
  }, [piece]);

  /* ── Resuelve nombres de categorías ─────────────────────── */
  const categoryNames = piece
    ? piece.category_ids
        .map((cid) => categories.find((c) => c.id === cid)?.name)
        .filter(Boolean)
    : [];

  /* ── Construye links de contacto ─────────────────────────── */
  const waMessage = piece
    ? encodeURIComponent(
        `Hola, me interesa la pieza: ${piece.name} ($${piece.price.toLocaleString("es-MX")} MXN)`,
      )
    : "";
  const waLink = `https://wa.me/521XXXXXXXXXX?text=${waMessage}`; // TODO: tu número
  const messengerLink = "https://m.me/TU_PAGE"; // TODO: tu page

  /* ── Renders ─────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <PieceDetailSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <span className="text-6xl mb-6 select-none">🏺</span>
          <h2 className="font-display text-2xl text-dark mb-2">
            Pieza no encontrada
          </h2>
          <p className="text-muted text-sm mb-8">
            Es posible que haya sido vendida o eliminada
          </p>
          <button
            onClick={() => navigate("/")}
            className="
              border-2 border-gold text-gold rounded-lg px-6 py-2.5
              text-sm font-semibold font-sans
              hover:bg-gold hover:text-white
              transition-all duration-200 cursor-pointer bg-transparent
            ">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ── Botón volver ─────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="
              inline-flex items-center gap-1.5 text-bronze text-sm font-medium
              hover:text-gold transition-colors duration-200
              mb-8 cursor-pointer bg-transparent border-none
            ">
          <FiChevronLeft size={16} />
          Volver
        </button>

        {/* ── Layout principal ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start animate-[fadeIn_0.4s_ease]">
          {/* Columna izquierda — Carrusel */}
          <Carousel photos={piece.photos} />

          {/* Columna derecha — Info */}
          <div className="space-y-5">
            {/* Nombre */}
            <h1 className="font-display text-3xl text-dark font-semibold leading-tight">
              {piece.name}
            </h1>

            {/* Precio */}
            <p className="font-display text-3xl text-gold font-bold">
              ${piece.price.toLocaleString("es-MX")}
              <span className="text-muted text-base font-sans font-normal ml-2">
                MXN
              </span>
            </p>

            {/* Divisor decorativo */}
            <div className="w-16 h-0.5 bg-gold/50" />

            {/* Descripción */}
            <p className="text-text/80 text-sm leading-relaxed">
              {piece.description}
            </p>

            {/* Estado */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted font-medium">Estado:</span>
              <StatusBadge status={piece.status} />
            </div>

            {/* Categorías */}
            {categoryNames.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted font-medium">
                  Categorías:
                </span>
                {categoryNames.map((name) => (
                  <CategoryBadge key={name} name={name} />
                ))}
              </div>
            )}

            {/* Botones de contacto — solo si está disponible */}
            {piece.status === "available" && (
              <div className="flex flex-wrap gap-3 pt-2">
                <ContactButton
                  href={waLink}
                  icon={<FaWhatsapp size={18} />}
                  label="WhatsApp"
                  colorClass="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                />
                <ContactButton
                  href={messengerLink}
                  icon={<BsMessenger size={16} />}
                  label="Messenger"
                  colorClass="border-[#0084FF] text-[#0084FF] hover:bg-[#0084FF] hover:text-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* ── Piezas similares ──────────────────────────── */}
        {similar.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-7">
              <h2 className="font-display text-xl text-dark font-semibold whitespace-nowrap">
                Piezas con categorías similares
              </h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/50 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <SimilarPieceCard
                  key={p.id}
                  piece={p}
                  onClick={() => navigate(`/piece/${p.id}`)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
