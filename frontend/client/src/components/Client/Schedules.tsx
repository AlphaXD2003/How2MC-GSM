import axios from 'axios'
import React, { useEffect } from 'react'

const Schedules = ({ serverInfo }: { serverInfo: any }) => {
    const [schedules, setSchedules] = React.useState<any>([])
    const getSchedules = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/schedules/${serverInfo.clientInfo.identifier}`, {
                withCredentials: true
            })
            //console.log(response.data.data.data)
            setSchedules(response.data.data.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        (async () => {
            await getSchedules()
        })();
    },[])
  return (
    <div>Schedules</div>
  )
}

export default Schedules