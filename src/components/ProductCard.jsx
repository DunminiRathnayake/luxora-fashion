import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="block group cursor-pointer text-black no-underline">

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

    </Link>
  );
}

export default ProductCard;