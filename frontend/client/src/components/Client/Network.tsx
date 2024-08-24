import { Button, Skeleton, TextField } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Input } from '../ui/input'
import { Button as Btn } from '../ui/button'

const Network = ({ serverInfo }: { serverInfo: any }) => {
    // //console.log(serverInfo)
    const [loading, setLoading] = React.useState(true)
    const [allocations, setAllocations] = React.useState<any>()

    const createNewAllocation = async () => {
        try {
            
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverInfo.clientInfo.identifier}`, {
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
            await getAllAllocations()
        } catch (error) {
            toast.error('Creating new allocation failed!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const getAllAllocations = async () => {
        try {

            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverInfo.clientInfo.identifier}`, {
                withCredentials: true
            })
            //console.log(response.data.data.data)
            setAllocations(response.data.data.data)
            setLoading(false)

        } catch (error) {
            toast.error('Fetching allocations failed!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }



    }
    useEffect(() => {
        (async () => {
            await getAllAllocations()
        })()

    }, []);
    if (loading) {
        return (
            <div className='flex items-center space-x-4'>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        )
    }
    else {
        return (
            <div>
                <div className='flex justify-between items-center'>
                    <div>
                        Network
                    </div>
                    <div>
                        <Button  onClick = {async () => await createNewAllocation()} variant="contained" color="success"  >New Allocation</Button>
                    </div>
                </div>
                <div className=' flex flex-wrap'>
                {
                    allocations && allocations.map((allocation: any, index: number) => {
                        return <NetworkCard getAllAllocations = {getAllAllocations} serverInfo = {serverInfo} key={index} allocation={allocation.attributes} />
                    })
                }
                </div>
                <ToastContainer />
            </div>
        )
    }


}

const NetworkCard = ({ allocation , serverInfo, getAllAllocations }: { allocation: any, serverInfo: any, getAllAllocations: any }) => {
    const [notes, setNotes] = React.useState<any>(allocation?.notes || '')

    const createNote = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverInfo.clientInfo.identifier}/${allocation.id}`,{notes}, {
                withCredentials: true,
                // data: {
                //     notes
                // }
            })
            toast.success('Notes updated successfully!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getAllAllocations()
        } catch (error) {
            toast.error('Updating notes failed!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const makePrimary = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverInfo.clientInfo.identifier}/${allocation.id}`,{}, {
                withCredentials: true,
                
            })
            toast.success('Allocation made primary successfully!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getAllAllocations()
        } catch (error) {
            toast.error('Making allocation primary failed!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }

    const deleteAllocation = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/client/server/allocation/${serverInfo.clientInfo.identifier}/${allocation.id}`, {
                withCredentials: true
            })

            toast.success('Allocation deleted successfully!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getAllAllocations()
        } catch (error) {
            toast.error('Deleting allocation failed!', { 
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        }
    }
    return (
        <div className='w-[600px] flex flex-col gap-2 h-[250px] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='flex justify-between items-center gap-4 bg-[var(--semi-dark2)] rounded-lg p-2'>
                <div>
                    <div>
                        IP Address
                    </div>
                    <div className='text-gray-500'>
                        {allocation.ip}
                    </div>
                </div>
                <div>
                    <div>
                        Port
                    </div>
                    <div className='text-gray-500'>
                        {allocation.port}
                    </div>
                </div>
                <div>
                    
                         <Btn onClick={async() => await makePrimary()} disabled={allocation.is_default} >Make Primary </Btn>
                    
                </div>
            </div>
            <div>
                <Input
                    placeholder='Enter notes for this allocation'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    height='100'
                    onKeyDown={async(e) => {
                        if (e.key === 'Enter') {
                            await createNote()
                        }
                    }}

                />
            </div>
            <div className='ml-auto mt-auto flex gap-2 items-center'>
                <Button onClick = {async () => await deleteAllocation() } variant="contained" color="error"  >Delete</Button>
                <Button onClick = {async () => await createNote()} variant="outlined" color="inherit" >Save</Button>
            </div>
        </div>
    )
}

export default Network