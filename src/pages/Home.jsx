import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Collections from "../components/Collections";
import BrandStory from "../components/BrandStory";

function Home() {
  return (
    <div>
      <Hero />
      <FeaturedProducts />
      <Collections />
      <BrandStory />
    </div>
  );
}

export default Home;