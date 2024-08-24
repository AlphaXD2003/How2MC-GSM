import ProductsCard from "@/components/Client/ProductsCard";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

const Products = () => {
  
  const [productsCategories, setProductsCategories] = useState<any>([]);

  const [locations, setLocations] = useState<any>([]);
  const getAllProductsCategories = async () => {
    try {
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/products/products-category`, {
        withCredentials: true
      })
      console.log(response.data.data)
      setProductsCategories(response.data.data)

      
    } catch (error) {
      console.log(error); 
      toast.error("Error fetching products", { 
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    }
  }


  const getAllLocations = async () => {
    try {
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/location`, {
        withCredentials: true
      })
      // console.log(response.data.data)

      setLocations(() => response.data.data.filter((item: any) => item.nodes.length > 0))

      // setLocations(response.data.data)

      
    } catch (error) {
      console.log(error); 
    }
  }

  useEffect(() => {
   ;(async () => {
    await getAllProductsCategories()
    await getAllLocations()
  
   })();
  }, [])

  useEffect(() => {
    console.log(locations)
  }, [locations])

  return (
    <div className="lg:ml-3">
      <div className="flex flex-row items-center justify-between  lg:mx-3  lg:mt-4 mx-1 ">
        <div className="lg:text-lg font-bold flex flex-col gap-1">
          Products
          <div className="text-md text-gray-500">
            Buy gaming servers from our store. We support variety of games.
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 mt-4 ml-3">
        {
          productsCategories && locations &&
          productsCategories.map((item: any, index: number) => {
            return (
              <ProductsCard 
              locations = {locations}
              productsCategory={item} key={index} />
            )
          })
        }
      </div>
      <ToastContainer />
    </div>
  );
};

export default Products;
