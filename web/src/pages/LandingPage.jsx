import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import EmptyState from "../components/EmptyState";
import PieceCard from "../components/PieceCard";
import SearchBar from "../components/SearchBar";
import SkeletonCard from "../components/SkeletonCard";
import { getAvailablePieces } from "../connection/pieces";

export default function LandingPage() {
  const navigate = useNavigate();

  const [allPieces, setAllPieces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAvailablePieces();
        const pieces = res.data.pieces ?? [];
        setAllPieces(pieces);
        setDisplayed(pieces);
      } catch (err) {
        console.error("Error cargando piezas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setDisplayed(allPieces);
      return;
    }
    const q = query.toLowerCase();
    setDisplayed(allPieces.filter((p) => p.name.toLowerCase().includes(q)));
  }, [query, allPieces]);

  const goToDetail = (id) => {
    navigate(`/piece/${id}`);
  };

  return (
    <main className="flex-1">
      {/* Sección buscador */}
      <section className="pt-10 px-6">
        <div className="max-w-7xl mx-auto">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {/* Grid de piezas */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Encabezado de sección */}
        <div className="flex items-center gap-4 mb-8">
          <h2 className="font-display text-2xl text-dark font-semibold whitespace-nowrap">
            Piezas disponibles
          </h2>

          {!loading && (
            <span className="text-muted text-sm">
              {displayed.length} {displayed.length === 1 ? "pieza" : "piezas"}
            </span>
          )}

          <div className="flex-1 h-px bg-linear-to-r from-gold/50 to-transparent" />
        </div>

        {/* Grid 4 columnas responsivo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Skeletons durante carga */}
          {loading &&
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}

          {/* Estado vacío */}
          {!loading && displayed.length === 0 && <EmptyState query={query} />}

          {/* Piezas */}
          {!loading &&
            displayed.map((piece, i) => (
              <PieceCard
                key={piece.id}
                piece={piece}
                index={i}
                onClick={() => goToDetail(piece.id)}
              />
            ))}
        </div>
      </section>
    </main>
  );
}
