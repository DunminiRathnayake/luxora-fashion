import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b">
      
      <h1 className="text-2xl font-bold tracking-widest">
        LUXORA
      </h1>

      <div className="flex gap-8 text-sm uppercase">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
      </div>

    </nav>
  );
}

export default Navbar;