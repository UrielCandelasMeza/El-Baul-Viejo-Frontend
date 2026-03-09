function PieceDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-pulse w-full h-full">
      <div className="h-5 w-24 bg-ivory-dark rounded-full mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-5/3 bg-ivory-dark rounded-2xl" />
        <div className="space-y-4 pt-2">
          <div className="h-8 bg-ivory-dark rounded-full w-2/3" />
          <div className="h-6 bg-ivory-dark rounded-full w-1/3" />
          <div className="h-4 bg-ivory-dark rounded-full w-full" />
          <div className="h-4 bg-ivory-dark rounded-full w-5/6" />
          <div className="h-4 bg-ivory-dark rounded-full w-4/6" />
        </div>
      </div>
    </div>
  );
}

export default PieceDetailSkeleton;
