import Hero from "../../components/home/Hero";
import SearchBar from "../../components/home/SearchBar";
import Categories from "../../components/home/Categories";
import FoodGrid from "../../components/home/FoodGrid";

function Home() {
  return (
    <>
      <Hero />
      <SearchBar />
      <Categories />
      <FoodGrid />
    </>
  );
}

export default Home;