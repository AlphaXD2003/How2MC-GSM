import { Button } from "@/components/ui/button";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Manage = ({
  serverDetails,
  serverDBdata,
  getServerDetails,
}: {
  serverDetails: any;
  serverDBdata: any;
  getServerDetails: any;
}) => {
  console.log(serverDBdata);
  console.log(serverDetails);
  const navigate = useNavigate();
  const deleteServer = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/servers/delete/safe/${
          serverDetails.id
        }`
      );
      toast.success("Server Deleted", {
        position: "bottom-right",
        hideProgressBar: false,
        autoClose: 5000,
      });
      setTimeout(() => {
        navigate("/dashboard/admin");
      }, 2 * 1000);
    } catch (error) {
      toast.error("Error while deleting the server", {
        position: "bottom-right",
        hideProgressBar: false,
        autoClose: 5000,
      });
    }
  };

  const [rs, setRS] = useState(false);
  const reinstallServer = async () => {
    try {
      setRS((prev) => !prev);
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/reinstall/${
          serverDetails.identifier
        }`,
        {
          withCredentials: true,
        }
      );
      toast.warning("Server is getting reinstalled!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        setRS((prev) => !prev);
        toast.success("Server is reinstalled!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }, 5 * 1000);
    } catch (error) {}
  };

  const unsuspendServer = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/servers/unsuspend/${
          serverDetails.id
        }`
      );
      toast.success("Server Unsuspended", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();
    } catch (error) {
      toast.error("Server unsuspension failed", {
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
  const suspendServer = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/servers/suspend/${
          serverDetails.id
        }`
      );
      toast.success("Server Suspended", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();
    } catch (error) {
      toast.error("Server suspension failed", {
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
  return (
    <div className="flex flex-wrap w-full gap-4">
      <ToastContainer />
      <div className="w-[400px] bg-[#0a1a2b] p-2 rounded-lg ">
        <div className="bg-[var(--quinary-color)] px-2 py-2 rounded-lg border border-t-red-700">
          Delete Server
        </div>
        <p className="mt-2 dark:text-gray-500 text-sm">
          This will reinstall the server with the assigned service scripts.
          Danger! This could overwrite server data.
        </p>
        <div className="mt-2 w-full flex mb-1 ">
          <div className="ml-auto mr-1 mt-auto ">
            <Button
              className="text-white font-bold bg-red-700 hover:bg-red-800"
              color="red"
              onClick={async () => {
                await deleteServer();
              }}
            >
              Delete Server
            </Button>
          </div>
        </div>
      </div>

      {serverDetails.suspended ? (
        <div className="w-[400px] bg-[#0a1a2b] p-2 rounded-lg ml-1">
          <div className="bg-[var(--quinary-color)] px-2 py-2 rounded-lg border border-t-yellow-300">
            Unsuspend Server
          </div>
          <p className="mt-2 dark:text-gray-500 text-sm">
            This will suspend the server, stop any running processes, and
            immediately block the user from being able to access their files or
            otherwise manage the server through the panel or API.
          </p>
          <div className="mt-2 w-full flex mb-1 ">
            <div className="ml-auto mr-1">
              <Button
                className="text-white font-bold bg-yellow-500 hover:bg-yellow-600"
                color="red"
                onClick={async () => await unsuspendServer()}
              >
                Unsuspend Server
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-[400px] bg-[#0a1a2b] p-2 rounded-lg ml-1">
          <div className="bg-[var(--quinary-color)] px-2 py-2 rounded-lg border border-t-yellow-300">
            Suspend Server
          </div>
          <p className="mt-2 dark:text-gray-500 text-sm">
            This will suspend the server, stop any running processes, and
            immediately block the user from being able to access their files or
            otherwise manage the server through the panel or API.
          </p>
          <div className="mt-2 w-full flex mb-1 ">
            <div className="ml-auto mr-1">
              <Button
                className="text-white font-bold bg-yellow-500 hover:bg-yellow-600"
                color="red"
                onClick={async () => await suspendServer()}
              >
                Suspend Server
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-[400px] bg-[#0a1a2b] p-2 rounded-lg ml-1">
        <div className="bg-[var(--quinary-color)] px-2 py-2 rounded-lg border border-t-red-500">
          Reinstall Server
        </div>
        <p className="mt-2 dark:text-gray-500 text-sm">
          This will suspend the server, stop any running processes, and
          immediately block the user from being able to access their files or
          otherwise manage the server through the panel or API.
        </p>
        <div className="mt-2 w-full flex mb-1 ">
          <div className="ml-auto mr-1">
            <Button
              onClick={async () => {
                await reinstallServer();
              }}
              disabled={rs}
              className="text-white font-bold bg-red-500 hover:bg-red-600"
              color="red"
            >
              Reinstall Server
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
