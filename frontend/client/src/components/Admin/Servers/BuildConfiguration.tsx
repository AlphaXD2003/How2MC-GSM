import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, ToastContainer } from "react-toastify";

import ReactSelect from 'react-select'
const LeftPart = ({
  serverDetails,
  serverDBdata,
  setServerDBdata,
  setServerDetails,
}: {
  serverDetails: any,
  serverDBdata: any;
  setServerDBdata: any , 
  setServerDetails: any,
}) => {
  ////console.log(serverDetails);
  ////console.log(serverDBdata);
  const [serverCPULimit, setServerCPULimit] = useState(
    serverDetails.limits.cpu
  );
  const [serverMemoryLimit, setServerMemoryLimit] = useState(
    serverDetails.limits.memory
  );
  const [serverSwapLimit, setServerSwapLimit] = useState(
    serverDetails.limits.swap
  );
  const [serverDiskLimit, setServerDiskLimit] = useState(
    serverDetails.limits.disk
  );
  const [serverBlockIOLimit, setServerBlockIOLimit] = useState(
    serverDetails.limits.io
  );
  const [serverOOMDisabled, setServerOOMDisabled] = useState(
    serverDetails.limits.oom_disabled
  );
  const [serverCPUPinning, setServerCPUPinning] = useState(
    serverDetails.limits.threads
  );

  const updateResourceLimits = async () => {
    try {
     const body = {
       cpu: serverCPULimit,
       memory: serverMemoryLimit,
       swap: serverSwapLimit,
       disk: serverDiskLimit,
       io: serverBlockIOLimit,
       oom_disabled: serverOOMDisabled,
       threads: serverCPUPinning || null,
     }
     ////console.log(body);
     await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/build/${serverDetails.id}`, {
      ...body,
      "allocation": serverDetails.allocation,
      feature_limits:{
        "databases" : serverDetails.feature_limits.databases,
        "allocations" : serverDetails.feature_limits.allocations,
        "backups" : serverDetails.feature_limits.backups,
      }
     }, {
       withCredentials: true,
     })
     toast.success("Resource Limits Updated Successfully",{
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
     });
     setServerDetails((prev : any) => {
      return {
        ...prev,
        limits:{
          cpu : serverCPULimit,
          memory : serverMemoryLimit,
          swap : serverSwapLimit,
          disk : serverDiskLimit,
          io : serverBlockIOLimit,
          oom_disabled : serverOOMDisabled,
          threads : serverCPUPinning || null,
        }
      }
     })
     setServerDBdata((prev : any) => {
      return {
        ...prev,
        serverInfo:{
          ...prev.serverInfo,
          cpu: serverCPULimit,
          ram: serverMemoryLimit,
        
          disk: serverDiskLimit,
     
          
         
        }
      }
     })
    } catch (error) {
      toast.error("Something went wrong",{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      ////console.log(error);
    }
  };

  return (
    <div className="w-[50%] bg-[#0a1a2b] p-4 rounded-lg ">
      <ToastContainer />
      <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg mt-2">
        Resource Management
      </div>
      <div className="mt-2 text-gray-500">CPU Limit (%)</div>
      <div>
        <Input
          type="number"
          placeholder="No CPU Limit..."
          value={serverCPULimit}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
          onChange={(e) => setServerCPULimit(e.target.value)}
        />
      </div>
      <div className="mt-2 text-gray-500">CPU Pinning Core</div>
      <div>
        <Input
          type="number"
          placeholder="No CPU Pinning..."
          value={serverCPUPinning}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
          onChange={(e) => setServerCPUPinning(e.target.value)}
        />
      </div>
      <div className="mt-2 text-gray-500">Memory Limit (MB)</div>
      <div>
        <Input
          type="number"
          placeholder="No Memory Limit..."
          value={serverMemoryLimit}
          onChange={(e) => setServerMemoryLimit(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="mt-2 text-gray-500">Swap Limit (MB)</div>
      <div>
        <Input
          type="number"
          placeholder="No Swap Limit..."
          value={serverSwapLimit}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
          onChange={(e) => setServerSwapLimit(e.target.value)}
        />
      </div>
      <div className="mt-2 text-gray-500">Disk Limit (MB)</div>
      <div>
        <Input
          type="number"
          placeholder="No Disk Limit..."
          value={serverDiskLimit}
          onChange={(e) => setServerDiskLimit(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="mt-2 text-gray-500">Block IO Proportion</div>
      <div>
        <Input
          type="number"
          placeholder="No Disk Limit..."
          value={serverBlockIOLimit}
          onChange={(e) => setServerBlockIOLimit(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="mt-2 text-gray-500">OOM Killer</div>
      <div className="flex items-center space-x-2">
        <RadioGroup
          className="w-full flex items-center space-x-2 mt-1"
          defaultValue={serverOOMDisabled ? "disabled" : "enabled"}
          onValueChange={(value) => {
            setServerOOMDisabled(value === "enabled");
          }}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="enabled" id="option-one" />
            <Label htmlFor="option-one">Enabled</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="disabled" id="option-two" />
            <Label htmlFor="option-two">Disabled</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="w-full mt-2 flex">
        <div className="ml-auto">
          <Button
          onClick={async() => {
            await updateResourceLimits();
          }}
          >Save Changes</Button>
        </div>
      </div>
    </div>
  );
};
const RightPart = ({
  serverDetails,
  serverDBdata,
  getServerDetails
}: {
  serverDetails: any,
  serverDBdata: any,
  getServerDetails : any
}) => {
  ////console.log(serverDetails);
  ////console.log(serverDBdata);
  const [allocations, setAllocations] = useState<any>(null);
  const [mainAllocation, setMainAllocation] = useState<any>(null);
  const [allocationDetails, setAllocationDetails] = useState<any>(null);

  const [databaseLimit, setDatabaseLimit] = useState(serverDetails.feature_limits.databases)
  const [allocationLimit, setAllocationLimit] = useState(serverDetails.feature_limits.allocations)
  const [backupLimit, setBackupLimit] = useState(serverDetails.feature_limits.backups)

  const [selectedMainAllocation, setSelectedMainAllocation] = useState<any>(null)
  const [selectedAdditionalAllocation, setSelectedAdditionalAllocation] = useState<any>([])
  const [selectedDeletedAllocation, setSelectedDeletedAllocation] = useState<any>(null)


  
  const serverClientDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${
          serverDetails.identifier
        }`,
        {
          withCredentials: true,
        }
      );

      //console.log('Allocations : ' , response.data.data.data);
      setAllocations(response.data.data.data);
      const arr = response.data.data.data.filter((allocation: any) => {
        return allocation.attributes.is_default;
      });
      ////console.log(arr);
      //console.log(`Main Allocation`, arr[0].attributes);
      setMainAllocation(arr[0].attributes);
      
    } catch (error) {}
  };

  const getAllAllocations = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/nodes/list-node-allocations/${
          serverDetails.node
        }`,
        {
          withCredentials: true,
        }
      );
      // ////console.log(response.data.data.data)
      const arr = response.data.data.data.filter((allocation: any) => {
        return !allocation.attributes.assigned;
      });
      ////console.log(arr);
      setAllocationDetails(arr);
    } catch (error) {
      ////console.log(error);
    }
  };

  const updateAllocationDetails = async () => {
    try {
      
      const body = {
        ...serverDetails.limits,
        "allocation": serverDetails.allocation,
        feature_limits:{
          "databases" : databaseLimit,
          "allocations" : allocationLimit,
          "backups" : backupLimit,
        }
       }
       ////console.log(body)
      
      
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/build/${serverDetails.id}`, {
       ...serverDetails.limits,
       "allocation": serverDetails.allocation,
       feature_limits:{
         "databases" : databaseLimit,
         "allocations" : allocationLimit,
         "backups" : backupLimit,
       }
      }, {
        withCredentials: true,
      })
      toast.success("Resource Limits Updated Successfully",{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      await getServerDetails();

    } catch (error) {
      toast.error("Something went wrong",{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      ////console.log(error);
    }
  }

  const updatePortDetails = async () => {
    try {
      
      console.log(selectedAdditionalAllocation)
      console.log(selectedDeletedAllocation)
      console.log(mainAllocation)

      //make primary allocation
      await axios.post(`  ${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverDetails.identifier}/${mainAllocation.id}`, {}, {
        withCredentials: true,
      })
      toast.success("Main Allocation updated successfully",{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // create allocations
      const ip = mainAllocation.ip
      const port = selectedAdditionalAllocation.map((allocation : any) => allocation.attributes.port)
      // console.log(ip)
      // console.log(port)

      if(port.length > 0){
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverDetails.identifier}`, {
          ip,
          port,
          withCredentials: true
      })
      toast.success('New allocation created successfully!', { 
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      }
      
   console.log(selectedDeletedAllocation)
      if(selectedDeletedAllocation && selectedDeletedAllocation?.length > 0){
        selectedDeletedAllocation.forEach(async(allocation : any) => {
          // console.log(allocation)
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverDetails.identifier}/${allocation.attributes.id}`, {
           withCredentials: true
          })
        });
  
        toast.success('Allocations deleted successfully!', { 
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      }
      //delete the allocations
      
      
      await getServerDetails()

    } catch (error) {
      toast.error("Something went wrong",{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(error);
    }
  }
  useEffect(() => {
    //console.log(selectedAdditionalAllocation)

    
  }, [selectedAdditionalAllocation])


  useEffect(() => {
    
    (async () => {
      await serverClientDetails();
      await getAllAllocations();
    })();
  }, []);
  if (!allocations || !mainAllocation || !allocationDetails) return <Audio />;
  return (
    <div className="flex flex-col gap-2">
      <div className="w-[400px] bg-[#0a1a2b] p-4 rounded-lg border-2 border-[#0a1a2b]">
        <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg mt-2">
          Application Feature Limits
        </div>
        <div className="mt-2 text-gray-500">Database Limit</div>
        <div>
          <Input
            type="number"
            placeholder="No Database Limit..."
            className="dark:bg-[var(--quinary-color)] text-gray-400"
            value={databaseLimit}
            onChange={(e) => setDatabaseLimit(e.target.value)}
          />
        </div>
        <div className="mt-2 text-gray-500">Allocation Limit</div>
        <div>
          <Input
            type="number"
            placeholder="No Allocation Limit..."
            className="dark:bg-[var(--quinary-color)] text-gray-400"
            value={allocationLimit}
            onChange={(e) => setAllocationLimit(e.target.value)}
          />
        </div>
        <div className="mt-2 text-gray-500">Backup Limit</div>
        <div>
          <Input
            type="number"
            placeholder="No Backup Limit..."
            className="dark:bg-[var(--quinary-color)] text-gray-400"
            value={backupLimit}
            onChange={(e) => setBackupLimit(e.target.value)}
          />
        </div>
        <div className="w-full mt-2 flex">
          <div className="ml-auto">
            <Button
            onClick={ async() => {  
              await updateAllocationDetails()
            }}
            >Save Changes</Button>
          </div>
        </div>
      </div>
      <div className="w-[400px] bg-[#0a1a2b] p-4 rounded-lg border-2 border-[#0a1a2b]">
        <div className="bg-[var(--quinary-color)] px-3 py-2 rounded-lg ">
          Allocation Management
        </div>
        <div className="mt-2 text-gray-500">Game Port</div>

        <div className="gameportactive ">
            {
              mainAllocation && allocations.length > 0 && 
              <ReactSelect 
             
             
              defaultValue={{
                value: `${mainAllocation.ip}:${mainAllocation.port}`,
                label: `${mainAllocation.ip}:${mainAllocation.port}`
              }}
              onChange={(e : any) => {
               
               const ip = e.value.split(":")[0]
               const port = parseInt(e.value.split(":")[1], 10)
               
               const foundAllocation = allocations.find((allocation : any) => {
               
                 return allocation.attributes.ip === ip && allocation.attributes.port === port
               })

               //console.log(foundAllocation.attributes)
               setMainAllocation(foundAllocation.attributes)
              }}
              options={allocations.map((allocation : any) => {
                return {
                  value: `${allocation.attributes.ip}:${allocation.attributes.port}`,
                  label: `${allocation.attributes.ip}:${allocation.attributes.port}`
                }
              })}
             
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#19273b",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#19273b",
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                  
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  borderBottom: '1px solid gray',
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                  ":hover":{
                    backgroundColor: "#19273b",
                  }
                }),
                input: (provided) => ({
                  ...provided,
                  
                  // border: "2px solid #0a1a2b",
                  // borderRadius: "5px",
                  // boxShadow: "none",
                  color: "white",
                  
                  
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: "white",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "white",
                }),
              }}
            />
            }
       
        </div>
        <div className="gameportall cursor-pointer ">
          <div className="mt-2 text-gray-500">Assign Additional Ports</div>
         
            <ReactSelect
              isMulti
              options={allocationDetails.map((allocation: any) => {
                return {
                  value: `${allocation.attributes.ip}:${allocation.attributes.port}`,
                  label: `${allocation.attributes.ip}:${allocation.attributes.port}`
                }
              })}

              onChange={(e : any) => {
                //console.log(e)
                const data = e.map((item :any) => {
                  return allocationDetails.find((allocation : any) => {
                    return allocation.attributes.ip === item.value.split(":")[0] && allocation.attributes.port === parseInt(item.value.split(":")[1], 10)
                  })
                  
                })
                // //console.log(data)
                setSelectedAdditionalAllocation(data)
              }}

              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  maxHeight: "100px",
                  overflowY: "auto",
                  cursor: "pointer",
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                  ":hover":{
                    backgroundColor: "#19273b",
                  },
                  borderBottom: '1px solid gray',
                }),
                input: (provided) => ({
                  ...provided,
                  
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                }),
              }}
            />
           
        
        </div>
        <div className="gameportremove ">
          <div className="mt-2 text-gray-500">Remove Allocations & Port</div>

              <ReactSelect
              isMulti
              options={allocations
                .filter((allocation: any) => !allocation.attributes.is_default)
                .map((allocation: any) => {
                return {
                  value: `${allocation.attributes.ip}:${allocation.attributes.port}`,
                  label: `${allocation.attributes.ip}:${allocation.attributes.port}`
                }
              })}
              onChange={(e:any) => {
                //console.log(e)
                const data = e.map((item : any) => {
                  return allocations.find((allocation : any) => {
                    return allocation.attributes.ip === item.value.split(":")[0] && allocation.attributes.port === parseInt(item.value.split(":")[1], 10)
                  })
                })
               //console.log(data)
               setSelectedDeletedAllocation(data)
              }}
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "1px solid gray",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  maxHeight: "100px",
                  overflowY: "auto",
                  cursor: "pointer",
                }),
                option: (provided) => ({
                  ...provided,
                  backgroundColor: "#0a1a2b",
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                  cursor: "pointer",
                  ":hover":{
                    backgroundColor: "#19273b",
                  },
                  borderBottom: '1px solid gray',
                }),
                input: (provided) => ({
                  ...provided,
                  
                  border: "2px solid #0a1a2b",
                  borderRadius: "5px",
                  boxShadow: "none",
                  color: "white",
                }),
              }}
            />


          
        </div>
        <div className="mt-2 flex w-full">
          <div className="ml-auto">
          <Button
          onClick={
            async() => {
              await updatePortDetails()
            }
          }
          >Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BuildConfiguration = ({
  serverDetails,
  serverDBdata,
  setServerDBdata,
  setServerDetails,
  getServerDetails
}: {
  serverDetails: any;
  serverDBdata: any;
  setServerDBdata : any,
  setServerDetails : any,
  getServerDetails : any
}) => {
  ////console.log(serverDetails);
  ////console.log(serverDBdata);
  return (
    <div className="flex  space-x-2 w-full">
      <LeftPart
      setServerDBdata={setServerDBdata}
      setServerDetails={setServerDetails}
      serverDetails={serverDetails} serverDBdata={serverDBdata} />
      <RightPart 
      getServerDetails={getServerDetails}
      serverDetails={serverDetails} serverDBdata={serverDBdata} />
    </div>
  );
};

export default BuildConfiguration;
