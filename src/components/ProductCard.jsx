function ProductCard({ product }) {
  return (
    <div className="group cursor-pointer">

      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-medium">
          {product.name}
        </h2>

        <p className="text-gray-500 mt-1">
          {product.price}
        </p>
      </div>

    </div>
  );
}

export default ProductCard;