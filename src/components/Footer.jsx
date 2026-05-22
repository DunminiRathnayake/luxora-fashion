import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#f7f3ee] px-10 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h2 className="text-3xl font-bold tracking-widest mb-4">
            LUXORA
          </h2>
          <p className="text-gray-600 leading-7">
            A modern fashion destination for timeless elegance,
            curated collections, and effortless style.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm">
            Shop
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li><Link to="/shop">New Arrivals</Link></li>
            <li><Link to="/shop">Dresses</Link></li>
            <li><Link to="/shop">Tops</Link></li>
            <li><Link to="/shop">Collections</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm">
            Support
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>Contact Us</li>
            <li>Shipping Info</li>
            <li>Returns & Exchanges</li>
            <li>Size Guide</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm">
            Connect
          </h3>
          <ul className="space-y-3 text-gray-600">
            <li>Instagram</li>
            <li>TikTok</li>
            <li>WhatsApp</li>
            <li>Email</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-12 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between">
        <p>© 2026 Luxora Fashion. All rights reserved.</p>
        <p>Designed with elegance.</p>
      </div>
    </footer>
  );
}

export default Footer;