// import { BentoGridSecondDemo } from "@/components/BentoGrid";
import ChooseBudgetSection from "@/components/ChooseBudgetSection";
import GlobeWorld from "@/components/Globe";
import { GridBackgroundDemo } from "@/components/GridBackground";
import HeroSection from "@/components/HeroSection";
import HoverCard from "@/components/HoverCard";
import { InfiniteMovingCardsDemo } from "@/components/InfiniteMovingCards";
import OurPanel from "@/components/OurPanel";
import PopularGames from "@/components/PopularGames";
import { StickyScrollRevealDemo } from "@/components/StickyScroll";
import SubscribeNewsLater from "@/components/SubscribeNewsLater";
import WhyChooseUs from "@/components/WhyChooseUs";
// import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
// import { useState } from "react";

export const projects = [
  {
    title: "14 Day Refund Policy",
    description:
      "Unsatisfied from our service? We'll provide a full refund within the first 14-days of deployment no questions asked!",
    link: "https://stripe.com",
    src: "/images/para2.png.pagespeed.ce.d3Jpoo_1Va.png"
  },
  {
    title: "MC Guard",
    description:
      "A system that combines DDOS Protection and Software Protection keeping your server online.",
    link: "https://netflix.com",
    src: "/images/antiddos.png.pagespeed.ce.FY9uUJw8sZ.png"
  },
  {
    title: "High Performance",
    description:
      "Our servers are extremely fast allowing you to host as much as you need without worrying about power.",
    link: "https://google.com",
    src: "/images/cpu.png.pagespeed.ce.1nXKuK0DTR.png"
  },
  {
    title: "Instant Deployment",
    description:
      "When you order a server our automated system provisions your server so it is ready to use instantly.",
    link: "https://meta.com",
    src: "/images/backup.png.pagespeed.ce.OpcfAnznXi.png"
  },
  
];

const Home = () => {
  return (
    <div>
      <HeroSection />
      <HoverCard className=" sm:my-14" projects={projects} /> 
      {/* hidden lg:block */}
      <PopularGames />
      <ChooseBudgetSection />
      <WhyChooseUs />
      <OurPanel/>
      <GridBackgroundDemo
      className="mt-4 mx-0 cursor-pointer"
        children={<InfiniteMovingCardsDemo />}
      />
      <StickyScrollRevealDemo />
      <SubscribeNewsLater />
      <GlobeWorld />
      {/* <div>
        <BentoGridSecondDemo />
      </div> */}
      
    </div>
  );
};

export default Home;
