import axios from 'axios'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
    ArchiveBoxXMarkIcon,
    ChevronDownIcon,
    PencilIcon,
    Square2StackIcon,
    TrashIcon,
} from '@heroicons/react/16/solid'
import { DownloadIcon } from 'lucide-react'
import { IconRestore } from '@tabler/icons-react'
import { LockClosedIcon } from '@heroicons/react/20/solid'
import { toast, ToastContainer } from 'react-toastify'
import { Switch } from '@headlessui/react'
import { Textarea } from '../ui/textarea'
const Backups = ({ serverInfo }: { serverInfo: any }) => {
    // //console.log(serverInfo)
   
    const [backups, setBackups] = React.useState<any>(null)
    const [allowedBackUps, setAllowedBackUps] = React.useState<any>(serverInfo.serverInfo.backups)
    const [totalBackUps, setTotalBackUps] = React.useState<any>(null)
    // //console.log(allowedBackUps)

    const [enabled, setEnabled] = useState(false)
    const [backupName, setBackupName] = React.useState<any>(null)
    const [open, setOpen] = useState(false)
    const [ignoredFiles, setIgnoredFiles] = useState<any>([])
    const getBackups = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/backups/${serverInfo.clientInfo.identifier}`, {
                withCredentials: true
            })
            setBackups(response.data.data.data)
            setTotalBackUps(response.data.data.data.length)
            // //console.log(response.data.data.data)
        } catch (error) {
            setBackups([])
        }
    }
    const createBackUp = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/backups/${serverInfo.clientInfo.identifier}`, {
                name: backupName,
                ignored_files: ignoredFiles.includes(',') ? ignoredFiles.split(',') : [ignoredFiles],
                locked: enabled
            }, {
                withCredentials: true
            })
            toast.success("Backup created successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            await getBackups();
            setOpen(false)
            setBackupName(null)
            setIgnoredFiles(null)
            setEnabled(false)
        } catch (error) {

            toast.error( "Failed to create backup", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }finally {
            setOpen(false)
        }
    }



    React.useEffect(() => {
        ; (async () => {

            await getBackups()
        })();
    }, [])
    return (
        <div className='mt-4'  >
            <div className='flex justify-between items-center'>
                <div className='flex gap-2 items-center'>
                    <h1 className='text-2xl font-bold'>Backups</h1>
                    <div className='text-gray-500'>
                        [{totalBackUps}/{allowedBackUps}] is created.
                    </div>
                </div>
                <div>
                    {/*  <Button 
                    disabled={totalBackUps >= allowedBackUps}
                    variant="default" color="success"  >Create Backup</Button>*/}
                    <Dialog open= {open} >
                        <DialogTrigger className='mr-10' asChild>
                            <Button
                                onClick={() => setOpen(true)}
                                disabled={totalBackUps >= allowedBackUps}
                                variant="default" color="success"  >Create Backup</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] w-full">
                            <DialogHeader>
                                <DialogTitle>Create Backup</DialogTitle>
                                <DialogDescription>
                                    Fill the fields below to create a backup.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 w-full py-4">
                                <div className='w-[100%] flex gap-2 items-center'>
                                    <div className='ml-auto text-xl text-gray-400 '> 
                                        {
                                            enabled ? "Locked" : "Unlocked"
                                        }
                                    </div>
                                    <div className=''>
                                        <Switch
                                            checked={enabled}
                                            onChange={setEnabled}
                                            className="group relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
                                            />
                                        </Switch>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Backup Name
                                    </Label>
                                    <Input
                                        value={backupName}
                                        onChange={(e) => setBackupName(e.target.value)}
                                        id="name"
                                        defaultValue=""
                                        placeholder='Backup Name'
                                        className="w-[250px] col-span-3"

                                    />
                                </div>
                                <div className="grid w-full gap-1.5 mt-2">
                                <Label htmlFor="imessage">Ignored Files</Label>
                                    <Textarea
                                         id="imessage"
                                        value={ignoredFiles}
                                        onChange={(e) => setIgnoredFiles(e.target.value)}
                                        
                                       
                                        placeholder='Seperate the files with a comma'
                                       
                                        
                                        rows={14}

                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={async() => {
                                    await createBackUp()
                                }} type="submit">Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className='flex flex-wrap gap-4 w-[82%]'>
                {backups && backups.map((backup: any, index: number) => {
                    return (
                        <BackUpComponent getBackups={getBackups} identifier={serverInfo.clientInfo.identifier} key={index} backup={backup.attributes} />
                    )
                })}
            </div>
            <ToastContainer />
        </div>
    )
}

