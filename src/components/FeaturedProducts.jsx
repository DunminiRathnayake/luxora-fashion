import { products } from "../data/products";
import ProductCard from "./ProductCard";

function FeaturedProducts() {
  return (
    <section className="px-10 py-20">

      <div className="flex justify-between items-center mb-10">

        <h2 className="text-4xl font-bold">
          Featured Products
        </h2>

        <button className="border px-6 py-2 text-sm uppercase">
          View All
        </button>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}

      </div>

    </section>
  );
}

export default FeaturedProducts;