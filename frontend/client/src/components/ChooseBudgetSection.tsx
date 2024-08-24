import PlansCard from "./PlansCard";

import plans from "../configs/plans";
import TickText from "./TickText";

const ChooseBudgetSection = () => {
  return (
    <div className="flex flex-col w-[100%] justify-center items-center mt-4 lg:mt-12 mb-4 lg:mb-12">
      <div className="uppercase lg:text-lg text-md text-[var(--text-color)]">
        Hosting Plans
      </div>
      <div className="text-4xl mt-2 lg:text-5xl font-bold">
        Choose between...
      </div>
      <div className="lg:mt-16 mt-6 text-sm lg:text-xl font-semibold">
        Experience tranquility with our hassle-free 14-day refund guarantee, and
        explore a variety of
        <div className="inline md:hidden text-[var(--text-color)]">&nbsp;convenient payment options</div>
      </div>
      <div className="md:flex hidden   flex-row mt-1 font-semibold">
        convenient &nbsp;
        <div className="text-[var(--text-color)]">payment options</div>.
      </div>
      <div className="flex flex-wrap gap-4 mt-4 justify-center items-center">
          {plans.map((plan : any) => (
            <PlansCard key={plan.title} {...plan} />
          ))}
        </div>
        <div className="lg:w-[60%]  w-[80%] mt-4 lg:mt-12 text-center flex flex-wrap justify-between items-center px-3">
            <TickText text="Instant Setup" />
            <TickText text="Enterprise Hardware" />
            <TickText text="DDoS Protection" />
            <TickText text="99.99% Uptime" />
            <TickText text="Priority 24/7/365 Support" />
        </div>
    </div>
  );
};

export default ChooseBudgetSection;
