function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col w-full">
      {/* Pulse Image Box */}
      <div className="aspect-[3/4] bg-neutral-200/40 w-full mb-4 rounded-xs border border-neutral-200/20" />
      
      {/* Category line */}
      <div className="h-2 bg-neutral-200/50 w-1/4 mb-2.5 rounded-xs" />
      
      {/* Pulse Name bar */}
      <div className="h-3.5 bg-neutral-200/80 w-3/4 mb-2 rounded-xs" />
      
      {/* Pulse Price bar */}
      <div className="h-3 bg-neutral-200/50 w-1/5 rounded-xs" />
    </div>
  );
}

export default ProductSkeleton;
