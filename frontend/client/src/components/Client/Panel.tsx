
import Console from "./Console";

import React, { useEffect } from "react";
import classNames from "classnames";
import axios from "axios";
import { Button } from "../ui/button";
import { toast, ToastContainer } from "react-toastify";
import ChartGraph from "./CPUChart";


const Panel = ({ serverInfo }: { serverInfo: any }) => {
    const getCurrentTimeFormatted = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        //console.log(`${hours}:${minutes}`)
        
        return `${hours}:${minutes}`
      };

    const [time, setTime] = React.useState<any>(() => getCurrentTimeFormatted());
    const [cpuUsage, setCpuUsage] = React.useState<any>([
        { time, usage: 0 },
        
      
      ]);
    
      useEffect(() => {
        getCurrentTimeFormatted()
      },[])

      const getCPUdata =  () => {
        if(serverDetails && serverDetails?.serverInfo && stats && stats.cpu_absolute) {
            const currentTime = getCurrentTimeFormatted();
            const isTimePresent = cpuUsage.some((entry : any) => entry.time === currentTime);
            if(isTimePresent) return;
            const newUsage = {
                time: currentTime,
                usage: Math.round( Number((Number(stats.cpu_absolute)))),
            }
            
            setCpuUsage((prev : any) => {
                const updatedUsage = [...prev, newUsage];
                const startIndex = Math.max(updatedUsage.length - 10, 0);
                return updatedUsage.slice(startIndex);
            })

           
        }
      }

    const [ws, setWs] = React.useState<any>(null);
    const [stats, setStats] = React.useState<any>();
    const [state, setState] = React.useState<any>(null);
    const [error, setError] = React.useState<any>(null);
    const startServer = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/send-power/${serverInfo.clientInfo.identifier}`, { action: "start" });
        } catch (error) {

        }
    }

    const killServer = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/send-power/${serverInfo.clientInfo.identifier}`, { action: "kill" });
        } catch (error) {

        }
    }

    const stopServer = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/send-power/${serverInfo.clientInfo.identifier}`, { action: "stop" });
        } catch (error) {

        }
    }
    const restartServer = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/send-power/${serverInfo.clientInfo.identifier}`, { action: "restart" });
        } catch (error) {

        }
    }
    const [command, setCommand] = React.useState<string>("");
    const [connected, setConnected] = React.useState<boolean>(false);
    const sendCommand = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/send-command/${serverInfo.clientInfo.identifier}`, { command: command });


            setCommand("");
        } catch (error) {
            toast.error("Error sending command", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

            });
        }
    }
    const [serverDetails, setServerDetails] = React.useState<any>(null);
    const getServerDetails = async () => {
        try {
            // //console.log(serverInfo);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/servers/info/${serverInfo.server_id}`);
            setServerDetails(res.data.data);
            //console.log(res.data.data);
        } catch (error) {

        }
    }

    useEffect(() => {
        (async () => {
            await getServerDetails();
        })();
    }, [])

    useEffect(() => {
        if (ws) {
            
            ws.addEventListener('message', (event: any) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.event === 'stats' && data.args && Array.isArray(data.args)) {
                        // //console.log('stats', data.args);
                        setStats(JSON.parse(data.args[0]));
                        setState(JSON.parse(data.args[0]).state);
                        getCPUdata();
                    }
                } catch (error) {

                }
            })
        }
    }, [ws]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,

            });
        }
    }, [error])

    useEffect(() => {
        if (stats ) {
            // //console.log(stats);
        }
    }, [stats])

    return (
        <div className='w-[100%] border p-2' >
            <div className="flex justify-between items-center">
                <div className='text-gray-400 '>
                    <div className='text-gray-300 '> {serverInfo.clientInfo.name.toUpperCase()}
                        <div>
                            {
                                stats ? (
                                    <div
                                        className={classNames(state.toUpperCase() === "STARTING" ? 'text-orange-400' :
                                            state.toUpperCase() === "OFFLINE" ? 'text-red-400' : null
                                            , 'font-bold')}
                                    >
                                        {state.toUpperCase()}
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                    <div> {serverInfo.clientInfo.description}  </div>
                </div>
                <div className="flex gap-3">
                    <Button disabled={stats && state.toUpperCase() !== "OFFLINE"} onClick={startServer} className="text-green-500" variant="outline" >Start</Button>
                    <Button onClick={restartServer} color="primary" className="text-blue-600" variant="outline" >Restart</Button>
                    <Button disabled={stats && state.toUpperCase() === "OFFLINE"} className={classNames(state === "OFFLINE" ? "cursor-wait" : null, "text-red-600")} onClick={stopServer} color="error" variant="outline" >Stop</Button>
                    <Button onClick={killServer} className="text-orange-500" variant="outline" >Kill</Button>
                </div>
            </div>
            <div className="flex items-start gap-3 justify-between mt-4" >
                <div className=" flex flex-col w-[73%] bg-black  border  pt-1 rounded-lg bg-opacity-60 h-[600px]">
                    <Console setError={setError} setWs={setWs} stats = {stats}  identifier={serverInfo.clientInfo.identifier} />
                    <div className="mt-auto flex w-full rounded-b-md items-center">
                        <input
                            type="text"
                            onKeyDown={async(e : any) => {
                                if (e.key === "Enter") {
                                   
                                        await sendCommand();
                                    
                                }
                            }}
                            value={command}
                            onChange={(e: any) => setCommand(e.target.value)}
                            placeholder=" Type your command here..."
                            className="flex-grow p-2 w-full border-none rounded-bl-md dark:bg-[var(--semi-dark2)]   "  />
                        <Button onClick={sendCommand} className="text-blue-600 rounded-none rounded-br-md bg-[var(--semi-dark2)] border-none p-2  px-4" variant="outline" >{'>>'}</Button>
                    </div>
                </div>
                <div className="w-[25%] bg-[var(--quinary-color)] p-2 rounded-md h-[600px] ">
                {serverDetails && serverDetails?.serverInfo && stats && stats.uptime ? <SideCard 
                        heading="Uptime"
                        data={`${Math.floor((stats.uptime/1000) / 3600)}h ${Math.floor(((stats.uptime /1000 )% 3600) / 60)}m ${Math.round((stats.uptime / 1000) % 60)}s`}
                        i="fa fa-wifi"
                        
                    /> : <SideCard 
                        heading="Uptime"
                        data='OFFLINE'
                        i="fa fa-wifi"
                        
                    />
                    
                    }
                {serverDetails && serverDetails?.serverInfo && stats && stats.cpu_absolute ? <SideCard 
                        heading="CPU Usage"
                        data={`${String((Number(stats.cpu_absolute)).toFixed(2))}%`}
                        i="fa fa-wifi"
                        mainLimit={`${serverDetails?.serverInfo?.cpu}% `}
                    /> : <SideCard 
                        heading="CPU Usage"
                        data={'0'}
                        mainLimit={`${serverDetails?.serverInfo?.cpu}% `}
                        i="fa fa-wifi"
                        />
                    
                    }
                {serverDetails && serverDetails?.serverInfo && stats && stats.memory_bytes ? <SideCard 
                        heading="RAM Usage"
                        data = {`${String((Number(stats.memory_bytes)/1024/1024).toFixed(2))} MiB`}
                        i="fa fa-archive"
                        mainLimit={`${(serverDetails?.serverInfo?.ram/1024).toFixed(2)} GB`}
                    /> : <SideCard 
                        heading="RAM Usage"
                        data={'0'}
                        mainLimit={`${(serverDetails?.serverInfo?.ram/1024).toFixed(2)} GB`}
                        i="fa fa-archive"
                    />
                    
                    }
                {serverDetails && serverDetails?.serverInfo && stats && stats.disk_bytes ? <SideCard 
                        heading="DISK Usage"
                        data = {`${String((Number(stats.disk_bytes)/1024/1024).toFixed(2))} MiB`}
                        i="fa fa-hdd-o"
                        mainLimit={`${(serverDetails?.serverInfo?.disk/1024).toFixed(2)} GB`}
                    /> : null
                    
                    }
                {serverDetails && serverDetails?.serverInfo && stats && stats.network ? <SideCard 
                        heading="Network Inbound"
                        data={String((Number(stats.network.rx_bytes / 1024)).toFixed(2) + " KB")}
                        i="fa fa-arrow-down"
                        
                    /> : null
                    
                    }
                {serverDetails && serverDetails?.serverInfo && stats && stats.network ? <SideCard 
                        heading="Network Outbound"
                        data={String((Number(stats.network.tx_bytes / 1024)).toFixed(2) + " KB")}
                        i="fa fa-arrow-up"
                        
                    /> : null
                    
                    }

                </div>
            </div>
            <ChartGraph data={cpuUsage} label="CPU Usage" />
            <ToastContainer />
        </div>
    )
}


const SideCard = ({heading, i, data, mainLimit} : {heading : string, i : any, data : string , mainLimit ? : any}) => {

    return (
        <div className="bg-gray-800 mb-4 flex border cursor-pointer border-neutral-500 rounded-lg shadow-lg gap-8 p-4 items-center w-full h-[83px]">
            <div className="text-3xl font-bold ">
            <i className={classNames( 'text-4xl' ,`${i}`)} aria-hidden="true"></i>
            </div>
            <div className="flex flex-col">
                <div className="font-semibold text-xl">
                    {heading.toUpperCase()}
                </div>
                <div className="text-gray-400 text-xl">
                    {data} {mainLimit ? `/ ${mainLimit}` : null}
                </div>
            </div>
        </div>
    )
}

export default Panel;