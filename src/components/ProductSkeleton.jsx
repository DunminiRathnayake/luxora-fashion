function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col w-full">
      {/* Pulse Image Box */}
      <div className="aspect-[3/4] bg-neutral-100 w-full mb-4 rounded-sm" />
      
      {/* Pulse Name bar */}
      <div className="h-4 bg-neutral-150 w-2/3 mb-2 rounded-sm" />
      
      {/* Pulse Price bar */}
      <div className="h-3.5 bg-neutral-100 w-1/4 rounded-sm" />
    </div>
  );
}

export default ProductSkeleton;
