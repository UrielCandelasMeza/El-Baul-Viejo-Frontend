function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
      <div className="h-52 bg-ivory-dark" />
      <div className="p-4 space-y-2.5">
        <div className="h-3.5 bg-ivory-dark rounded-full w-3/4" />
        <div className="h-3.5 bg-ivory-dark rounded-full w-1/3" />
      </div>
    </div>
  );
}

export default SkeletonCard;
