import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const CreateDatabase = ({
  serverDetails,
  serverDBdata,
  getServerDetails,
  getDBS,
}: {
  serverDetails: any;
  serverDBdata: any;
  getServerDetails: any;
  getDBS: any;
}) => {
  console.log(serverDetails);
  console.log(serverDBdata);

  const [name, setname] = useState<string>("");
  const [remote, setRemote] = useState<string>("%");
  const [host, setHost] = useState<any>({
    hostname: "",
    nodeId: serverDetails.node,
  });
  const createDatabase = async (name: any, remote: any) => {
    if (!remote) remote = "%";
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/database/${
          serverDetails.identifier
        }`,
        {
          database: name,
          remote,
        },
        {
          withCredentials: true,
        }
      );
      toast.success("Database Created", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      await getDBS();
      setname("");
      setRemote("");

      setRemote("%");
    } catch (error) {
      toast.error("Error Creating Database", {
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
    <div className=" bg-[#0a1a2b] p-4 rounded-lg ml-1 w-full flex flex-col">
      <div>Create New Database</div>
      <div className="mt-2">
        <Input
          type="text"
          placeholder="Enter the Name for the database ...."
          className="dark:bg-[var(--quinary-color)]  dark:text-gray-300"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
        {name && name.includes(" ") ? (
          <p className="text-red-500 text-xs ml-6">
            *Server name can only consists of letters, numbers, and dashes.
          </p>
        ) : null}
      </div>
      <div className="mt-2">
        <Input
          type="text"
          placeholder="leave Empty to allow all.."
          className="dark:bg-[var(--quinary-color)]  dark:text-gray-300"
          value={remote}
          onChange={(e) => setRemote(e.target.value)}
        />
      </div>
      <div className="mt-2 ml-auto cursor-pointer">
        <Button
          onClick={async () => {
            await createDatabase(name, remote);
          }}
          disabled={!name}
        >
          Create Database
        </Button>
      </div>
    </div>
  );
};
const DatabaseCard = ({
  database,
  getDatabases,
  identifier,
  deleteDatabase,
}: {
  database: any;
  getDatabases: any;
  identifier: any;
  deleteDatabase: any;
}) => {
  const roratePassword = async () => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/client/server/database/password/${identifier}/${database.id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Password Rotated", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getDatabases();
    } catch (error) {
      toast.error("Error Rotating Password", {
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
    <div className="w-[800px] bg-[var(--quinary-color)] flex justify-between mb-3 p-4 rounded-lg    ">
      <div className="flex gap-3 items-center">
        <i className="fa text-xl fa-hdd-o" aria-hidden="true"></i>
        <div className="text-xl"> {database.name} </div>
      </div>
      <div className="flex gap-4 items-center">
        {/* <Button color="warning" variant="contained" className="mr-2" >Open</Button> */}
        <Drawer>
          <DrawerTrigger>
            <Button color="warning" className="mr-2">
              Open
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Database [{database.name}] </DrawerTitle>
              <DrawerDescription>
                Here you will get all the information about the database.
              </DrawerDescription>
            </DrawerHeader>

            <div className="m-2">
              <div>Endpoint</div>
              <div
                className="cursor-pointer mt-1"
                onClick={() => {
                  navigator.clipboard.writeText(
                    database.host.address + ":" + database.host.port
                  );
                  toast.success("Endpoint Copied");
                }}
              >
                <div className="bg-[var(--quinary-color)] p-2 rounded-lg">
                  {database.host.address + ":" + database.host.port}
                </div>
              </div>
              <div className="mt-2">Connection From</div>
              <div
                className="cursor-pointer  mt-1"
                onClick={() => {
                  navigator.clipboard.writeText(database.connections_from);
                  toast.success("Connections From Copied");
                }}
              >
                <div className="bg-[var(--quinary-color)] p-2 rounded-lg">
                  {database.connections_from}
                </div>
              </div>

              <div className="mt-2">Username</div>
              <div
                className="cursor-pointer mt-1"
                onClick={() => {
                  navigator.clipboard.writeText(database.username);
                  toast.success("Username Copied");
                }}
              >
                <div className="bg-[var(--quinary-color)] p-2 rounded-lg">
                  {database.username}
                </div>
              </div>

              <div className="mt-2">Password</div>
              <div
                className="cursor-pointer mt-1"
                onClick={() => {
                  navigator.clipboard.writeText(
                    database.relationships.password.attributes.password
                  );
                  toast.success("Password Copied");
                }}
              >
                <div className="bg-[var(--quinary-color)] p-2 rounded-lg">
                  {database.relationships.password.attributes.password}
                </div>
              </div>
            </div>

            <DrawerFooter>
              <Button onClick={async () => await roratePassword()}>
                Rotate Password
              </Button>
              <DrawerClose>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Button
          onClick={() => deleteDatabase(database.id)}
          color="error"
          className="mr-2"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

const Database = ({
  serverDetails,
  serverDBdata,
  getServerDetails,
}: {
  serverDetails: any;
  serverDBdata: any;
  getServerDetails: any;
}) => {
  const [open, setOpen] = useState(false);
  const [databases, setDatabases] = useState<any>(null);
  const getDatabases = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/databases/${
          serverDetails.identifier
        }`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data.data);
      setDatabases(response.data.data.data);
    } catch (error) {}
  };
  const deleteDatabase = async (id: any) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/database/${
          serverDetails.identifier
        }/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Database Deleted", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getDatabases();
    } catch (error) {
      toast.error("Error Deleting Database", {
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
      await getDatabases();
    })();
  }, []);
  return (
    <div className="w-full flex flex-col gap-2">
      <ToastContainer />
      <div className="w-[50%]">
        <CreateDatabase
          getServerDetails={serverDetails}
          serverDetails={serverDetails}
          serverDBdata={serverDBdata}
          getDBS={getDatabases}
        />
      </div>
      <div className=" bg-[#0a1a2b] p-4 rounded-lg ml-1  flex flex-col w-[50%]">
        <div className="mt-2">Active Databases</div>
        <div className="mt-2">
          {databases
            ? databases.map((database: any) => {
                return (
                  <DatabaseCard
                    getDatabases={getDatabases}
                    identifier={serverDetails.identifier}
                    deleteDatabase={deleteDatabase}
                    database={database.attributes}
                    key={database.name}
                  />
                );
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default Database;
