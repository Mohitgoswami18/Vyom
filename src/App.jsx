import Navbar from "./components/Navbar.jsx"
import Hero from "./components/Hero.jsx"
import Features from "./components/Features.jsx";
import HowItWorks from "./components/Works.jsx"
import TechStack from "./components/TechStack.jsx"

const App = () => {
  return (
    <div className="bg-[#0A0A0A]">
      <Navbar />
      <Hero></Hero>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <TechStack></TechStack>
    </div>
  );
}

export default App
