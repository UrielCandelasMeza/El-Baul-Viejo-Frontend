function PieceCard({ piece, index, onClick }) {
  return (
    <article
      onClick={onClick}
      style={{ animationDelay: `${index * 55}ms` }}
      className="
        bg-card border-[1.5px] border-border rounded-2xl overflow-hidden
        cursor-pointer group
        transition-all duration-200 ease-out
        hover:-translate-y-1.5
        hover:shadow-[0_12px_32px_rgba(140,106,59,0.2)]
        hover:border-gold
        animate-[fadeUp_0.45s_ease_both]
      ">
      {/* Imagen */}
      <div className="relative h-52 overflow-hidden bg-ivory-dark">
        <img
          src={piece.photos[0]}
          alt={piece.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      {/* Info */}
      <div className="p-4 border-t border-border">
        <p className="font-semibold text-text text-[0.9rem] leading-snug truncate">
          {piece.name}
        </p>
        <p className="font-display text-gold font-semibold text-[1.05rem] mt-1">
          ${piece.price.toLocaleString("es-MX")} MXN
        </p>
      </div>
    </article>
  );
}
export default PieceCard;