const BackUpComponent = ({ backup , identifier, getBackups }: { backup: any, identifier: any, getBackups: any }) => {
    // //console.log(backup)

    const calculateTimeDifference = (dateString: any) => {
        const givenDate = new Date(dateString);
        const currentDate = new Date();
        const differenceInMilliseconds = currentDate.getTime() - givenDate.getTime();

        const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
        const differenceInHours = Math.floor(differenceInMinutes / 60);
        const differenceInDays = Math.floor(differenceInHours / 24);

        return {
            days: differenceInDays,
            hours: differenceInHours % 24,
            minutes: differenceInMinutes % 60,
        };
    };

    const downloadBackup = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/backup/download/${identifier}/${backup.uuid}`, {
                withCredentials: true
            })
            toast.success("Backup downloaded successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
   
            window.open(response.data.data.url, '_blank')
        } catch (error) {

            toast.error("Failed to download backup", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const deleteBackup = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/client/server/backup/delete/${identifier}/${backup.uuid}`, {
                withCredentials: true
            })
            toast.success("Backup deleted successfully", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            await getBackups();
        } catch (error) {

            toast.error("Failed to delete backup", {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }


    return (
        <div className='flex flex-row justify-between gap-2 w-[100%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='flex flex-row gap-4 items-center' >
                <div>
                    <img width="30px" src='/images/icons8-delete-240.png' />
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                        <div className='font-sans text-gray-200'>
                            {backup.name}
                        </div>
                        <div className='text-gray-500 text-sm'>
                            {(backup.bytes / 1000000).toFixed(2)} MB
                        </div>
                    </div>
                    <div className='text-gray-400 font-serif'>
                        {backup.checksum}
                    </div>
                </div>
            </div>
            <div className='flex flex-row gap-12 items-center' >
                <div className='flex flex-col gap-2 items-center'>
                    <div className='text-gray-400 '>
                        {
                            `${calculateTimeDifference(backup.completed_at).days} days ${calculateTimeDifference(backup.completed_at).hours} hours ${calculateTimeDifference(backup.completed_at).minutes} minutes`
                        }
                    </div>
                    <div className='text-gray-500 font-serif'>
                        {
                            backup.is_successful ? "Successful" : "Failed"
                        }
                    </div>
                </div>
                <div className='cursor-pointer'>
                    {/* <img width="20px" src='/images/icons8-3-dots-50.png' /> */}
                    <div className="">
                        <Menu>
                            <MenuButton className="inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                                <img width="20px" src='/images/icons8-3-dots-50.png' />

                            </MenuButton>

                            <MenuItems
                                transition
                                anchor="bottom start"
                                className="w-40 mt-1 ml-12 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                            >
                                <MenuItem>
                                    <button onClick={async () => await downloadBackup()} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <DownloadIcon className="size-4 fill-white/30" />
                                        Download

                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <IconRestore className="size-4 fill-white/30" />
                                        Restore

                                    </button>
                                </MenuItem>
                                <div className="my-1 h-px bg-white/5" />
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <LockClosedIcon className="size-4 fill-white/30" />
                                        Lock

                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button onClick={async () => await deleteBackup()} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                                        <TrashIcon className="size-4 fill-white/30" />
                                        Delete

                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Backups