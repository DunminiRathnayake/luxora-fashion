import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#faf9f6] border-t border-neutral-200/50 px-6 md:px-10 py-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
        <div>
          <h2 className="text-xl font-serif font-light tracking-[6px] text-black mb-5">
            LUXORA
          </h2>
          <p className="text-neutral-500 font-light text-xs leading-relaxed max-w-xs">
            A modern fashion destination for timeless elegance, curated capsules, and the editorial lifestyle.
          </p>
        </div>

        <div>
          <h3 className="text-[10px] tracking-[3px] font-semibold text-neutral-800 uppercase mb-5">
            Shop
          </h3>
          <ul className="space-y-3.5 text-xs font-light text-neutral-500 list-none p-0">
            <li><Link to="/shop" className="no-underline hover:text-black hover:underline underline-offset-4 transition-all">New Arrivals</Link></li>
            <li><Link to="/shop?category=Dresses" className="no-underline hover:text-black hover:underline underline-offset-4 transition-all">Dresses</Link></li>
            <li><Link to="/shop?category=Tops" className="no-underline hover:text-black hover:underline underline-offset-4 transition-all">Essentials</Link></li>
            <li><Link to="/shop?category=Evening%20Wear" className="no-underline hover:text-black hover:underline underline-offset-4 transition-all">Evening Wear</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] tracking-[3px] font-semibold text-neutral-800 uppercase mb-5">
            Support
          </h3>
          <ul className="space-y-3.5 text-xs font-light text-neutral-500 list-none p-0">
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Contact Us</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Shipping Info</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Returns & Exchanges</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Size Guide</li>
          </ul>
        </div>

        <div>
          <h3 className="text-[10px] tracking-[3px] font-semibold text-neutral-800 uppercase mb-5">
            Connect
          </h3>
          <ul className="space-y-3.5 text-xs font-light text-neutral-500 list-none p-0">
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Instagram</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">TikTok</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">WhatsApp Business</li>
            <li className="cursor-pointer hover:text-black hover:underline underline-offset-4 transition-all">Concierge Desk</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-200/50 mt-16 pt-8 text-[10px] text-neutral-400 uppercase tracking-widest flex flex-col md:flex-row justify-between gap-4">
        <p>© 2026 Luxora Fashion. All rights reserved.</p>
        <p>Curated with quiet luxury.</p>
      </div>
    </footer>
  );
}

export default Footer;