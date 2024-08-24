import { Button } from "@mui/material";
import React from "react";

export function GridBackgroundDemo({children, className}: {children: React.ReactNode, className?: string}) {
  return (
    <div className="bg-[var(--quinary-color)] flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
      <div className="dark:text-[var(--text-color)] text-2xl mt-4 ">DON'T TRUST US, TRUST THEM</div>
      <div className="lg:w-[40%] w-[80%] text-center text-2xl lg:text-5xl font-bold mt-4">Hundreds of customers rated us Excellent</div>
      </div>
    <div className={`h-auto border w-full dark:bg-[#333] bg-white    dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center ${className}`}>
      {/* Radial gradient for the container to give a faded look */}
      
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      
      {children}
     
    </div>
    <div className="mx-auto mt-3 mb-6">
      <Button variant="contained" className="p-3 mt-3 text-xl" > See all of our reviews on Trustpilot</Button>
    </div>
    </div>

  );
}
