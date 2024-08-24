import Navbar from "@/components/Navbar";
import { ModeToggle } from "@/components/mode-toggle";
import Footer from "@/shared/Footer";
import Header from "@/shared/Header";
import { Button } from "@/components/ui/button";
import { Outlet, useNavigate } from "react-router-dom";
import { ArrowRight, AlignJustify } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spotlight } from "@/components/ui/Spotlight";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { setIsLoggedIn, setUserData } from "@/slice/userSlice";
import { useEffect, useState } from "react";

interface RouterOption {
  name: string;
  path: string;
  children?: RouterOption[];
}

const routerOption: RouterOption[] = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Plans",
    path: "/plans",
    children: [
      { name: "Free", path: "/free" },
      { name: "Basic", path: "/basic" },
      { name: "Silver", path: "/silver" },
      { name: "Gold", path: "/gold" },
    ],
  },
  { name: "Affilates", path: "/affilates" },
  { name: "Annoucement", path: "/announcement" },
  { name: "Contact Us", path: "/contact-us" },
 
];

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const getUserDetails = async () => {
    try {
      //console.log('Calling getUserDetails')
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/get-user`, {} , {
        withCredentials: true,
      })
      //console.log('Response: ',response.data)
      
      
      
      dispatch(setUserData(response.data.data))
      return response.data.data
    } catch (error  :any) {
      //console.log(error)
      try {
        
          await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/reload-jwt` , {} , {
            withCredentials: true,
          })
          return await getUserDetails();
       
      } catch (error) {
        
      }
    }
  }
  useEffect(() => {
    (async() => {
      await getUserDetails();
    })()
  },[])

  const logoutHandler = async () => {
    try {
      // axios.defaults.withCredentials = true;
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/logout`,{}, {
        withCredentials: true,
       
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("token")}`,
          
        // }
       
      });
      //console.log(response.data)

     
      localStorage.removeItem("token");
      dispatch(setIsLoggedIn(false));
      dispatch(setUserData(null))
    } catch (error) {
      //console.log(error);
    }
  }



  useEffect(() => {
    if(localStorage.getItem("token")){
      dispatch(setIsLoggedIn(true));
      
    }
  })

  return (
    <div className="mt-6">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />
      <div className=" flex items-center justify-center gap-4 lg:gap-8">
        <div className="ml-12 ">
          <Sheet>
            <SheetTrigger asChild>
              <AlignJustify className="block lg:hidden" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="text-[var(--primary-color)] dark:text-[var(--secondary-color)]">
                <SheetTitle>How2MC GSM</SheetTitle>
                <SheetDescription>
                  <p className="  text-[var(--primary-color)] dark:text-[var(--secondary-color)]">
                    How2MC GSM is a Game Server Management System that allows
                    you to manage your game servers easily.
                  </p>
                </SheetDescription>
              </SheetHeader>
              <div>
                {routerOption
                .filter(item => isLoggedIn || item.name !== "Dashboard")
                .map((item) => (
                  
                  <div key={item.name}>
                    <Button onClick={() => navigate(item.path )} variant="outline" className="w-full mt-3">
                      {item.name}
                    </Button>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <Header className="roboto-slab-900 text-lg w-full lg:text-3xl uppercase dark:text-[var(--secondary-color)] light:text-[var(--primary-color)]" />

        <div className="relative w-full flex items-center justify-center">
          <Navbar className="hidden lg:block md:top-2 lg:top-6" />
          <p className="text-black dark:text-white"></p>
        </div>

        <ModeToggle />

        {isLoggedIn ? (
          <Button 
            onClick={logoutHandler}
          variant="default" className="dark:border-gray-400 rounded-lg">
            Logout&nbsp;
          </Button>
        ) : (
          <Button
            onClick={() => {
              navigate("/sign-up");
            }}
            variant="outline"
            className="dark:border-gray-400 rounded-lg"
          >
            Client Area&nbsp;
            <ArrowRight />
          </Button>
        )}

        {/* Client Area &nbsp; */}

        <div className="lg:mx-6 mx-4 "></div>
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
