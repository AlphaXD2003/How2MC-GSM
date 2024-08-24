
import { HoverEffect } from "./ui/card-hover-effect";

interface Projects {
  title: string;
  description: string;
  link: string;
}

const HoverCard = ({ projects, className }: any) => {
 
  return  (
    <div className={`max-w-7xl mx-auto  px-8 ${className}`}>
      <HoverEffect items={projects} />
    </div>
  );
};

export default HoverCard;
