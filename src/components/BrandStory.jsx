function BrandStory() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* LEFT IMAGE */}

      <div className="h-[500px] md:h-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
          alt="Fashion Story"
          className="w-full h-full object-cover"
        />
      </div>

      {/* RIGHT CONTENT */}

      <div className="flex flex-col justify-center px-10 md:px-20 py-20 bg-white">

        <p className="uppercase tracking-[5px] text-sm text-gray-500 mb-4">
          Our Story
        </p>

        <h2 className="text-5xl font-bold leading-tight mb-8">
          Fashion Designed For Modern Elegance
        </h2>

        <p className="text-gray-600 leading-8 mb-8">
          Luxora blends timeless sophistication with modern
          fashion aesthetics to create collections that inspire
          confidence, individuality, and effortless beauty.
        </p>

        <button className="border w-fit px-8 py-3 uppercase text-sm hover:bg-black hover:text-white transition">
          Discover More
        </button>

      </div>

    </section>
  );
}

export default BrandStory;