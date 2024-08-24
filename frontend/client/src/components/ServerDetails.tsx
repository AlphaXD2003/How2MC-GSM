import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Skeleton } from "@/components/ui/skeleton";
import Panel from "./Client/Panel";
import Databases from "./Client/Databases";
import Schedules from "./Client/Schedules";
import Network from "./Client/Network";
import ServerSettings from "./Client/ServerSettings";
import StartupComponent from "./Client/StartupComponent";
import { toast } from "react-toastify";
import Backups from "./Client/Backups";
import FileManager from "./Client/FileManager";

const ServerDetails = () => {
  const [serverId, setServerId] = React.useState<any>(0);
  const [serverInfo, setServerInfo] = React.useState<any>();
  const [loading, setLoading] = React.useState(true);
  const sid = Number(useParams().id);
  const navigate = useNavigate();
  if (!sid)  navigate("/dashboard/servers");
  const [isInstalling, setIsInstalling] = React.useState<any>(null);
  const [identifier, setIdentifier] = React.useState<any>(null);
  const [isOwner, setIsOwner] = React.useState<any>(false);
  const isServerOwner = async () => {
    try {
      console.log(serverId);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/servers/user/isOwner/${serverId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      setIsOwner(response.data.data);
      if (!response.data.data) {
        navigate("/dashboard/servers");
      }
    } catch (error) {
    } finally {
    }
  };
  const getServerDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/servers/info/${serverId}`,
        {
          withCredentials: true,
        }
      );
      console.log(response.data.data);
      setServerInfo(response.data.data);
      const sid = response.data.data.server_id;

      const serverInfo = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/servers/details/${sid}`,
        {
          withCredentials: true,
        }
      );
      //console.log(serverInfo.data.data)
      const info = serverInfo.data.data;
      setIdentifier(info.uuid.split("-")[0]);
      const clientServerInfo = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/details/${
          info.uuid.split("-")[0]
        }`
      );
      //console.log(clientServerInfo.data.data)
      setIsInstalling(clientServerInfo.data.data.is_installing);
      const cinfo = clientServerInfo.data.data;
      setServerInfo((value: any) => {
        return {
          ...value,
          info: {
            ...info,
          },
          clientInfo: {
            ...cinfo,
          },
        };
      });
      // setLoading(false)
    } catch (error) {}
  };

  useEffect(() => {
    if (isInstalling) {
      const intervalId = setInterval(async () => {
        const clientServerInfo = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/client/server/details/${identifier}`
        );
        //console.log(clientServerInfo.data.data.is_installing)
        setIsInstalling(clientServerInfo.data.data.is_installing);
        if (!clientServerInfo.data.data.is_installing) {
          toast.success("Server reinstalled successfully!", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [isInstalling]);
  useEffect(() => {
    if (serverInfo && serverInfo.info && serverInfo.clientInfo) {
      setLoading(false);
    }
  }, [serverInfo]);

  useEffect(() => {
    if (serverId) {
      (async () => {
        await isServerOwner();
      })();
      (async () => {
        await getServerDetails();
      })();
    }
  }, [serverId]);

  useEffect(() => {
    sid && setServerId(sid);
  }, [sid]);

  useEffect(() => {
    setLoading(true);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="ml-2 m-2">
      <div className="flex justify-between items-center">
        <div className="flex flex-col ">
          <div>Welcome to Server Details Page of How2MC GSM</div>
          <div className="text-gray-500">
            {serverInfo.info
              ? `[#${serverInfo.info.uuid.split("-")[0]}]`
              : null}
          </div>
        </div>
        <div className="flex flex-col "></div>
      </div>

      <Tabs defaultValue="panel" className="w-full mt-4">
        <TabsList>
          <TabsTrigger value="panel">Panel</TabsTrigger>
          <TabsTrigger value="files">File Manager</TabsTrigger>
          <TabsTrigger value="database">Databases</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="user">Users</TabsTrigger>
          <TabsTrigger value="backup">Backups</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="startup">Startup</TabsTrigger>
          <TabsTrigger value="setting">Settings</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent className="w-[100%]" value="panel">
          <Panel serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="files">
          <FileManager serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="database">
          <Databases serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="schedule">
          <Schedules serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="user">
          <Users />
        </TabsContent>
        <TabsContent value="backup">
          <Backups serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="network">
          <Network serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="startup">
          <StartupComponent serverInfo={serverInfo} />
        </TabsContent>
        <TabsContent value="setting">
          <ServerSettings
            setIsInstalling={setIsInstalling}
            serverInfo={serverInfo}
          />
        </TabsContent>
        <TabsContent value="activity">
          <Activity />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Users = () => {
  return <div>users</div>;
};

const Activity = () => {
  return <div>activity</div>;
};

export default ServerDetails;
