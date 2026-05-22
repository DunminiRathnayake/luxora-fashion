function Collections() {
  return (
    <section className="px-10 py-24 bg-[#f7f3ee]">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[5px] text-sm text-gray-500">
          Explore The Edit
        </p>
        <h2 className="text-5xl font-bold mt-4">
          Curated Collections
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative h-[500px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c"
            alt="Dresses"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-8">
            <h3 className="text-white text-3xl font-semibold">Dresses</h3>
          </div>
        </div>

        <div className="relative h-[500px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
            alt="Essentials"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-8">
            <h3 className="text-white text-3xl font-semibold">Essentials</h3>
          </div>
        </div>

        <div className="relative h-[500px] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"
            alt="Evening Wear"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-black/30 flex items-end p-8">
            <h3 className="text-white text-3xl font-semibold">Evening Wear</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Collections;