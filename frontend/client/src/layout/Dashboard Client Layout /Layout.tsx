
import { Outlet, useNavigate } from "react-router-dom";
import Header from "@/shared/Dashboard Client/Header";

import Sidebar from "@/shared/Dashboard Client/Sidebar";
import SmallSidebar from "@/components/Client/SmallSidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "@/slice/userSlice";
import { RootState } from "@/store/store";
import { useUserLimits } from "@/custom functions/getUserLimits";
import { setLimits } from "@/slice/serverSlice";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "@/components/Admin/columns";

interface UserTableProps <T> {
  columns: ColumnDef<T>[]
  data: T[]
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  IP: string;
  pteroId: string;
  role: string;
  coins: Number;
}

const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userSelector = useSelector((state : RootState) => state.user.user)

  const [firstName, setFirstName] = useState<string | null>("")
  const [lastName, setLastName] = useState<string | null>("")



  // function to get user details
  const getUserDetails = async () => {
    try {
      const response = await axios.post('https://localhost:5000/api/v1/users/get-user', {} , {
        withCredentials: true,
      })
      
      
      dispatch(setUserData(response.data.data))
      return response.data.data
    } catch (error) {
      
    }
  }
  
  
  // To check whether the token is present in local storage or not
  useEffect(() => {
  
    if(!localStorage.getItem("token")){
      navigate("/sign-in")
      return
    }
    // If the token is present in local storage, then we find some user details
    const accessToken = localStorage.getItem("token");

    let userDetails : User ;
    (async () => {
      if(!accessToken) return;
      userDetails = await getUserDetails();
      
      if(userDetails){
        setFirstName(userDetails.firstName)
        setLastName(userDetails.lastName)
      }
    })()
  }, [])

  // To store user limits in the state

  useEffect(() =>{
    (async() => {
      const [userLimits, error] = await useUserLimits() ;
      if(userLimits && !error){
     
        dispatch(setLimits(userLimits))
      }
    })()
    
  },[])

  



  return (
    <>
        <div className="flex flex-row h-screen">
      <div className="h-screen border overflow-hidden ">
        <Sidebar />
      </div>

      <div className="flex flex-col w-full">
        <div className="hidden lg:block">

        <Header />
        </div>
        <div className="flex justify-between  items-center mr-3  lg:hidden ml-3 lg:ml-0">
            <SmallSidebar />
            <Header />
        </div>
        <div className="flex-1    overflow-y-auto ml-3 lg:ml-1 mt-6 lg:mt-2    ">
         
          <Outlet />
        </div>
      </div>
    </div>
        {/* <Footer /> */}
    </>
  );
};

export default Layout;
