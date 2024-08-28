import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutServer from "./AboutServer";
import { Audio } from "react-loader-spinner";
import ServerDetails from "./ServerDetails";
import BuildConfiguration from "./BuildConfiguration";
import Startup from "./Startup";
import Database from "./Database";
import Manage from "./Manage";

const ServerEdit = () => {
  const id = useParams().id;

  const [serverDBdata, setServerDBdata] = useState<any>(null);
  const [serverDetails, setServerDetails] = useState<any>(null);
  const getServerDetails = async () => {
    try {
      const response1 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/servers/info/${id}`
      );
      console.log(response1.data.data);
      setServerDBdata(response1.data.data);
      const response2 = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/servers/details/${id}`
      );
      console.log(response2.data.data);
      setServerDetails(response2.data.data);
    } catch (error) {}
  };
  useEffect(() => {
    (async () => {
      await getServerDetails();
    })();

    return () => {
      setServerDBdata(null);
      setServerDetails(null);
    };
  }, []);
  if (!serverDBdata || !serverDetails) {
    return <Audio />;
  }
  return (
    <div className="flex flex-row items-center justify-between w-full   ">
      <div className="lg:text-lg font-bold flex w-full flex-col gap-1  ">
        Server Edit Dashboard
        <div className="text-md text-gray-500">
          This dashboard helps to edit the server details.
        </div>
        <Tabs defaultValue="about" className="w-full mt-2">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="build">Build Configuration</TabsTrigger>
            <TabsTrigger value="startup">Startup Configuration</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <AboutServer
              serverDetails={serverDetails}
              serverDBdata={serverDBdata}
            />
          </TabsContent>
          <TabsContent value="details">
            <ServerDetails
              serverDetails={serverDetails}
              serverDBdata={serverDBdata}
              getServerDetails={getServerDetails}
            />
          </TabsContent>
          <TabsContent value="build">
            <div className="w-full">
              <BuildConfiguration
                serverDetails={serverDetails}
                serverDBdata={serverDBdata}
                setServerDetails={setServerDetails}
                setServerDBdata={setServerDBdata}
                getServerDetails={getServerDetails}
              />
            </div>
          </TabsContent>
          <TabsContent value="startup">
            <div className="w-full">
              <Startup
                serverDetails={serverDetails}
                serverDBdata={serverDBdata}
                getServerDetails={getServerDetails}
              />
            </div>
          </TabsContent>
          <TabsContent value="database">
            <div className="w-full">
              <Database
                serverDetails={serverDetails}
                serverDBdata={serverDBdata}
                getServerDetails={getServerDetails}
              />
            </div>
          </TabsContent>
          <TabsContent value="manage">
            <div className="w-full">
              <Manage
                serverDetails={serverDetails}
                serverDBdata={serverDBdata}
                getServerDetails={getServerDetails}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ServerEdit;
