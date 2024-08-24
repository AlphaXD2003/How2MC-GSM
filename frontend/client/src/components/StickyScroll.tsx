"use client";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";


const content = [
  {
    title: "FTP ACCESS",
    description:
      "Access all your files with your FTP client to make managing your plugins and server files easy.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        FTP Access
      </div>
    ),
  },
  {
    title: "DDOS PROTECTION",
    description:
      "If your server is attacked, we have you covered with DDoS protection FREE of charge.",
    content: (
      <div className="h-full w-full  flex items-center justify-center text-white">
        {/* <img
          src="/linear.webp"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="linear board demo"
        /> */}
        DDOS protection
      </div>
    ),
  },
  {
    title: "RYZEN 7950x PROCESSOR",
    description:
      "Our servers are powered by latest and cutting edge Ryzen 9 7950x processors. These are the high end CPU one can blindly rely on. We also use the top notch DDR5 RAM to give you best performance.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Ryzen 7950x Processors
      </div>
    ),
  },
  {
    title: "INSTANT SETUP",
    description:
      "Enjoy instant setup for most of our services, get going immediately after paying. The whole process is automated, so need to worry about the order.",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        INSTANT SETUP
      </div>
    ),
  },
  {
    title: "GAME SERVERS",
    description:
      "We currently offer all Game Servers, which you can manage on our custom Game Panel. ",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Game Servers
      </div>
    ),
  },
  {
    title: "SUPPORT 24/7",
    description:
      "Have an issue or concern? Open a support ticket with us anytime and get a quick response..",
    content: (
      <div className="h-full w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        24/7 Support
      </div>
    ),
  },
];
export function StickyScrollRevealDemo() {
  return (
    <div className="p-10">
      <StickyScroll content={content} />
    </div>
  );
}
