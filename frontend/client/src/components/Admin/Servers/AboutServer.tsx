import ServerDetails from '@/components/ServerDetails'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Audio } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'

const LeftBox = ({serverDetails, serverDBdata}:
    {
        serverDetails: any,
        serverDBdata: any
    }) => {
console.log(serverDetails)
console.log(serverDBdata)
const [eggDetails, setEggDetails] = useState<any>(null)
const [nestDetails, setNestDetails] = useState<any>(null)
const [allocations, setAllocations] = useState<any>([])
const [ip, setIp] = useState<any>('')
const [port, setPort] = useState<any>('')
const [alias, setAlias] = useState<any>('')
const getEggAndNest = async () => {
    try {
        const response1 = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`,{
            eggId: serverDetails.egg
        })
        console.log(response1.data.data)
        setEggDetails(response1.data.data)
        const response2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/nests/get-nest-of-egg/${serverDetails.egg}`)
        console.log(response2.data.data[0])
        setNestDetails(response2.data.data[0])
    } catch (error) {
        
    }
}
const serverClientDetails = async () =>{
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverDetails.identifier}`, {
            withCredentials: true
        })
        // console.log(response.data.data.data)
        // response.data.data.data.map((allocation : any) => {
        //     setAllocations((prev: any) => {
        //         return [
        //             ...prev,{
        //                 ...allocation.attributes,
        //             }
        //         ]
        //     })
        // })
        const arr = response.data.data.data.filter((allocation : any) => {
            return allocation.attributes.is_default
        })
        console.log(arr)
        setIp(arr[0].attributes.ip)
        setAlias(arr[0].attributes.ip_alias)
        setPort(arr[0].attributes.port)
    } catch (error) {
        
    }
}

useEffect(() => {
    (async () => {
        await getEggAndNest()
        await serverClientDetails()
    })()
}, [])
if(!eggDetails || !nestDetails) return <Audio />
    return(
        <div className='w-[700px] '>
            <div className='bg-[var(--quinary-color)] p-3 rounded-lg mt-2' >
                Information About Server
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg '>

                    Internal Identifier
                </div>
                <div className='w-[400px] text-gray-500 text-lg '>
                    {serverDetails.id}
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    External Identifier
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    <p className='w-auto rounded-lg '>
                        {serverDetails.externalId ? serverDetails.externalId : 'Not Set'}
                    </p>
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    UUID /Docker Container ID
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                   {serverDetails.uuid}
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Current Egg
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                   {nestDetails.name + ' :: ' + eggDetails.name}
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Server Name
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {serverDetails.name}
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    CPU Limit
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {serverDetails.limits.cpu}%
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    CPU Pinning
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    Not Set
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Memory
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {serverDetails.limits.memory + ' MB / ' + serverDetails.limits.swap} MB
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Disk Space
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {serverDetails.limits.disk} MB
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Block IO Weight
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {serverDetails.limits.io} 
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                    Default Connection
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {ip} : {port}
                </div>
            </div>
            <div className='flex justify-between mt-2  border-b-2 px-3 py-1'>
                <div className='w-[300px] text-gray-400 text-lg   '>
                Connection Alias
                </div>
                <div className=' w-[400px] text-gray-500 text-lg '>
                    {alias ? alias : 'Not Set'}
                </div>
            </div>
        </div>
    )
}
const RightBox = ({serverDetails, serverDBdata}:
    {
        serverDetails: any,
        serverDBdata: any
    }) => {
    const [owner, setOwner] = useState<any>()
    const [node, setNode] = useState<any>()
    const navigate = useNavigate()
    const getOwnerDetails = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/servers/get-owner`,{
                server_id: serverDetails.id
            } ,{
                withCredentials: true
            })
            console.log(response.data.data)
            setOwner(response.data.data)
        }
         catch (error) {
            
        }
    }
    const getNodeDetails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/nodes/node/${serverDetails.node}` ,{
                withCredentials: true
            })
            console.log(response.data.data)
            setNode(response.data.data)
        }
         catch (error) {
            
        }
    }
    useEffect(() => {
        (async () => {
            await getOwnerDetails()
            await getNodeDetails()
        })()
    }, [])
    if(!owner || !node) return <Audio />
    return(
        <div className='w-full'>
            <div className='flex justify-between items-center w-[300px] bg-[var(--quinary-color)] p-3 rounded-lg mt-2'>
                <div className='flex flex-col gap-2'>
                    <div className='text-gray-400'>
                        {owner.username}
                    </div>
                    <div
                    onClick={() => {
                        navigate('/dashboard/admin/open-user/' + owner._id)
                    }}
                    className='text-gray-500 flex gap-2 items-center hover:underline cursor-pointer'>
                        Server Owner
                        <div>
                            <i 
                                
                            className="	fa fa-angle-double-right" aria-hidden="true"></i>
                        </div>
                    </div>

                </div>
                <div>
                    <i 
                        style={{
                            fontSize: '50px'
                        }}
                    className="fa fa-user" aria-hidden="true"></i>
                </div>
            </div>
            <div className='flex justify-between items-center w-[300px] bg-[var(--quinary-color)] p-3 rounded-lg mt-2'>
                <div className='flex flex-col gap-2'>
                    <div className='text-gray-400'>
                       {node.name}
                    </div>
                    <div
                    
                    className='text-gray-500 flex gap-2 items-center hover:underline cursor-pointer'>
                        Server Node
                        <div>
                            <i 
                                
                            className="	fa fa-angle-double-right" aria-hidden="true"></i>
                        </div>
                    </div>

                </div>
                <div>
                    <i 
                        style={{
                            fontSize: '50px'
                        }}
                    className="fa fa-user" aria-hidden="true"></i>
                </div>
            </div>

        </div>
    )
}
const AboutServer = (
    {serverDetails, serverDBdata}:
    {
        serverDetails: any,
        serverDBdata: any
    }
) => {
  return (
    <div className='w-full flex justify-between space-x-6'>
        <LeftBox
            serverDetails={serverDetails}
            serverDBdata={serverDBdata}
        />
        <RightBox
            serverDetails={serverDetails}
            serverDBdata={serverDBdata}
        />
    </div>
  )
}

export default AboutServer