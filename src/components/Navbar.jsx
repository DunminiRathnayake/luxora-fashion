import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingBag } from "lucide-react";

function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-neutral-100 bg-white sticky top-0 z-50">
      
      <Link to="/" className="text-2xl font-bold tracking-widest text-black no-underline">
        LUXORA
      </Link>

      <div className="flex gap-6 md:gap-8 items-center text-xs md:text-sm uppercase tracking-wider font-medium">
        <Link to="/" className="text-neutral-600 hover:text-black transition-colors no-underline">Home</Link>
        <Link to="/shop" className="text-neutral-600 hover:text-black transition-colors no-underline">Shop</Link>
        <Link to="/login" className="text-neutral-600 hover:text-black transition-colors no-underline">Login</Link>
        
        <Link to="/cart" className="flex items-center gap-1.5 text-neutral-650 hover:text-black transition-colors no-underline relative py-1">
          <ShoppingBag className="w-4 h-4 text-neutral-800" />
          <span className="hidden sm:inline">Bag</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-black text-white text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold border border-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;