function SimilarPieceCard({ piece, onClick }) {
  return (
    <article
      onClick={onClick}
      className="
        bg-card border-[1.5px] border-border rounded-xl overflow-hidden
        cursor-pointer group
        transition-all duration-200
        hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(140,106,59,0.18)] hover:border-gold
        animate-[fadeUp_0.45s_ease_both]
      ">
      <div className="h-40 overflow-hidden bg-ivory-dark">
        <img
          src={piece.photos[0]}
          alt={piece.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="p-3 border-t border-border">
        <p className="font-semibold text-text text-sm truncate">{piece.name}</p>
        <p className="font-display text-gold font-semibold text-sm mt-0.5">
          ${piece.price.toLocaleString("es-MX")} MXN
        </p>
      </div>
    </article>
  );
}

export default SimilarPieceCard;
