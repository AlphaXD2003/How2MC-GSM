import axios from 'axios'
import  { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { ServerPaymentTable } from './data-table'
import { columns } from './columns'

const ServerAdminView = () => {
    const [servers, setServers] = useState<any[] | null>(null)
    const [serverData, setServerData] = useState<any[] | null>([])
    const fetchServers = async () => {
        setServerData([])
        setServers(null)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/servers`,{
                withCredentials: true,
            })
            console.log(response.data.data)
            setServers(response.data.data)
            response.data.data.map((server : any) => {
                console.log(server)
                setServerData((s : any) => {
                    return [
                        ...s,
                        {
                            id: server._id,
                            name: server.server_name,
                            description: server.server_description,
                            pteroId: server.server_id,
                            pteroUserId: server.user_id,
                            cost: server.cost,
                            dateCreated: `${new Date(server.createdAt).toLocaleDateString()} ${new Date(server.createdAt).toLocaleTimeString()}`,
                        }
                    ]
                })
            })
        } catch (error) {
            toast.error('Error fetching servers',{
                position: 'bottom-right',
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
            await fetchServers()
        })()
    }, [])
    if(!serverData){
        return <div>Loading...</div>
    }
  return (
    <div>
        <ToastContainer />
       <ServerPaymentTable
      
       columns={columns} data={serverData} />  
       </div>
  )
}

export default ServerAdminView