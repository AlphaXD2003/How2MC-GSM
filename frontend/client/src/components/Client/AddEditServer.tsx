import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import LocationCard from "./LocationCard";
import {  useEffect, useState } from "react";
import GameSelectCards from "./GameSelectCards";
import axios from "axios";
import {  useNavigate, useParams } from "react-router-dom";
import {  toast ,Bounce} from 'react-toastify';
import SuccessToastConatiner from "../toaster/SuccessToastConatiner";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useUserLimits } from "@/custom functions/getUserLimits";
import { setLimits } from "@/slice/serverSlice";


const AddEditServer = ({ formType }: { formType: "add" | "edit" }) => {
  const naviagte = useNavigate()
  const dispatch = useDispatch()
  const [serverId, setServerId] = useState<any>(null)
  let id = null;
  if(formType === "edit"){
     id = useParams().id
    if(!id)  naviagte("/dashboard")
   
  }

  let userLimits = useSelector((state: RootState) => state.server.limits);
  userLimits = userLimits[0];

  const [locationId, setLocatinId] = useState();
  const [choosenEgg, setChoosenEgg] = useState<any>(null)
  const [confirmEgg, setConfirmEgg] = useState<any>(null)
  const [confirmNest, setConfirmNest] = useState<any>(null)

  const [sname, setSname] = useState("")
  const [sdesc, setSdesc] = useState("")





  const [eggDetails, setEggDetails] = useState<any>(null)
  const handleCreateServer = async () => {
    if(formType === "edit") {

      const d = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/servers/details/${serverId}`)
 
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/build/${serverId}`,{
       "allocation" : d.data.data.allocation,
       "memory": 4096,
       "cpu": 70,
       "disk": 5120,
       "swap": 0,
       "io" : 500,
       "threads" : null,
       "feature_limits": {
        "databases" : 1,
        "allocations": 2,
        "backups": 1
      },
       })
       const envData = d.data.data.container.environment
 

       const eggNestDetails = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${confirmNest}/${confirmEgg}`)
       const eggNestDetailsData = eggNestDetails.data.data.relationships.variables.data
  
       let envInfo : any = {}
       eggNestDetailsData.map((v: any) => {
        envInfo[v.attributes.env_variable] = v.attributes.default_value
       })
     
       await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${serverId}`,{
        "startup": d.data.data.container.startup_command,
        "image": d.data.data.container.image,
        "egg": confirmEgg,
        "environment": {
          ...envInfo
        },
        "skip_scripts": false,
      })
      toast.success(' Server Updated Successfully', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
           })


           setTimeout(() => {
            naviagte("/dashboard");
          }, 2000)
          return;
    }
    const freeserver = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/servers/user/free`,{},{
      withCredentials: true
    })
    
    const acctualData = freeserver.data.data;
    

    const totalServer = acctualData.length
    
   

    const totalCpu = acctualData.reduce((acc : any, val : any) => acc + val.serverInfo.cpu, 0)
    const totalMemory = acctualData.reduce((acc : any, val : any) => acc + val.serverInfo.ram, 0)
    const totalDisk = acctualData.reduce((acc:any, val:any) => acc + val.serverInfo.disk, 0)


    if(totalServer + 1 > 2) {
      toast.error(`You have already created ${totalServer} servers. Please delete one of them.`)
      
        return 
   }

   if (totalCpu + 70 > userLimits?.cpu || totalCpu > userLimits?.cpu) {
      toast.error(`You have reached your CPU limit of ${userLimits.cpu} CPU`)
       return 
        
     
   }

   if (totalMemory + 4096 > userLimits?.memory || totalMemory > userLimits?.memory) {
      toast.error(`You have reached your Memory limit of ${userLimits.memory} MB`)
       
        return 
   }

   if (totalDisk + 5120 > userLimits?.disk || totalDisk > userLimits?.disk) {
      toast.error(`You have reached your Disk limit of ${userLimits.disk} MB`)
       
        return 
   }

    try {
      

      const eggDetails = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${confirmNest}/${confirmEgg}`)
      const eggDetailsData = eggDetails.data.data
      
      let variables : any = {}
      eggDetailsData.relationships.variables.data.forEach((v : any) => {
        variables[v.attributes.env_variable] = v.attributes.default_value
      })
     
    
      const pteroUser = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/ptero-user-info`)
 
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/servers/create`,{
        name: sname,
        user : pteroUser.data.data.id,
        description: sdesc,
        eggInfo: confirmEgg,
        docker_image: eggDetailsData.docker_image,
        startup: eggDetailsData.startup,
        limits: {
          cpu: 70,
          memory: 4096,
          disk: 5120,
          swap: 0 ,
          io : 500
        },
        environment: {
          ...variables
      },
      feature_limits: {
        databases : 1,
        allocations: 2,
        backups: 1
      },
      deploy: {
        "locations" : [locationId],
        "dedicated_ip": false,
        port_range: [],
      } ,
      cost : 0,
      status: "free"

    })
    setSname("")
    setSdesc("")
    setChoosenEgg(null)
    setConfirmEgg(null)
    setConfirmNest(null);

    
    toast.success(' Server Created Successfully', {
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
      (async() => {
        const [userLimits, error] = await useUserLimits() ;
        if(userLimits && !error){
       
          dispatch(setLimits(userLimits))
        }
      })()
    setTimeout(() => {
      naviagte("/dashboard");
    }, 2000)
    } catch (error) {
      toast.error(' Server Creation Failed', {
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

        setTimeout(() => {
          naviagte("/dashboard");
        }, 2000)
    }
  }


  useEffect(() => {
    if (confirmNest && confirmEgg) {
    
      (async () => {
        await handleCreateServer()
      })();
    }
  }, [confirmNest, confirmEgg])

 

  const getServerDetails = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/servers/info/${serverId}`,{
        withCredentials: true
      })
    
      setSname(response.data.data.server_name)
      setSdesc(response.data.data.server_description)
      setLocatinId(response.data.data.serverInfo.location)
      setChoosenEgg(response.data.data.serverInfo.egg)
      setConfirmEgg(response.data.data.serverInfo.egg) 
      setEggDetails(response.data.data)
    } catch (error) {
      toast.error(' Server Details Not Found', {
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
        setTimeout(() => {
          naviagte("/dashboard");
        }, 2000)
    }
  }

  useEffect(() => {
    if(formType === "edit"){
      setServerId(id)
    }

  }, [formType])

  useEffect(() => {
    if(serverId){
      ;(async() => {
        await getServerDetails()
      })();
    }
  }, [serverId])

  return (
    <div className="ml-2 relative ">
      <div className="lg:text-xl dark:text-gray-300">
        {formType.toUpperCase()} SERVER
      </div>
      <div className="mt-4">
        <div className="flex flex-col sm:w-[200px] mt-1 md:w-[600px]">
          <Label htmlFor="sname" className="dark:text-[var(--semi-dark)] text-lg">Enter name of your server.</Label>
          <Input
          value={sname}
          onChange={(e) => setSname(e.target.value)}
            id="sname"
            placeholder="Name of your server..."
            className="sm:w-[200px] mt-1 md:w-[600px] dark:bg-[var(--quinary-color)]"
          />
        </div>

        <div className="flex flex-col mt-4 sm:w-[200px]  md:w-[600px] lg:w-[800px] ">
          <Label htmlFor="sdesc" className="dark:text-[var(--semi-dark)] text-lg">Enter description of your server.</Label>
          <Input
          value={sdesc}
          onChange={(e) => setSdesc(e.target.value)}
            id="sdesc"
            placeholder="Description of your server..."
            className="sm:w-[200px] mt-1 md:w-[700px] lg:w-[800px] dark:bg-[var(--quinary-color)]"
          />
        </div>


      </div>
      <SuccessToastConatiner theme="dark" />
      <LocationCard locationId={locationId} setLocatinId={setLocatinId} />
      <GameSelectCards handleCreateServer={handleCreateServer} setConfirmNest={setConfirmNest} setConfirmEgg={setConfirmEgg} choosenEgg={choosenEgg} setChoosenEgg={setChoosenEgg} />
    </div>
  );
};

export default AddEditServer;
