import { useSelector } from "react-redux";
import ResourceCards from "./Client/ResourceCards";
import { Button } from "./ui/button";
import { RootState } from "@/store/store";
import { useEffect, useState } from "react";

import { freeResource } from "@/configs/freeResource";
import FreeServerComponent from "./Client/FreeServerComponent";
import Footer from "./Client/Footer";
import { useNavigate } from "react-router-dom";



const DashBoardComponent = () => {
  const limits = useSelector((state: RootState) => state.server.limits);
  //console.log(limits)

  const [maxFreeLimit, setMaxFreeLimit] = useState(freeResource);
  const navigate = useNavigate();
  const [totalUsedCPU, setTotalUsedCPU] = useState(0);
  const [totalUsedMemory, setTotalUsedMemory] = useState(0);
  const [totalUsedStorage, setTotalUsedStorage] = useState(0);
  const [totalUsedBackups, setTotalUsedBackups] = useState(0);
  const [totalUsedDatabase, setTotalUsedDatabase] = useState(0);
  const [totalUsedAllocation, setTotalUsedAllocation] = useState(0);



  const OpenServer = () => {
    navigate("/dashboard/add-server");
  };

  useEffect(() => {
    const usedCPU = limits.reduce(
      (acc: Number, item: any) => acc + item.cpu,
      0
    );
    setTotalUsedCPU(usedCPU);
    const usedMemory = limits.reduce(
      (acc: Number, item: any) => acc + item.ram,
      0
    );
    setTotalUsedMemory(usedMemory);
    const usedStorage = limits.reduce(
      (acc: Number, item: any) => acc + item.disk,
      0
    );
    setTotalUsedStorage(usedStorage);
    const usedBackups = limits.reduce(
      (acc: Number, item: any) => acc + item.backup,
      0
    );
    setTotalUsedBackups(usedBackups);
    const usedDatabase = limits.reduce(
      (acc: Number, item: any) => acc + item.database,
      0
    );
    setTotalUsedDatabase(usedDatabase);
    const usedAllocation = limits.reduce(
      (acc: Number, item: any) => acc + item.ports,
      0
    );
    setTotalUsedAllocation(usedAllocation);
  }, [limits]);

  return (
    <div className="lg:ml-3 ">
      <div className="flex flex-row items-center justify-between  lg:mx-3  lg:mt-4 mx-1 ">
        <div className="lg:text-lg font-bold flex flex-col gap-1">
          Dashboard
          <div className="text-md text-gray-500">
            This dashboard shows the usage of resources for the free server.
          </div>
        </div>
       <div>
         
            <Button
            onClick={OpenServer}
              className="dark:bg-[var(--button-color)]  dark:text-white uppercase hover:dark:border-gray-200 hover:dark:shadow-lg hover:dark:bg-[var(--button-color)]"
            >
              Add Server
            </Button>
          
       </div>
      </div>
      
        
     
        
     
      <div className="grid relative grid-cols-2 midlg:grid-cols-3 2xl:grid-cols-3  gap-4 mt-2 mb-2 mr-2 lg:mt-8">
        <ResourceCards
          title="CPU Usage"
          Description="The CPU Usage is the percentage of CPU resources used by the server."
          Current={`${totalUsedCPU}%`}
          Max={`${maxFreeLimit.cpu}%`}
        />
        <ResourceCards
          title="Memory Usage"
          Description="The Memory Usage is the percentage of Memory resources used by the server."
          Current={`${totalUsedMemory}MB`}
          Max={`${maxFreeLimit.memory}MB`}
        />
        <ResourceCards
          title="Storage Usage"
          Description="The Storage Usage is the percentage of Storage resources used by the server."
          Current={`${totalUsedStorage}MB`}
          Max={`${maxFreeLimit.disk}MB`}
        />
        <ResourceCards
          title="Backup Usage"
          Description="The Backups Usage is the percentage of Backups resources used by the server."
          Current={`${totalUsedBackups}`}
          Max={`${maxFreeLimit.backup}`}
        />
        <ResourceCards
          title="Database Usage"
          Description="The Database Usage is the percentage of Database resources used by the server."
          Current={`${totalUsedDatabase}`}
          Max={`${maxFreeLimit.database}`}
        />
        <ResourceCards
          title="Allocation Usage"
          Description="The Allocation Usage is the percentage of Ports resources used by the server."
          Current={`${totalUsedAllocation}`}
          Max={`${maxFreeLimit.ports}`}
        />
      </div>

      <div className="lg:mt-8 text-xl dark:text-gray-200 dark:font-bold ">
        Free Servers
      </div>
      <div className=" text-lg dark:text-gray-500 ">
        Take a look at the free servers.
      </div>

      <div>
        <FreeServerComponent />
      </div>
      <Footer />
    </div>
  );
};

export default DashBoardComponent;
