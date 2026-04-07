import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import HowItWorks from "../components/Works";
import TechStack from "../components/TechStack";
import Demo from "../components/SeeItWork";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
export default function Home() {
  return (
    <div className="bg-[#0A0A0A]">
      <Navbar />
      <Hero></Hero>
      <Features></Features>
      <HowItWorks></HowItWorks>
      <TechStack></TechStack>
      <Demo></Demo>
      <CTA></CTA>
      <Footer></Footer>
    </div>
  );
}
