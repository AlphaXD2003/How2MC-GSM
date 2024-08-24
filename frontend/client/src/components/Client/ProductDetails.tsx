import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProductPlanCard from './ProductPlanCard';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch } from 'react-redux';
import { setPaymentType } from '@/slice/orderSlice';
const ProductDetails = () => {
    const  productCategoryId  = useParams().id
    // console.log(productCategoryId)
    const dispatch = useDispatch()
    const [plans, setPlans] = useState<any>([]);
    
    const getPlans = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/products-category/${
            productCategoryId
          }/products`,
          {
            withCredentials: true,
          }
        );
        // console.log(response.data.data);
        setPlans(response.data.data);
      } catch (error) {
        toast.error("Getting the plans failed!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };
  
    useEffect(() => {
      (async () => {
        await getPlans();
      })();
    }, []);
  
  return (
    <div className="lg:ml-3 ">
      <div className="flex flex-row items-center justify-between  lg:mx-3  lg:mt-4 mx-1 ">
        <div className="lg:text-lg font-bold flex flex-col gap-1">
          Product Buy Page
          <div className="text-md text-gray-500">
            This page shows the details of the product you want to buy.
          </div>
        </div>
        <div>
        <div>
          {/* <Select
            onValueChange={(v : any) => {
              dispatch(setPaymentType(v))
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select a Payment Method</SelectLabel>
                <SelectItem value="razorpay">Razorpay</SelectItem>
                {/* <SelectItem value="stripe">Stripe</SelectItem> */}
              {/* </SelectGroup>
            </SelectContent>
          </Select> */} 
        </div>
        </div>
       
      </div>
      <div className='mt-3 flex flex-wrap gap-4 '>
        {
            plans &&
            plans.map((plan: any, index: number) => {
                return <ProductPlanCard key={index} plan={plan} />
            })
        }
      </div>
      </div>
  )
}

export default ProductDetails