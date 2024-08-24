import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Toast } from "@radix-ui/react-toast"
import axios from "axios"
import { useEffect, useState } from "react"
import { Audio } from "react-loader-spinner"
import { toast, ToastContainer } from "react-toastify"


const ServerDetails = ({
    serverDetails,
    serverDBdata,
    getServerDetails
}:
{
    serverDetails: any,
    serverDBdata: any,
    getServerDetails: any
}
) => {
    console.log(serverDetails)
    console.log(serverDBdata)
    const [serverName, setServerName] = useState(serverDetails.name)
    const [serverExternalIdentifier, setServerExternalIdentifier] = useState(serverDetails.external_id)
    const [owner, setOwner] = useState<any>()
    const [serverDescription, setServerDescription] = useState(serverDetails.description)

    const updateServerDetails = async () => {
      try {
        const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/details/${serverDetails.id}`,{
            server_id: serverDetails.id,
            name: serverName,
            external_id: serverExternalIdentifier,
            description: serverDescription,
            email : owner.email
        } ,{
            withCredentials: true
        })
        console.log(response.data.data)
        await getServerDetails()
        toast.success("Server Details Updated Successfully!",{
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong!",{
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

  useEffect(() => {
      (async () => {
          await getOwnerDetails()
      })()
  }, [])

  if(!owner) return <div> <Audio /></div>
  return (
    <div className="w-[90%]  p-3 rounded-lg mt-2 overflow-x-hidden">
      <ToastContainer />
      <div className="w-full bg-[var(--quinary-color)] px-3 py-2 rounded-lg mt-2">
        Base Information Base Details
      </div>
      <div className="flex flex-row  gap-3 translate-y-1  w-full mt-2 text-gray-400">
        Server Name
        <p className="text-xs text-red-500">
          required*
        </p>
      </div>
      <div className="mt-2">
        <Input
          type="text"
          placeholder="Server Name goes here..."
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="flex flex-row justify-between items-center w-full mt-4 text-gray-400">
        External Identifier
      </div>
      <div className="mt-1">
        <Input
          type="text"
          placeholder="No External Identifier..."
          value={serverExternalIdentifier}
          onChange={(e) => setServerExternalIdentifier(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="flex flex-row gap-2  items-center w-full mt-4 text-gray-400">
        Server Owner
        <p className="text-xs text-red-500 -translate-y-1">
          required*
        </p>
      </div>
      <div className="mt-1">
        <Input
          type="email"
          placeholder="User Email goes here..."
          value={owner.email}
          onChange={(e) => setOwner({...owner, email: e.target.value})}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="flex flex-row gap-2  items-center w-full mt-4 text-gray-400">
        Server Description
        <p className="text-xs text-red-500 -translate-y-1">
          required*
        </p>
      </div>
      <div className="mt-1">
        <Textarea
          
          placeholder="User Email goes here..."
          value={serverDescription}
          onChange={(e) => setServerDescription(e.target.value)}
          className="dark:bg-[var(--quinary-color)] text-gray-400"
        />
      </div>
      <div className="w-full flex mt-2">
        <div className="ml-auto">
          <Button
          onClick={ async() => {
            await updateServerDetails()
          }}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ServerDetails