import React from "react";
import { Link } from "react-router-dom";
export interface SmallGameCardsProps {
  name: string;
  src: string;
}
const SmallGameCards = ({ details }: { details: SmallGameCardsProps[] }) => {
  return (
    <div className=" flex flex-wrap lg:flex-row  mx-auto my-auto ">
      {details.map((game, i) => (
        <Link to={`/game/${game.name}`} key={i}>
          <div
            className="bg-[var(--semi-dark2)] mt-2 pb-1 rounded-md   p-3 w-[80px] h-[80px] lg:w-[150px] lg:h-[150px] flex flex-col mx-2 lg:mx-8 gap-3" 
            key={i}
          >
            <div className="mx-auto ">
              <img
                src={game.src}
                alt={game.name}
                className=" h-full w-[70%] mx-auto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="mx-auto text-sm lg:text-lg font-bold text-[var(--text-color)]">
                {game.name}
              </div>
            </div>
          </div>
          {/* For mobile device I will use grid layout */}
          <div className="lg:hidden flex flex-wrap" >

          </div>
        </Link>
      ))}
    </div>
  );
};

export default SmallGameCards;
