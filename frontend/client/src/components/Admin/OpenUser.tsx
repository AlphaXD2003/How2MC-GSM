import axios from "axios";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "../ui/input";

import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Divide,
  SeparatorVertical,
  UploadIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import classNames from "classnames";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { UserPaymentTable } from "./User Data Table/data-table";
import { columns } from "./User Data Table/columns";
import { Toast } from "../ui/toast";
import { Divider } from "@mui/material";
const OpenUser = () => {
  const userId = useParams().id;
  // console.log(userId)
  const [userDetails, setUserDetails] = useState<any>(null);
  const [date, setDate] = useState<Date>();
  const [userPayment, setUserPayment] = useState<any>([]);
  const [password, setPassword] = useState<any>(null);
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const fetchUserDetails = async () => {
    try {
      const userRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get-user-info/${userId}`,
        {
          withCredentials: true,
        }
      );
      console.log("User Details", userRes.data.data);
      setUserDetails(userRes.data.data);
      setDate(new Date(userRes.data.data.createdAt));
      setImage(userRes.data.data.avatar);
      await fetchUserPayment(userRes.data.data._id);
    } catch (error) {
      toast.error("Error fetching user details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const fetchUserPayment = async (userId: string) => {
    try {
      setUserPayment([]);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/orders/getOrdersByUserId`,
        {
          userId,
        }
      );
      console.log(response.data.data);
      response.data.data.map((order: any) => {
        setUserPayment((prev: any) => {
          return [
            ...prev,
            {
              id: order._id,
              amount: order.price,
              status: order.status,
              startingDate: `${new Date(
                order.startingDateAndTime
              ).toLocaleDateString()} ${new Date(
                order.startingDateAndTime
              ).toLocaleTimeString()}`,
              endingDate: `${new Date(
                order.endingDateAndTime
              ).toLocaleDateString()} ${new Date(
                order.endingDateAndTime
              ).toLocaleTimeString()}`,
            },
          ];
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async () => {
    try {
    
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/update-user`,
        {
          user_id: userDetails._id,
          username: userDetails.username,
          email: userDetails.email,
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          pteroId: userDetails.pteroId,
          coins: userDetails.coins,
          isAdmin: userDetails.isAdmin,
          avatar: userDetails.avatar,
          createdAt: userDetails.createdAt,
          updatedAt: userDetails.updatedAt,
          isDeleted: userDetails.isDeleted,
          password: userDetails?.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      toast.success("User updated successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
   

      
      await fetchUserDetails();
    } catch (error) {
      toast.error("Error updating user", {
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
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag enter");
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag leave");
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Drag over");
  };

  const handleDrop = async(e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    console.log("Drop");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      console.log(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        console.log(event.target);
        if (event.target?.result) {
          setImage(event.target?.result);
        }
      };
      reader.readAsDataURL(file);
      const formdata = new FormData();
      formdata.append("avatarImage", file);
      formdata.append("user_id", userDetails._id);
      await  axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/update-the-image`, formdata, {
        withCredentials: true,
        headers:{
          "Content-Type": "multipart/form-data"
        }
      });
      toast.success("Image updated successfully", {
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
      await fetchUserDetails();
    })();
  }, []);
  useEffect(() => {
    console.log(date);
  }, [date]);
  if (!userDetails) return <Audio />;
  return (
    <div className="lg:ml-3">
      <div className="flex flex-row items-center justify-between  lg:mx-3  lg:mt-4 mx-1 ">
        <div className="lg:text-lg font-bold flex flex-col gap-1">
          <div className="flex flex-row gap-2 items-center">
            User Management
            <div className="text-md text-gray-500 ">
              {`[${userDetails._id}]`}
            </div>
          </div>
          <div className="text-md text-gray-500">
            Change the user's information.
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-4 ">
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Username
                </label>
                <Input
                  type="text"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails.username}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, username: e.target.value })
                  }
                />
              </div>
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </div>
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Change Password
                </label>
                <Input
                  type="password"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails?.password}
                  placeholder="Enter Password"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  First Name
                </label>
                <Input
                  type="text"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails.firstName}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Last Name
                </label>
                <Input
                  type="text"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails.lastName}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Pterodactyl Id
                </label>
                <Input
                  type="text"
                  className={classNames(
                    dragging ? "border-dashed " : "border-2",
                    "dark:bg-[var(--quinary-color)] w-full rounded-lg p-2  border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  )}
                  value={userDetails.pteroId}
                  disabled
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, pteroId: e.target.value })
                  }
                />
              </div>
              <div className="w-full">
                <label className="block text-md font-medium text-gray-700">
                  Coins
                </label>
                <Input
                  type="text"
                  className="dark:bg-[var(--quinary-color)] w-full rounded-lg p-2 border-2 border-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  value={userDetails.coins}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, coins: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-2">
            <div>
              <Select
              
                onValueChange={(value) => {
                  console.log(value === 'yes')
                  if(value === 'yes'){
                    setUserDetails({ ...userDetails, isAdmin: true });
                  }
                  else{
                    setUserDetails({ ...userDetails, isAdmin: false });
                  }
                  
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent
                  defaultValue={userDetails.isAdmin ? "yes" : "no"}
                >
                  <SelectItem value="no">User</SelectItem>
                  <SelectItem value="yes">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    disabled
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={async(e ) => await handleDrop(e )}
          className=" flex flex-col items-start justify-around"
        >
          <div>
            <div
              className={classNames(
                dragging ? "border-dashed" : "border",
                "mr-6 cursor-pointer flex flex-col border-gray-500 w-[250px] h-[150px] rounded-lg  overflow-hidden"
              )}
            >
              <div className="m-auto"
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={async(e : any) => await handleDrop(e )}
              >
                {!dragging ? (
                  image ? (
                    <img
                      src={`${image}`}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full"
                    />
                  ) : null
                ) : (
                  <div className="border-2 border-dashed border-gray-500 w-full h-[140px] justify-center items-center rounded-lg">
                    <div className="m-auto h-full">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-500 text-xl">
                          <UploadIcon size={"80px"} className="mr-2 " />
                        </div>
                        <div className="text-gray-500 text-sm px-8">
                          Drag and drop your image here
                        </div>
                      </div>
                    
                    </div>
                  </div>
                )}
              </div>
              {!dragging ? (
                <p className="mx-auto mb-2">{` Profile Picture.`}</p>
              ) : null}
            </div>
          </div>
          <div>
            <Button
              onClick={async () => {
                await updateUser();
              }}
            >
              Update Profile
            </Button>
          </div>
        </div>
      </div>
      <Divider className="mx-auto w-full my-2" />
      <div className="mt-8 flex flex-row gap-4 text-xl dark:text-gray-200 dark:font-bold ">
        Payment History of{" "}
        <div className="capitalize"> {userDetails.username}</div>
      </div>
      <div>
        {userPayment.length > 0 ? (
          <UserPaymentTable columns={columns} data={userPayment} />
        ) : (
          <Audio />
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default OpenUser;
