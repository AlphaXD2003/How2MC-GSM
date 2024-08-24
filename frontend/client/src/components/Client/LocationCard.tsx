import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import classNames from "classnames";
import { Button } from "../ui/button";
import { RotatingLines } from 'react-loader-spinner'
import { CardContent } from "@mui/material";
import { Progress } from "@/components/ui/progress"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const LocationCard = ({setLocatinId, locationId} : {setLocatinId : any, locationId : any}) => {

  const [locations, setLocations] = useState<any>(null)
  const [locationNodes, setLocationNodes] = useState<any>(null)
  const [selectedLocationCard, setSelectedLocationCard] = useState<any>(null);
  const [pingInfo, setPingInfo] = useState<any>(null);

  const fetchLocation = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/location/`
    );
  
    setLocations(response.data.data);
  };

  const fetchLocationNodes = async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/location/location-node`
    )
    
    setLocationNodes(response.data.data);
  }

  const handlePing = async () => {
    if(locations){
      locations.map(async (location : any) => {
        if( location?.nodes[0] ){
   
          const data = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/nodes/node/${location?.nodes[0]}`)
        
   
          const ping = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ping/${data.data.data.fqdn}`)
          
           setPingInfo((prev: any  )=> ({
             ...prev,
            [ location.id]: Math.floor(Number(ping.data.data.avg))
           })) 
        }
        })
    }
  }


  useEffect(() => {
    if(locationId){
      setSelectedLocationCard(locationId)
    }
  }, [locationId])

  useEffect(() => {
    if (locations) {
      (async () => {
        await fetchLocationNodes();
      })()
    }
  }, [locations])


  useEffect(() => {
    (async () => {
      await fetchLocation();
    })();
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center">
        <div className="mt-4 ">Select a Location</div>
        <Button onClick={handlePing} className="mr-4 bg-green-500 uppercase">
          Check Ping
        </Button>
      </div>
      <div className="grid mr-4 md:space-x-5 lg:space-x-10 mt-1 grid-cols-1 sm:grid-cols-1 midlg:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 w-full ">
        {
          locations &&
          <div className="grid grid-cols-1 space-y-3 md:space-y-0 lg:grid-cols-2  w md:w-[800px] lg:w-[1200px]">
            {
              locations.map((location: any, i : any) => {

                return (
                  <div onClick={() => {
                    setSelectedLocationCard(location.id)
                    setLocatinId(location.id)
                  }}  key={i}>
                    <HoverCard>
                    <HoverCardTrigger asChild>
                    <Card className={classNames(selectedLocationCard === location.id ? "dark:bg-[var(--quinary-color)] shadow dark:shadow-neutral-200" : null ,"border w-[550px] h-[240px]  p-4 cursor-pointer ")} key={location.id}>
                    <div className="flex flex-row justify-between items-center">
                      <div>
                        <img src={`https://flagsapi.com/${location.short}/shiny/64.png`} width="40px" alt={`${location.short}`} />
                      </div>
                      <CardTitle>
                        {location.long.toUpperCase()}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      The nodes are empowered by high specs CPU and RAM.
                    </CardDescription>
                    <CardContent>
                      <div>
                        {
                          locationNodes &&
                          locationNodes.map((locationNode : any, i : any) => {
                            if (locationNode?.l_id === location.id) {
                              
                              return (
                                <div key={i} className="">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center">
                                    <div className="text-sm">🧮 MEMORY</div>
                                    <div>Available { Math.ceil(locationNode.resources.allocatedRam - locationNode.resources.usedRam) / 1000} GB </div>
                                    </div>
                                    <div>

                                      <Progress
                                      indiColor={
                                        Math.ceil((locationNode.resources.usedRam * 100) / locationNode.resources.allocatedRam) < 50 ? "bg-green-500" : "bg-primary"
                                      }
                                        className={classNames( 
                                          null
                                          ,"h-2")}
                                        value={
                                          Math.ceil((locationNode.resources.usedRam * 100) / locationNode.resources.allocatedRam)
                                        } />

                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1 mt-4">
                                    <div className="text-sm">🗄️ DISK</div>
                                    <div>

                                      <Progress
                                        className="h-2"
                                        value={
                                          Math.ceil((locationNode.resources.usedDisk * 100) / locationNode.resources.allocatedDisk)
                                        } />

                                    </div>
                                  </div>

                                  <div className="flex  mt-2">
                                  {
                                      locationNode.resources.isInMaintenance ? (
                                        null
                                      ) : 
                                       ( <div className="ml-auto">
                                          {
                                            pingInfo ? <div>

                                                {
                                                  `${pingInfo[locationNode.l_id]}`
                                                }
                                            </div> : "🟢 CHECK PING"
                                          }
                                        </div>)
                                      
                                    }
                                    {
                                      locationNode.resources.isInMaintenance ? (
                                        <div className="ml-auto">
                                          ⏱️ Maintenance Mode
                                        </div>
                                      ) : null
                                    }
                                  </div>
                                </div>
                              )
                            }
                            else {
                              return null;
                            }

                          })
                        }
                      </div>
                    </CardContent>
                    <CardFooter>
                          
                    </CardFooter>
                  </Card>
                    </HoverCardTrigger>
                    <HoverCardContent>

                      {
                        `Used by ` +
                      ( locationNodes &&
                        locationNodes?.filter(
                          (locationNode: any) => locationNode.l_id === location.id
                        )[0]?.resources?.numberOfServers?.reduce((acc : any, curr : any) => acc +1, 0)
                        )
                        + ` servers.`
                      }
                    </HoverCardContent>
                  </HoverCard>
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    </div>
  );
};

export default LocationCard;
