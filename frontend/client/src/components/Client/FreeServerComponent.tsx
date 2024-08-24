import {
  Table,
  TableBody,

  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import {  useEffect,  useState } from "react";


import { ChevronDownIcon } from "@heroicons/react/20/solid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SuccessToastConatiner from "../toaster/SuccessToastConatiner";
import { Bounce, toast } from "react-toastify";
import { Edit2, Trash2 } from "lucide-react";
import { IconLockOpen } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { setLimits } from "@/slice/serverSlice";
import { useUserLimits } from "@/custom functions/getUserLimits";
import { useDispatch } from "react-redux";


const FreeServerComponent = () => {
  const [freeServers, setFreeServers] = useState<any>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const fetchFreeServers = async () => {
    try {
      const response = await axios.get(
        "https://localhost:5000/api/v1/servers/user/free",
        {
          withCredentials: true,
        }
      );
      setFreeServers(response.data.data);
     
    } catch (error) {
     
      setError(error);
    }
  };

  const [fetchAgain, setFetchAgain] = useState<boolean>(false);
  useEffect(() => {
    fetchFreeServers();
  }, [fetchAgain]);

  return (
    <div className="lg:mb-8 mr-2 mt-4">
      <Table>
        {/* <TableCaption>A List of Free Servers</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead className="text-right">Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {freeServers
            ? freeServers.map((server: any) => (
                <TableRow key={server.server_id}>
                  <TableCell className="font-medium ">
                    {server.server_name}
                  </TableCell>
                  <TableCell>Free</TableCell>
                  <TableCell className="">{`${
                    server.serverInfo.cpu / 100
                  } vCPU   ${server.serverInfo.ram}GB RAM   ${Math.floor(
                    server.serverInfo.disk / 1024
                  )}GB Disk`}</TableCell>
                  <TableCell className="text-right h-20 mb-1">
                    <Example
                      server_id={server.server_id}
                      setFetchAgain={setFetchAgain}
                    />
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
      <SuccessToastConatiner theme="dark" />
    </div>
  );
};

function Example({
  server_id,
  setFetchAgain,
}: {
  server_id: any;
  setFetchAgain: any;
}) {
    
  const dispatch = useDispatch()
  const handleDeleteServer = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/servers/delete/safe/${server_id}`,
        {
          withCredentials: true,
        }
      );
      
    if (response.data.data === true) {
      toast.success(' Server Deleted Successfully', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
      setFetchAgain((prev : boolean) => !prev);
      const [userLimits, error] = await useUserLimits() ;
      if(userLimits && !error){
     
        dispatch(setLimits(userLimits))
      }
    } else {
      alert("Server Deleted Failed");
    }

     
    } catch (error) {
      toast.error(' Server Deletion Failed', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        });
    }
    
  };

  const navigate = useNavigate()

  const openServer = () => {
    navigate(`/server/${server_id}`)
  }
  const editServer = () => {
    navigate(`/dashboard/edit-server/${server_id}`)
  }

  return (
    <div className="flex">
      <div className="ml-auto">
      <DropdownMenu >
      <DropdownMenuTrigger className="flex flex-row gap-2">
        <div>Methods</div>
        <ChevronDownIcon className="w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={openServer} className="flex flex-row gap-2"> <IconLockOpen className="w-5" /> Open</DropdownMenuItem>
        <DropdownMenuItem onClick={editServer} className="flex flex-row gap-2"> <Edit2 className="w-4" /> Edit</DropdownMenuItem>
        <DropdownMenuItem className="flex flex-row gap-2" onClick={handleDeleteServer}> <Trash2 className="w-4" /> Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      </div>
    </div>
  );
}

function EditInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function EditActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
    </svg>
  );
}

function DuplicateActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 4H12V12H4V4Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path
        d="M8 8H16V16H8V8Z"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
    </svg>
  );
}

function ArchiveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function ArchiveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="8"
        width="10"
        height="8"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <rect
        x="4"
        y="4"
        width="12"
        height="4"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function MoveActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

function DeleteInactiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#EDE9FE"
        stroke="#A78BFA"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
    </svg>
  );
}

function DeleteActiveIcon(props: any) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#8B5CF6"
        stroke="#C4B5FD"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
    </svg>
  );
}

export default FreeServerComponent;
