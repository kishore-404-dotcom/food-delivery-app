import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Hero from "../../components/home/Hero";
import SearchBar from "../../components/home/SearchBar";
import Categories from "../../components/home/Categories";
import FoodGrid from "../../components/home/FoodGrid";
import WhyChooseUs from "../../components/home/WhyChooseUs";
import Footer from "../../components/Footer";

function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;

    if (scrollTo === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(scrollTo)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

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
