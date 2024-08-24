import { Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

const Databases = ({ serverInfo }: { serverInfo: any }) => {
    //console.log(serverInfo)
    const identifier = serverInfo.clientInfo.identifier
    const [databases, setDatabases] = React.useState<any>([])

    const createDatabase = async (name: any, remote: any) => {
        if (!remote) remote = '%'
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/database/${identifier}`, {
                "database": name,
                remote
            }, {
                withCredentials: true
            })
            toast.success("Database Created", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getDatabases()
            setOpen(false)
            setName('')
            setRemote('%')
        } catch (error) {
            toast.error("Error Creating Database", {
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

    const deleteDatabase = async (id: any) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/client/server/database/${identifier}/${id}`, {
                withCredentials: true
            })
            toast.success("Database Deleted", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getDatabases()
        } catch (error) {
            toast.error("Error Deleting Database", {
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

    const getDatabases = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/databases/${identifier}`, {
                withCredentials: true
            })
            //console.log(response.data.data.data)
            setDatabases(response.data.data.data)
        } catch (error) {

        }
    }
    const [open, setOpen] = React.useState<any>(false)
    const [name, setName] = React.useState<any>('')
    const [remote, setRemote] = React.useState<any>('%')
    useEffect(() => {
        (async () => {
            await getDatabases()
        })();
    }, [])
    return (
        <div className='w-full '>
            <div className='flex justify-between mt-2   '>
                <div className='text-xl'>
                    {
                        databases.length <= 0 ? "No Databases" : null
                    }
                </div>
                <div className='mr-2 '>
                    {/* <Button variant="contained" className="mr-2" >New Database</Button> */}
                    <Dialog open={open} >
                        <DialogTrigger asChild>
                            <Button variant="contained" className="mr-2" onClick={() => setOpen(true)}>New Database</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create Database</DialogTitle>
                                <DialogDescription>
                                    Make changes to your database here. Click save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4 w-full">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        placeholder='Enter the name of the database'
                                        className=" w-[270px]"
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="username" className="text-right">
                                        Remote
                                    </Label>
                                    <Input
                                        id="remote"
                                        defaultValue="%"
                                        className="col-span-3 w-[270px]"
                                        onChange={(e) => setRemote(e.target.value)}
                                        value={remote}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" onClick={async () => {
                                    await createDatabase(name, remote)
                                    setOpen(false)
                                }}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
            <div className='mt-2'>
                {
                    databases && databases.map((database: any) => {
                        return <DatabaseCard getDatabases={getDatabases} identifier={identifier} deleteDatabase={deleteDatabase} database={database.attributes} key={database.name} />
                    })
                }
            </div>
            <ToastContainer />
        </div>
    )
}

const DatabaseCard = ({ database,getDatabases, identifier, deleteDatabase }: { database: any, getDatabases: any, identifier: any, deleteDatabase: any }) => {
    const roratePassword = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/database/password/${identifier}/${database.id}`, {
                withCredentials: true
            })
            toast.success("Password Rotated", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            await getDatabases();

        } catch (error) {
            toast.error("Error Rotating Password", {
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
        <div className='w-[800px] bg-[var(--quinary-color)] flex justify-between mb-3 p-4 rounded-lg    '>
            <div className='flex gap-3 items-center'>
                <i className="fa text-xl fa-hdd-o" aria-hidden="true"></i>
                <div className='text-xl'> {database.name} </div>
            </div>
            <div className='flex gap-4 items-center'>
                {/* <Button color="warning" variant="contained" className="mr-2" >Open</Button> */}
                <Drawer>
                    <DrawerTrigger>
                        <Button color="warning" variant="contained" className="mr-2" >Open</Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Database [{database.name}] </DrawerTitle>
                            <DrawerDescription>Here you will get all the information about the database.</DrawerDescription>
                        </DrawerHeader>
                       
                            <div className='m-2'>
                                <div>
                                    Endpoint
                                </div>
                                <div className="cursor-pointer mt-1" onClick={() =>{
                                     navigator.clipboard.writeText(database.host.address + ':'+ database.host.port)
                                     toast.success('Endpoint Copied')
                                }} >
                                    <div className='bg-[var(--quinary-color)] p-2 rounded-lg' >{database.host.address + ':'+ database.host.port}</div>
                                </div>
                                <div className='mt-2'>
                                    Connection From
                                </div>
                                <div className='cursor-pointer  mt-1' onClick={() => {
                                    navigator.clipboard.writeText(database.connections_from)
                                    toast.success('Connections From Copied')
                                }} >
                                    <div className='bg-[var(--quinary-color)] p-2 rounded-lg' >{database.connections_from}</div>
                                </div>

                                <div className='mt-2'>
                                    Username
                                </div>
                                <div className='cursor-pointer mt-1' onClick={() => {
                                    navigator.clipboard.writeText(database.username)
                                    toast.success('Username Copied')
                                }} >
                                    <div className='bg-[var(--quinary-color)] p-2 rounded-lg' >{database.username}</div>
                                </div>
                                
                                <div className='mt-2'>
                                    Password
                                </div>
                                <div className='cursor-pointer mt-1' onClick={() =>{
                                    navigator.clipboard.writeText(database.relationships.password.attributes.password)
                                    toast.success('Password Copied')
                                }} >
                                    <div className='bg-[var(--quinary-color)] p-2 rounded-lg' >{database.relationships.password.attributes.password}</div>
                                </div>
                            </div>

                    
                        <DrawerFooter>
                            <Button onClick={async() => await roratePassword()}>Rotate Password</Button>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <Button onClick={() => deleteDatabase(database.id)} color="error" variant="contained" className="mr-2" >Delete</Button>

            </div>
        </div>
    )
}



export default Databases