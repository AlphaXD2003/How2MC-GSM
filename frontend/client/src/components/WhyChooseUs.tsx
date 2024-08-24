import { Link } from "react-router-dom";
import { HoverEffect } from "./ui/card-hover-effect";

const whyChooseUsItems = [
  {
    title: "Full Access",
    description:
      "Get full access of your own server with our feature rich control panel.",
    link: "#",
    src: "/images/authorization.png",
  },
  {
    title: "Outstanding Reliability",
    description:
      "All of our hardware run at 99.9% availability to provide your players with experience all day and night.",
    link: "#",
    src: "/images/1034412.png",
  },{
    title: "Climate Friendly",
    description:
      "We donate 1% of your purchase amount to Stripe climate to power next gen carbon removal projects.",
    link: "#",
    src: "/images/global-warming.png",
  },{
    title: "Top-Notch Hardware",
    description:
      "We power your server on Intel/AMD processors, DDR4 RAM and NVMe disks.",
    link: "#",
    src: "/images/cpu.png",
  }
  
];

const WhyChooseUs = () => {
  return (
    <div className="dark:bg-[var(--quinary-color)] w-[100%] h-full  flex flex-col justify-center items-center hover:dark:bg-[var(--semi-dark2)]">
      <div className="uppercase text-xl text-[var(--text-color)] font-semibold">
        FUll features
      </div>
      <div className="roboto-slab-600 text-3xl mt-2 lg:text-4xl">
        Why choose use over other hosts?
      </div>
      <div className="mt-4 lg:w-[40%]  text-center ">
        <Link className="underline font-semibold" to="/">
          How2MC GSM
        </Link>
        &nbsp; offers you the opportunity to relax and have fun with friends
        with reliable server hosting of your favorite online game.
      </div>
      <HoverEffect className="lg:w-[1400px]"  items={whyChooseUsItems} />
    </div>
  );
};

export default WhyChooseUs;
