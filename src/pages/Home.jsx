import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Collections from "../components/Collections";
import BrandStory from "../components/BrandStory";
import Newsletter from "../components/Newsletter";

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Collections />
      <BrandStory />
        <Newsletter />
    </div>
  );
}

export default Home;