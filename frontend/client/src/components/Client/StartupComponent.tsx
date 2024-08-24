import axios from 'axios'
import React, { useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '../ui/input'
import { Button } from '../ui/button'

const StartupComponent = ({ serverInfo }: { serverInfo: any }) => {
    const eggId = serverInfo.info.egg
    // //console.log(eggId)
    const [nestId, setNestId] = React.useState<any>(null)
    const [dockerImages, setDockerImages] = React.useState<any>([])
    const getNestId = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/nests/get-nest-of-egg/${eggId}`)
            // //console.log((response.data.data)[0])
            setNestId((response.data.data)[0].id)
        } catch (error) {
            //console.log(error)
        }
    }

    const getDockerImages = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${nestId}/${eggId}`)
            // //console.log(response.data.data.docker_images)
            setDockerImages(response.data.data.docker_images)
            // //console.log('data' , serverInfo.clientInfo.docker_image.split(':')[1])
        } catch (error) {

        }
    }
    useEffect(() => {
        ;(async () => {
            await getNestId();
        })();
    }, [eggId])
    useEffect(() => {
        if (nestId) {
            // //console.log(nestId);
            (async () => {
                await getDockerImages()
            })()
        }
    }, [nestId])
    // //console.log(serverInfo)
    return (
        <div className='flex flex-wrap gap-4 w-[100%]'>
            <STARTupCommand serverInfo={serverInfo} />
            <DockerImage dockerImages={dockerImages} serverInfo={serverInfo} />
            <VariableComponent serverInfo={serverInfo} />
            <ToastContainer />

        </div>
    )
}

const STARTupCommand = ({ serverInfo }: { serverInfo: any }) => {
    return (
        <div className='flex flex-col gap-2 w-[50%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div >
                Startup Command
            </div>
            <div
                onClick={() => {
                    navigator.clipboard.writeText(serverInfo.clientInfo.invocation)
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
                className=' text-gray-300 cursor-pointer mt-4 bg-[var(--semi-dark2)] rounded-lg p-2'>

                {serverInfo.clientInfo.invocation}
            </div>
        </div>
    )
}

const DockerImage = ({ serverInfo, dockerImages }: { serverInfo: any, dockerImages: any }) => {
    const eggId = serverInfo.info.egg
    // //console.log(eggId)
    
    const changeDockerImage = async (docker_image: any) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${serverInfo.info.id}`, {
                image :  docker_image
            })
            // //console.log(response.data.data)
            toast.success('Docker image changed successfully!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
        } catch (error) {
            toast.error('Docker image change failed!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            })
            //console.log(error)
        }
    }

    return (
        <div className='flex flex-col gap-2 w-[30%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div >
                Docker Image
            </div>
            
            <div className="w-full">
                <Select onValueChange={async (value) => await changeDockerImage(value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={serverInfo.clientInfo.docker_image.split(':')[1].replace('_' , ' ').toUpperCase()} />
                    </SelectTrigger>
                    <SelectContent>
                        
                        {
                            dockerImages && 
                            Object.entries(dockerImages).map(([key, value, index] : any) =>
                                <SelectItem key={index} value={value}>{key.toUpperCase()}</SelectItem>
                            )
                        }
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

const VariableComponent = ({ serverInfo }: { serverInfo: any }) => {
    // //console.log(serverInfo)
    const [environmentVariables, setEnvironmentVariables] = React.useState<any>(null)



    useEffect(() => {
        if (environmentVariables) {
            //console.log(environmentVariables)
        }
    }, [environmentVariables])



    useEffect(() => {
        if (serverInfo?.clientInfo?.relationships?.variables?.data) {
            setEnvironmentVariables(serverInfo?.clientInfo?.relationships?.variables?.data)
        }
    }, [serverInfo])



    return (
        <div className='w-full flex flex-wrap mt-4 items-center'>
            <div className='text-xl font-bold'>
                Variables
            </div>
            <div className='flex flex-wrap gap-4 w-[100%] items-center'>
                {
                    serverInfo?.clientInfo?.relationships?.variables?.data &&
                    serverInfo?.clientInfo?.relationships?.variables?.data.map((v :any, index : any)  =>
                        <Variable serverInfo={serverInfo} key={index} environmentVariables={environmentVariables} setEnvironmentVariables={setEnvironmentVariables} variable={v.attributes} />
                    )
                }
            </div>

        </div>
    )
}

const Variable = ({serverInfo, variable , setEnvironmentVariables , environmentVariables }: {serverInfo:any, variable: any, setEnvironmentVariables: any, environmentVariables: any }) => {
    const [value, setValue] = React.useState<any>(variable.server_value || variable.default_value)
    const [key, setKey] = React.useState<any>(variable.name)

    const transformEnvironmentVariables = (environmentVariables: any[]) => {
        return environmentVariables.reduce((acc, variable) => {
            const key = Object.keys(variable)[0];
            const value = variable[key];
            acc[key] = value;
            return acc;
        }, {});
    };
    const UpdateVariable = async () => {
        try {
            const newEnvVAr = environmentVariables.map((v : any) => {
                if (v.attributes.name === key) {
                    return {
                        ...v,
                        attributes: {
                            ...v.attributes,
                            server_value: value
                        }
                    }
                } else {
                    return v
                }
            })
            // //console.log(newEnvVAr)
            setEnvironmentVariables(newEnvVAr)
            setKey(key)
            setValue(value)
            const environment = newEnvVAr.map((v : any) => (
                {
                    [v.attributes.env_variable] : v.attributes.server_value
                }
            ))
            //console.log(environment)
            const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/servers/update/startup/${serverInfo.info.id}`, {
                
                environment : transformEnvironmentVariables(environment),
                
            })
            toast.success('Variable updated successfully!', { position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined })
        } catch (error) {
            toast.error('Variable update failed!', { position: "bottom-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true })
        }
    }

    useEffect(() => {
        if (environmentVariables) {
            // //console.log(environmentVariables)
        }
    }, [environmentVariables])

    return (
        <div className='flex flex-col gap-2 w-[40%] bg-[var(--quinary-color)] rounded-lg p-4 m-2'>
            <div className='bg-[var(--card-bg)] rounded-lg p-2'> 
                {variable.name}
            </div>
            <div className='mt-4'>
                <Input 
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                        
                    }}
                    placeholder={variable.name}
                    textBoxColor='dark:bg-[var(--semi-dark2)]'
                />
            </div>
            <div className='ml-auto mt-2'>
                <Button variant="default" color="" onClick={async () => {
                    await UpdateVariable()
                }} >Update</Button>
            </div>

        </div>
    )
}

export default StartupComponent