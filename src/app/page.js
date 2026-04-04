import Image from "next/image";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Features from "./sections/Features";
import HowItWorks from "./sections/Works";
import TechStack from "./sections/TechStack";
import Demo from "./sections/SeeItWork";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";
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
