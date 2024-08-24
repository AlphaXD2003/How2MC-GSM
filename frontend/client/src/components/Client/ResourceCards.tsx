import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ResourceCards = ({
  title,
  Description,
  Current,
  Max
}: {
  title: string;
  Description: string;
  Current: string;
  Max: string;
}) => {
  const calculatePercentage = (current: string, max: string) => Math.round((parseInt(current) / parseInt(max)) * 100);
  const initialPercentage = calculatePercentage(Current, Max);
  const [percentage, setPercentage] = useState(initialPercentage);

  // Function to determine color based on percentage
  const determineColor = (percentage: number) => {
    if (percentage === 0) return "bg-gray-500";
    if (percentage < 20) return "bg-blue-500";
    if (percentage < 50) return "bg-green-500";
    if (percentage < 80) return "bg-yellow-500";
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 100) return "bg-green-500";
    return "bg-black"; // Default color
  };

  const [color, setColor] = useState(() => determineColor(initialPercentage));

  useEffect(() => {
    if(initialPercentage >= 100) {
      setPercentage(100)
    }
    else if(initialPercentage === 0) {
      setPercentage(0)
    }
    else{
      setPercentage(initialPercentage)
    }

    // setPercentage(initialPercentage == 0 ? 100 : initialPercentage); // This might be redundant if percentage doesn't change from its initial value
    setColor(determineColor(initialPercentage));

    
  }, [Current, Max]); // Depend on Current and Max to recalculate when they change
  return (
    <div className="lg:max-w-[500px]">
      <Card className="z-10  cursor-pointer lg:max-w-[500px] hover:dark:bg-[var(--semi-dark2)]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{Description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row items-center  gap-3">
            <p className="text-xl ml-auto">{Current} </p>
            <p className="text-sm">/ {Max} </p>
          </div>
        </CardContent>
       {
        color === "bg-black" ? null : (
          <motion.div
          className={`w-full h-1  ${color} rounded-b-lg`}
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: `${percentage}%` }}
          transition={{ duration: 0.4 }}
          
        ></motion.div>
        )
       }
      </Card>
    </div>
  );
};

export default ResourceCards;
