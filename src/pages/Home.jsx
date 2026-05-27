import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import Collections from "../components/Collections";
import BrandStory from "../components/BrandStory";
import Newsletter from "../components/Newsletter";
import SEO from "../components/SEO";

function Home() {
  return (
    <main>
      <SEO 
        title="Timeless Curated Curation" 
        description="Experience modern luxury fashion with Luxora. Discover elegant dresses, refined blazers, and luxury evening wear curated for timeless sophistication."
      />
      <Hero />
      <FeaturedProducts />
      <Collections />
      <BrandStory />
      <Newsletter />
    </main>
  );
}

export default Home;