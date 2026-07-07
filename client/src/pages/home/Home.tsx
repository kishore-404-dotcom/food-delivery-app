import Hero from "../../components/home/Hero";
import SearchBar from "../../components/home/SearchBar";
import Categories from "../../components/home/Categories";
import FoodGrid from "../../components/home/FoodGrid";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/Footer";

function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <Categories />
      <FoodGrid />
      <WhyChooseUs />
      <Footer />
    </>
  );
}

export default Home;