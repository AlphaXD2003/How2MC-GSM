import React from 'react'
import { Button } from '../ui/button'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Input } from '../ui/input'

const ServerSettings = ({ serverInfo, setIsInstalling }: { serverInfo: any, setIsInstalling: any }) => {
    //console.log(serverInfo)
    return (
        <div className='flex flex-wrap gap-4 w-[82%]'>
            <DebugInfo serverInfo={serverInfo} />
            <SFTPdetails
                identifier={serverInfo.clientInfo.identifier}
                sftp={serverInfo.clientInfo.sftp_details}
            />
            <ReinstallComponent setIsInstalling = {setIsInstalling} identifier={serverInfo.clientInfo.identifier} />
            <ServerDetails aid={serverInfo.info.id} identifier={serverInfo.clientInfo.identifier} sname={serverInfo.info.name} sdesc={serverInfo.info.description} />
            <ToastContainer />
        </div>
    )
}

const SFTPdetails = ({ sftp, identifier }: { sftp: any, identifier: any }) => {
    const [address, setAddress] = React.useState<any>('')
    const [port, setPort] = React.useState<any>('sftp://5.249.160.80:2022')
    const [username, setUsername] = React.useState<any>('')
    const getAdminAccount = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/account/admin`, {
                withCredentials: true
            })
            setUsername(response.data.data.username)

        } catch (error) {

        }
    }
    React.useEffect(() => {
        setAddress(sftp.ip)
        setPort(sftp.port);
        (async () => {
            await getAdminAccount()
        })();
    }, [])

    return (
        <div className='flex flex-col gap-2 w-[40%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='bg-[var(--semi-dark2)] rounded-lg p-2'>
                SFTP Details
            </div>
            <div className='mt-4'>
                Server Address
            </div>
            <div
                onClick={() => {
                    navigator.clipboard.writeText(address)
                    toast.success('Copied to clipboard successfully!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }}
                className='bg-[var(--semi-dark2)] p-2 rounded-lg cursor-pointer '>
                sftp://{address}:{port}
            </div>
            <div className='mt-3'>
                Username
            </div>
            <div onClick={() => {
                navigator.clipboard.writeText(username)
                toast.success('Copied to clipboard successfully!', {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }} className='bg-[var(--semi-dark2)] p-2 rounded-lg  cursor-pointer '>
                {username && `${username}.${identifier} `}
            </div>
            <div className='w-full flex justify-between items-center mt-3'>
                <div className='text-gray-300 border-l-2 border-blue-500 pl-2 font-thin text-sm w-[60%]'>
                    Your SFTP password is the same as the password you use to access this panel.
                </div>
                <div>
                    <Link to={`sftp://${username}.${identifier}@${address}:${port}`}>
                        <Button variant="default" color="success"  >Launch SFTP</Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

const ReinstallComponent = ({ identifier , setIsInstalling }: { identifier: any, setIsInstalling: any }) => {

    const reinstallServer = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/reinstall/${identifier}`, {
                withCredentials: true
            })
            toast.warning('Server is getting reinstalled!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            setTimeout(() => {
                setIsInstalling(true)
            }, 500)



        } catch (error) {
            toast.error('Something went wrong!', {
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
        <div className='flex flex-col gap-2 w-[40%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='bg-[var(--semi-dark2)] rounded-lg p-2'>
                Reinstall Server
            </div>
            <div className='text-gray-400 mt-4'>
                Reinstalling your server will stop it, and then re-run the installation script that initially set it up. Some files may be deleted or modified during this process, please back up your data before continuing.
            </div>
            <div className='mt-auto ml-auto'>
                <Button onClick={async () => await reinstallServer()} variant="default" color="success" >Reinstall Server</Button>
            </div>
        </div>
    )
}

const ServerDetails = ({aid, identifier, sname, sdesc }: { aid : any,identifier: any, sname: any, sdesc: any }) => {
    const [name, setName] = React.useState<any>(sname)
    const [desc, setDesc] = React.useState<any>(sdesc)

    const renameServer = async () => {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/client/server/rename/${identifier}`, {
                name: name,
                description: desc,
                 aid,
               
            },{
                withCredentials: true
            })
            toast.success('Server details updated successfully!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,

            })
        } catch (error) {
            toast.error('Something went wrong!', {
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
        <div className='flex flex-col gap-2 w-[40%] bg-[var(--quinary-color)] rounded-lg p-4 m-2' >
            <div className='bg-[var(--semi-dark2)] rounded-lg p-2'>
                Change Server Details
            </div>
            <div className='mt-4'>
                Server Name

            </div>
            <div className='mt-0'>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Server Name'

                    textBoxColor='dark:bg-[var(--semi-dark2)]'
                />
            </div>
            <div className='mt-4'>
                Server Description
            </div>
            <div className='mt-0'>
                <Input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder='Server Description'

                    textBoxColor='dark:bg-[var(--semi-dark2)]'
                />
            </div>
            <div className='ml-auto mt-2'>
                <Button onClick={async () => await renameServer()} variant="default" color="success"
                >Update Server Details</Button>
            </div>
        </div>
    )
}
const DebugInfo = ({ serverInfo }: { serverInfo: any }) => {
    return (
        <div className='flex flex-col gap-2 w-[82%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='bg-[var(--semi-dark2)] rounded-lg p-2'>
                DEBUG INFORMATION
            </div>
            <div className='flex justify-between items-center mt-4'>
                <div className='text-gray-300 border-l-2 border-blue-500 pl-2 font-thin  w-[60%]'>
                    NODE
                </div>
                <div className='bg-[var(--semi-dark2)] p-1 rounded-lg px-2'>
                    {serverInfo.clientInfo.node.toUpperCase()}
                </div>
            </div>
            <div className='flex w-full justify-between items-center mt-4'>
                <div className='text-gray-300 border-l-2 border-blue-500 pl-2 font-thin  w-[60%]'>
                    Server ID
                </div>
                <div
                onClick={() => {
                    navigator.clipboard.writeText(serverInfo.clientInfo.uuid)
                    toast.success('Copied to clipboard successfully!', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    })
                }}
                className='bg-[var(--semi-dark2)] p-1 rounded-lg px-2 cursor-pointer'>
                    {serverInfo.clientInfo.uuid.toUpperCase()}
                </div>
            </div>
        </div>
    )
}


export default ServerSettings