function EmptyState({ query }) {
  return (
    <div className="col-span-4 flex flex-col items-center justify-center py-24 text-center animate-[fadeIn_0.35s_ease]">
      <span className="text-5xl mb-5 select-none">🏺</span>
      <p className="font-display text-xl text-dark-light italic mb-2">
        Sin resultados para "{query}"
      </p>
      <p className="text-muted text-sm">Intenta con otro nombre o categoría</p>
    </div>
  );
}
export default EmptyState;
