function Newsletter() {
  return (
    <section className="px-10 py-24 bg-black text-white text-center">
      <p className="uppercase tracking-[5px] text-sm text-gray-400 mb-4">
        Join The List
      </p>

      <h2 className="text-4xl md:text-6xl font-bold mb-6">
        Be First To Discover New Drops
      </h2>

      <p className="text-gray-300 max-w-xl mx-auto mb-10">
        Get updates about new collections, exclusive offers, styling tips,
        and fashion inspiration.
      </p>

      <div className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="flex-1 px-5 py-4 text-black outline-none"
        />

        <button className="border border-white px-8 py-4 uppercase text-sm hover:bg-white hover:text-black transition">
          Subscribe
        </button>
      </div>
    </section>
  );
}

export default Newsletter;