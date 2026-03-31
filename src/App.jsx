import Navbar from "./components/Navbar.jsx"
import Hero from "./components/Hero.jsx"
import Features from "./components/Features.jsx";
import HowItWorks from "./components/Works.jsx"
import TechStack from "./components/TechStack.jsx"
import Demo from "./components/SeeItWork.jsx"
import CTA from "./components/CTA.jsx"
import Footer from "./components/Footer.jsx";
import Signup from "./components/Signup.jsx";
import Login from "./components/Login.jsx";

const App = () => {
  return (
    <div className="bg-[#0A0A0A]">
      {/* <Navbar />
      <Hero></Hero>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <TechStack></TechStack>
      <Demo></Demo>
      <CTA></CTA>
      <Footer></Footer> */}
      <Login></Login>
    </div>
  );
}

export default App
