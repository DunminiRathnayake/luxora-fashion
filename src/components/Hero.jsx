function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-6">

      <p className="uppercase tracking-[6px] text-sm mb-4">
        New Collection 2026
      </p>

      <h1 className="text-6xl md:text-8xl font-bold leading-tight">
        Modern Fashion
      </h1>

      <p className="mt-6 max-w-xl text-gray-600">
        Discover luxury fashion designed for elegance,
        confidence, and modern lifestyle.
      </p>

      <button className="mt-8 border px-8 py-3 uppercase text-sm hover:bg-black hover:text-white transition">
        Shop Now
      </button>

    </section>
  );
}

export default Hero;