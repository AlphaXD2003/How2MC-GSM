import React from "react";
import SmallGameCards, { SmallGameCardsProps } from "./SmallGameCards";
const popularGames : SmallGameCardsProps[] = [
    {
        name: "Minecraft",
        src: "/images/minecraft.png"
    },
    {
        name: "Fivem",
        src: "/images/fivem.png"
    },
    {
        name: "ARK",
        src: "/images/ark.png"
    },
    {
        name: "Rust",
        src: "/images/rust.png"
    },
    {
        name: "Palworld",
        src: "/images/palworld.png"
    }
]

const PopularGames = () => {
  return (
    <div
      className="w-full
        flex flex-col lg:flex-row  justify-around
    border mx-auto px-8 py-10 sm:py-20 lg:px-0 lg:py-24 dark:bg-[var(--quinary-color)]"
    
    >
      <div className="flex flex-col lg:flex-row  "> 
        <div>
          <div className="flex flex-row lg:flex-col">
            <div className="lg:text-7xl roboto-slab-600">
              Popular&nbsp;games
            </div>
            <div className="lg:hidden">&nbsp;</div>
            <div className="lg:text-5xl roboto-slab-400">
              and&nbsp;services.
            </div>
          </div>
          <div>
            <div className="lg:text-6xl font-bold roboto-slab-400 text-[var(--text-color)]">
              Your&nbsp;choice.
            </div>
            <div className="text-[var(--semi-dark)]">
              With&nbsp;the&nbsp;ability&nbsp;to&nbsp;upload&nbsp;your&nbsp;own&nbsp;software!
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <SmallGameCards details={popularGames} />
        </div>
      </div>
    </div>
  );
};

export default PopularGames;
