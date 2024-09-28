import axios from "axios";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@mui/material";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../ui/animated-modal";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

import { BookOpenIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { toast, Bounce, ToastContainer } from "react-toastify";
import fs from "fs";
import https from "https";
const Servers = () => {
  const navigate = useNavigate();
  const [servers, setServers] = React.useState([]);

  const getUsersServer = async () => {
    // const key = fs.readFileSync(
    //   `/home/subhamoy/Coding/Projects/How2MC-GSM/backend/localhost-key.pem`
    // );
    // const cert = fs.readFileSync(
    //   `/home/subhamoy/Coding/Projects/How2MC-GSM/backend/localhost.pem`
    // );

    // const httpsAgent = new https.Agent({
    //   cert,
    //   key,
    // });
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/servers/user/servers`,
      {
        withCredentials: true,
        // httpsAgent,
      }
    );
    //console.log(response.data.data)
    setServers(response.data.data);
  };

  const getServerDetails = async (serverId: Number) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/servers/info/${serverId}`,
      {
        withCredentials: true,
      }
    );
    //console.log(response.data.data)
    const sid = response.data.data.server_id;

    const serverInfo = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/servers/details/${sid}`,
      {
        withCredentials: true,
      }
    );
    //console.log(serverInfo.data.data)
  };

  const deleteServer = async (serverId: Number) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/servers/delete/safe/${serverId}`,
        {
          withCredentials: true,
        }
      );
      toast.success("Server Deleted Successfully", {
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
    } catch (error) {
      toast.error("Server Deletion Failed", {
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

  useEffect(() => {
    (async () => {
      await getUsersServer();
    })();
  }, []);
  return (
    <div className="ml-2">
      <ToastContainer />
      <Table>
        <TableCaption>A list of all of your servers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="">Server Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            {/* <TableHead className="text-right">Method</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {servers
            ? servers.map((server: any, index: Number) => (
                <TableRow key={server.server_id || index}>
                  <TableCell className="font-medium">
                    {server.server_id}
                  </TableCell>
                  <TableCell>{server.server_name.toUpperCase()}</TableCell>
                  <TableCell>
                    {server.serverInfo.status.toUpperCase()}
                  </TableCell>
                  <TableCell>Credit Card</TableCell>

                  <TableCell className="w-[100px]">
                    <Modal>
                      <ModalTrigger className="bg-black dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                        <span
                          onClick={() => getServerDetails(server.server_id)}
                          className="group-hover/modal-btn:translate-x-40 text-center transition duration-500"
                        >
                          DETAILS
                        </span>
                        <div className="-translate-x-40 group-hover/modal-btn:translate-x-0 flex items-center justify-center absolute inset-0 transition duration-500 text-white z-20">
                          ✈️
                        </div>
                      </ModalTrigger>
                      <ModalBody>
                        <ModalContent>
                          <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
                            Server Details of{" "}
                            <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
                              {server.server_name.toUpperCase()}
                            </span>{" "}
                            [{server.serverInfo.status.toUpperCase()}]
                          </h4>
                          <div className="flex justify-center items-center"></div>
                          <div className="text-xl">
                            <div className="bg-[var(--semi-dark2)] p-2 rounded-lg">
                              <div className="mb-2">
                                Server ID: {server.server_id}
                              </div>
                              <div className="mb-2">
                                Server Name: {server.server_name.toUpperCase()}
                              </div>
                              <div className="mb-2">
                                Server Type:{" "}
                                {server.serverInfo.status.toUpperCase()}
                              </div>
                            </div>

                            <div className="mb-2 mt-6">
                              <div className="underline font-bold">
                                Resources:
                              </div>{" "}
                              {Object.entries(server.serverInfo).map(
                                ([key, value]: any, index: Number) => {
                                  if (key === "lastRenewed") {
                                    // Parse the value as a date and format it
                                    const date = new Date(value);
                                    const formattedDate =
                                      date.toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      });
                                    return (
                                      <div key={key} className="grid">
                                        <div className="mb-2 flex flex-row gap-4">
                                          <div className="text-gray-400">
                                            {key.toUpperCase()}:{" "}
                                          </div>
                                          <div>{formattedDate}</div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    // Handle other keys as before
                                    return (
                                      <div key={key}>
                                        <div className="mb-2 flex gap-2">
                                          <div className="text-gray-400">
                                            {key.toUpperCase()}:{" "}
                                          </div>

                                          <div>
                                            {value
                                              .toLocaleString()
                                              .toUpperCase()}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  }
                                }
                              )}
                            </div>
                          </div>
                        </ModalContent>
                        {/* <ModalFooter className="gap-4">
                                                    <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
                                                        Cancel
                                                    </button>
                                                    <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
                                                        Save Changes
                                                    </button>
                                                </ModalFooter> */}
                      </ModalBody>
                    </Modal>
                  </TableCell>
                  <TableCell className="w-[100px]">
                    <Button
                      onClick={() =>
                        navigate(`/dashboard/servers/${server.server_id}`)
                      }
                      variant="contained"
                      color="warning"
                    >
                      OPEN
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Menu>
                      <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                        Options
                        <ChevronDownIcon className="size-4 fill-white/60" />
                      </MenuButton>

                      <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                      >
                        {server.serverInfo.status === "free" ? (
                          <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                              <PencilIcon className="size-4 fill-white/30" />
                              Edit
                              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd> */}
                            </button>
                          </MenuItem>
                        ) : (
                          <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                              <PlusIcon className="size-4 fill-white/30" />
                              Upgrade
                              {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd> */}
                            </button>
                          </MenuItem>
                        )}
                        {/* <MenuItem>
                                                        <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                                            <Square2StackIcon className="size-4 fill-white/30" />
                                                            Duplicate
                                                            <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                                                        </button>
                                                    </MenuItem> */}
                        {/* <div className="my-1 h-px bg-white/5" /> */}
                        <MenuItem>
                          <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <BookOpenIcon className="size-4 fill-white/30" />
                            Open
                            {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd> */}
                          </button>
                        </MenuItem>
                        <MenuItem>
                          <button
                            onClick={async () => {
                              await deleteServer(server.server_id);
                              await getUsersServer();
                            }}
                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10"
                          >
                            <TrashIcon className="size-4 fill-white/30" />
                            Delete
                            {/* <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd> */}
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
};

export default Servers;
