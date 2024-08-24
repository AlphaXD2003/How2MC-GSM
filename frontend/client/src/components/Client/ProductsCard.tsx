import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { setLocationId, setProductCategoryId } from "@/slice/orderSlice";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { setLocationId as setLocId } from "@/slice/orderSlice";

const ProductsCard = ({
  productsCategory,
  locations = [],
}: {
  productsCategory: any;
  locations: any;
}) => {
  console.log(locations);
  console.log(productsCategory);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [locationId, setLocationId] = useState<any>(null)

  const onLocationValueChange = (value: any) => {
    console.log(value)
    setLocationId(value)
  }

  return (
    <div className="w-[400px] flex flex-col min-h-[200px] m-4 p-4 border-2 border-gray-700 rounded-lg bg-[var(--quinary-color)]">
      <div className="relative w-full h-full">
        <img
          src={productsCategory.image}
          alt={productsCategory.name}
          className="w-[400px]  object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col mt-3">
          <h1 className="text-xl font-bold">{productsCategory.name}</h1>
          <p className="text-sm text-gray-500">
            {productsCategory.description}
          </p>
        </div>
        <div className="mt-3 location cursor-pointer">
          <Select
            onValueChange={onLocationValueChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Location</SelectLabel>

                {locations.map((location: any, index: number) => {
                  return (
                    <SelectItem value={location.id} key={index}>
                      {location.long}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
       
        
        <div className="flex items-center justify-between mt-3 ml-auto">
          
          <Button
          disabled={!locationId}
          onClick={() => {
            if (locationId) {
              console.log(locationId)
           dispatch(setLocId(locationId))
           dispatch(setProductCategoryId(productsCategory._id))
            navigate(`/dashboard/shop/${productsCategory._id}`)
            }
          }}
          color="success"
         >
            PROCEED
          </Button>
          
        </div>
      </div>
      
    </div>
  );
};

export default ProductsCard;
