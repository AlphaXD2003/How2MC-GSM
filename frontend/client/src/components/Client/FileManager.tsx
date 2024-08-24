import axios from 'axios'
import  { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import { Button } from '../ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,

  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {

  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { DownloadIcon, FileIcon, Undo2Icon } from 'lucide-react'
import { ArchiveBoxArrowDownIcon } from '@heroicons/react/20/solid'
import { Textarea } from '../ui/textarea'
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
import { Checkbox } from "@/components/ui/checkbox"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const FileManager = ({ serverInfo }: { serverInfo: any }) => {
  // //console.log(serverInfo)
  const [files, setFiles] = useState<any>(null)
  const [isCurrentFileIsFile, setIsCurrentFileIsFile] = useState<boolean>(false)
  const [currentFileContent, setCurrentFileContent] = useState<any>(null)
  const [currentDirectory, setCurrentDirectory] = useState<any>([
    "home", "container"
  ])
  const [currentFolder, setCurrentFolder] = useState<any>([
    "home", "container"
  ])
  const [startingPath, setStartingPath] = useState<any>(null)
  const [selectedFilesIndex, setSelectedFilesIndex] = useState<any>([])

  const [allFileIndex, setAllFileIndex] = useState<any>([])
  const [selectedFiles, setSelectedFiles] = useState<any>([])
  const [selectedFilesDetails, setSelectedFilesDetails] = useState<any>([])
  useEffect(() => {
    //console.log('useffect called')
    //console.log('selectedFiles : ', selectedFiles)
    //console.log('allFileIndex : ', allFileIndex)
    //console.log('selectedFilesIndex : ', selectedFilesIndex)




  }, [selectedFiles, allFileIndex, selectedFilesIndex])
  useEffect(() => {
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file: any) => {
        setSelectedFilesDetails((prev: any) => {
          if (prev[file]) return prev
          return [...prev,
          {
            index: file,
            data: allFileIndex[file].file.attributes
          }
          ]
        })
      })
    }
  }, [selectedFiles.length])
  useEffect(() => {
    //console.log('selectedFilesDetails : ', selectedFilesDetails)
  }, [selectedFilesDetails])

  const getFiles = async () => {
    try {
      // //console.log(startingPath)

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/${serverInfo.clientInfo.identifier}`, {
        withCredentials: true,
        params: {
          directory: startingPath?.replace('home/container', '') || '/'
        }
      })

      //console.log(response.data.data.data)
      setFiles(response.data.data.data)
      // setAllFileIndex([])
      response.data.data.data.map((file: any, index: number) => {
        setAllFileIndex((prev: any) => {
          return [...prev, {
            file: file,
            index: index
          }]
        })
        setSelectedFilesIndex((prev: any) => {
          return [...prev, {
            checked: false,
            index: index
          }]
        })
      
        // setSelectedFilesDetails((prev: any) => [...prev , {
        //   index,
        //   data: file.attributes
        // }]);
      //  setSelectedFilesDetails((prev: any) => {
      //     return prev.map((file : any ) => {
      //       return {
      //         index,
      //         data: file.attributes
      //       }
      //     })
      //   })

      })
      setSelectedFilesDetails([])
    

    } catch (error) {
      toast.error("Error getting files", {
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

  const handleBreadCrumbClick = async (index: any) => {
    try {
      if (index === 0) return;

      if (index === currentDirectory.length - 1) return;
      setCurrentFileContent(null)
      setIsCurrentFileIsFile(false)

      //console.log(currentFolder)
      let cfolder = [...currentFolder]
      // //console.log(currentFolder.slice(0 , index + 1))
      // cfolder.splice(0 , index + 1).join("/")
      const tempStartingPath = [...cfolder].splice(0, index + 1)
      //console.log('temp starting path : ', tempStartingPath)
      setStartingPath(tempStartingPath.join("/"))
      // //console.log(currentFolder)
      // //console.log(currentFolder.pop())
      // setCurrentFolder(currentFolder.pop())
      setCurrentFolder(tempStartingPath)
      setCurrentDirectory((prev: any) => {
        let temp = prev
        return temp.slice(0, index + 1)
      })
    } catch (error) {

    }
  }

  const [folderName, setFolderName] = useState<any>(null)
  const [folderOpen, setFolderOpen] = useState<any>(false)
  const createFolder = async () => {
    try {


      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/folder/${serverInfo.clientInfo.identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        name: folderName
      }, {
        withCredentials: true,

      })
      await getFiles()
      toast.success("Folder created successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setFolderName(null)
    } catch (error) {
      toast.error("Error creating the folder", {
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


  const bulkDelete = async () => {
    const files = selectedFilesDetails.map((file : any) => (
       ` ${startingPath?.replace('home/container', '') || ''}/${file.data.name}`
    ))
    //console.log(files)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/delete/${serverInfo.clientInfo.identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        files
      }, {
        withCredentials: true,

      })
      setAllFileIndex([])
      setSelectedFiles([])
      setSelectedFilesIndex([])
      await getFiles()
      // setSelectedFiles([])
      // setSelectedFilesIndex((prev  :any) => 
      // {
      //   //console.log(prev)
      //   return  prev.map((file : any) => ({
      //     ...file , checked: false
      //    }))
      // }
      // )
      // setAllFileIndex([])
      toast.success("File deleted successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error deleting the file", {
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

  const handleSelect = async (value: any) => {
    //console.log(value)
    if (value === 'delete') {
      await bulkDelete()
    }
    // if (value === 'archive') {
    //   bulkArchive()
    // }
    if (value === 'move') {
    //  await moveFiles()
    setMoveOpen(true)
    setMoveTo(null)
    }
  }
  const [moveOpen, setMoveOpen] = useState<any>(false)
  const [moveTo, setMoveTo] = useState<any>(null)
  const moveFiles = async () =>{

    if(!moveTo){
      setAllFileIndex([])
      setSelectedFiles([])
      setSelectedFilesIndex([])
     
       toast.error("Please select a destination folder", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      return await getFiles();
    }
    //console.log('Move Files : ', moveTo);
    const files = selectedFilesDetails.map((file : any) => {
      return {
        from : `${startingPath?.replace('home/container', '') || ''}/${file.data.name}`,
        to : `/${moveTo}/${file.data.name}`
      }
    } )
    //console.log(files)
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/move/${serverInfo.clientInfo.identifier}`, {
      root: startingPath?.replace('home/container', '') || '/',
      files
    },

  )
  setAllFileIndex([])
  setSelectedFiles([])
  setSelectedFilesIndex([])
  await getFiles()
  toast.success("File moved successfully", {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,  
  })
  setMoveOpen(false)
  setMoveTo(null)

  }



  useEffect(() => {
    //console.log('Starting Path : ', startingPath);

    //console.log('Is FIle : ', isCurrentFileIsFile);
    //console.log('Current File Content : ', currentFileContent);
    //console.log('Current Directory : ', currentDirectory);
    //console.log('Current Folder : ', currentFolder);

    if (isCurrentFileIsFile) return;
    if (startingPath === null) return;
    (async () => {

      setSelectedFilesIndex([])
      setSelectedFiles([])
      setAllFileIndex([])
      await getFiles();

    })();
  }, [startingPath])
  useEffect(() => {
    (async () => {
      await getFiles()
    })();
  }, [])
  return (
    <div className='w-full'>
      <div className='flex w-full flex-row justify-between items-center '>
        <div className='flex gap-4 items-center'>
          <div>
            <Checkbox />

          </div>
          <Breadcrumb>
            <BreadcrumbList>

              {
                currentDirectory.map((directory: any, index: number) => {
                  return (
                    <>

                      <BreadcrumbItem onClick={() => handleBreadCrumbClick(index)} value={index} className='cursor-pointer' key={index}>
                        <BreadcrumbLink >{directory}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )
                })
              }

            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className='flex gap-4 items-center'>

          <Dialog open={folderOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={async () => {
                  setFolderOpen(true)
                }}
                variant="outline" className='bg-rose-700 text-white' color="" >Create Directory</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a new Directory</DialogTitle>
                <DialogDescription>
                  Click Save Changes when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder='Enter Server Name'
                    className="col-span-3 w-[200px]"
                    value={folderName}
                    onChange={(e) => {
                      setFolderName(e.target.value)
                    }}
                  />
                </div>

              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    await createFolder()
                    setFolderOpen(false)
                  }}
                  type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className='bg-orange-500 text-white' >Upload </Button>
          <Button variant="outline" className='bg-red-500 text-white' color="warning" >New File</Button>

        </div>
      </div>
      <div>
        {
          selectedFiles?.length > 0 ?
            <Select
            onValueChange={handleSelect}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Bulk Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="archive">Archive</SelectItem>
                <SelectItem value="move">Move</SelectItem>
              </SelectContent>
            </Select>
            : null
        }
      </div>
      <div className='flex mt-4 w-[80%] flex-col gap-1 items-center'>
        {
          isCurrentFileIsFile ? <FileData 
    
          identifier={serverInfo.clientInfo.identifier}
          currentLocation={startingPath}
          setCurrentFileContent={setCurrentFileContent}  content={currentFileContent} /> :
            files && files.map((file: any, index: number) => {

              return <FileComponent

                index={index}
                setSelectedFiles={setSelectedFiles}
                selectedFilesIndex={selectedFilesIndex}
                setSelectedFilesIndex={setSelectedFilesIndex}
                getFiles={getFiles}
                setCurrentFolder={setCurrentFolder}
                currentFolder={currentFolder}
                isCurrentFileIsFile={isCurrentFileIsFile}
                currentFileContent={currentFileContent}
                setIsCurrentFileIsFile={setIsCurrentFileIsFile}
                setCurrentFileContent={setCurrentFileContent}
                startingPath={startingPath}
                setStartingPath={setStartingPath}
                identifier={serverInfo.clientInfo.identifier} setCurrentDirectory={setCurrentDirectory} currentDirectory={currentDirectory} file={file.attributes} key={file.name} />
            })
        }
      </div>
                <Dialog open={moveOpen}>
            <DialogTrigger asChild>
              
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Move to  a new Directory</DialogTitle>
                <DialogDescription>
                  Click Save Changes when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder='Enter Server Name'
                    className="col-span-3 w-[200px]"
                    value={folderName}
                    onChange={(e) => {
                      setMoveTo(e.target.value)
                    }}
                  />
                </div>
                      <div>
                        <div className="text-gray-500 text-sm mx-auto mr-auto">
                          Current Location  - {`${startingPath ? `/home/container${startingPath}` : "/home/container" || ''}/`}
                        </div>
                        {/* <div className="text-gray-500 text-sm mx-auto mr-auto">
                          New Location - {`${startingPath ?  `/home/container${startingPath}`  : "home/container" || ''}/`}{moveTo}
                        </div> */}
                      </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    await moveFiles()
                    setMoveOpen(false)
                  }}
                  type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
      <ToastContainer />
    </div>
  )
}

const FileComponent = ({
  index,
  selectedFilesIndex,
  setSelectedFiles,
  setSelectedFilesIndex,
  getFiles, startingPath, setStartingPath, currentFolder, setCurrentFolder, file, identifier, setCurrentDirectory, currentDirectory, isCurrentFileIsFile, setIsCurrentFileIsFile, currentFileContent, setCurrentFileContent }: {
    getFiles: any, startingPath: any, setStartingPath: any, currentFolder: any,
    index: any,
    selectedFilesIndex: any, setSelectedFiles: any,
    setSelectedFilesIndex: any
    , setCurrentFolder: any, file: any, identifier: any, setCurrentDirectory: any, currentDirectory: any, isCurrentFileIsFile: any, setIsCurrentFileIsFile: any, currentFileContent: any, setCurrentFileContent: any,
  }) => {
  // //console.log(currentDirectory.join("/"))
  // //console.log(file)
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getMonth()];

    const day = date.getDate();
    const daySuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${month} ${day}${daySuffix(day)}, ${year} ${hours}:${formattedMinutes} ${ampm}`;
  };
  const handleOpen = async () => {
    try {
      if (currentDirectory[currentDirectory.length - 1] === file.name) return;

      setCurrentDirectory((prev: any) => [
        ...prev,
        file.name
      ])
    } catch (error) {

    }
  }
  const returnPath = (cdir: any) => {
    return cdir.join("/")
  }

  const getTheContent = async () => {
    try {
      //console.log(file)


      if (!file.is_file) {
        setCurrentFileContent(null)
        setCurrentFolder((prev: any) => [
          ...prev,
          file.name
        ])
      } else {

      }
      let cdir = currentDirectory
      let cfolder = currentFolder
      if (currentFolder[currentFolder.length - 1] !== file.name) {
        cfolder = [
          ...cfolder,
          file.name
        ]
      }
      if (currentDirectory[currentDirectory.length - 1] !== file.name) {
        cdir = [
          ...cdir,
          file.name
        ]
      }

      cdir.splice(0, 2)
      cfolder.splice(0, 2)
      // //console.log(cfolder)


      const isFile = file.is_file
      setIsCurrentFileIsFile(isFile)
      if (isFile) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/${identifier}`, {
          file: `/${returnPath(cdir)}`
        }, {
          withCredentials: true,
        })
        setCurrentFileContent(response.data.data)
      }
      setStartingPath((prev: any) => `/${cfolder.join("/")}`)
      // //console.log(response.data.data)
    } catch (error) {
      //console.log(error)
      toast.error("Error getting the content", {
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

  const downloadFile = async (e: any) => {
    try {
      e.stopPropagation()
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/download/${identifier}`, {
        file: `${startingPath?.replace('home/container', '')}/${file.name}`
      }, {
        withCredentials: true,

      })
      //console.log(response.data.data.url)
      window.open(response.data.data.url, '_blank');
      toast.success("File downloaded successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error downloading the file", {
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

  const deleteFile = async (e: any) => {
    e.stopPropagation()
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/delete/${identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        files: [
          `${startingPath?.replace('home/container', '') || ''}/${file.name}`,
        ]
      }, {
        withCredentials: true,

      })
      await getFiles()
      toast.success("File deleted successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error deleting the file", {
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

  const compressFile = async (e: any) => {
    e.stopPropagation()
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/compress/${identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        files: [
          `${startingPath?.replace('home/container', '') || ''}/${file.name}`,
        ]
      }, {
        withCredentials: true,

      })
      await getFiles()
      toast.success("File compressed successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error compressing the file", {
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

  const decompressFile = async (e: any) => {
    e.stopPropagation()

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/decompress/${identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        file: `${startingPath?.replace('home/container', '') || ''}/${file.name}`,

      }, {
        withCredentials: true,
      })
      await getFiles()
      toast.success("File decompressed successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error decompressing the file", {
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

  const [newFileName, setNewFileName] = useState<any>(file.name)
  const [newFileOpen, setNewFileOpen] = useState<any>(false)
  const renameFile = async () => {

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/rename/${identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        from: `${startingPath?.replace('home/container', '') || ''}/${file.name}`,
        to: `${startingPath?.replace('home/container', '') || ''}/${newFileName}`

      }, {
        withCredentials: true,

      })
      await getFiles()
      toast.success("File renamed successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      toast.error("Error renaming the file", {
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

  const [moveOpen, setMoveOpen] = useState<any>(false)
  const [moveTo, setMoveTo] = useState<any>(`${startingPath?.replace('home/container', '') || ''}/${file.name}`)
  const moveFile = async () => {
    //console.log('Move File : ', moveTo);
    //console.log('Starting Path : ', startingPath);
    //console.log(`To :${startingPath?.replace('home/container', '') || ''}/${moveTo} ` );
    //console.log(moveTo.split('/').length)
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/rename/${identifier}`, {
        root: startingPath?.replace('home/container', '') || '/',
        from: `${startingPath?.replace('home/container', '') || ''}/${file.name}`,
        to: moveTo.split('/').length > 2 ? `${startingPath?.replace('home/container', '') || ''}/${moveTo}` : `/home/container/${moveTo}`

      }, {
        withCredentials: true,

      })
      await getFiles()
      toast.success("File moved successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
      setMoveOpen(false)
      setMoveTo(null)
    } catch (error) {
      toast.error("Error moving the file", {
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
  const handleCheckboxChange = (e: any) => {

    setSelectedFilesIndex((prev: any) => {
      return prev.map((file: any) => {
        if (file.index === index) {
          setSelectedFiles((prev: any) => {
            return [...prev, index]
          })
          return {
            ...file,
            checked: !file.checked
          }
        }
        return file
      })
    })
  }

  return (
    <div onClick={async () => {
      await getTheContent()
      await handleOpen()
    }} className='  cursor-pointer hover:shadow  dark:hover:shadow-lg flex flex-row w-full px-3 py-2 rounded-lg border bg-[var(--quinary-color)] justify-between items-center'>
      <div className='flex gap-4 items-center w-[90%] '>
        <div
          onClick={(e) => {
            e.stopPropagation()
            handleCheckboxChange(e)
          }}
        >
          <Checkbox
              checked = {
                selectedFilesIndex[index]?.checked || false
              }

          />
        </div>
        {file.is_file ? (<i className="fa fa-file" aria-hidden="true"></i>) : (<i className="fa fa-folder" aria-hidden="true"></i>)}
        <div>
          {file.name}
        </div>
      </div>

      <div className='flex gap-4 justify-between w-[600px] items-center'>
        <div className='text-gray-400'>
          {(file.size < 1024) ? Math.ceil(file.size) : (file.size < 1024 * 1024) ? (file.size / 1024).toFixed(2) : (file.size / 1024 / 1024).toFixed(2)} bytes
        </div>
        <div className='text-gray-500'>
          {formatDate(file.modified_at)}
        </div>
        <div>

          <Menu>
            <MenuButton onClick={async (e: any) => {

              e.stopPropagation()
            }} className="inline-flex items-center gap-2 rounded-md  py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
              <img width={"10px"} src='/images/icons8-3-dots-50.png' />
            </MenuButton>

            <MenuItems
              transition
              anchor="bottom start"
              className="ml-14 w-40 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    setNewFileOpen(true)
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <PencilIcon className="size-4 fill-white/30" />
                  Rename
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={async (e) => {
                    await downloadFile(e);
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <DownloadIcon className="size-4 fill-white/30" />
                  Download
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘E</kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button
                onClick={async (e) => {
                  e.stopPropagation()
                  setMoveOpen(true)
                }}
                
                className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <Square2StackIcon className="size-4 fill-white/30" />
                  Move
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                </button>
              </MenuItem>
              <div className="my-1 h-px bg-white/5" />
              <MenuItem>
                <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <FileIcon className="size-4 fill-white/30" />
                  Permission
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘A</kbd>
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  onClick={async (e) => {
                    await compressFile(e)
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <ArchiveBoxArrowDownIcon className="size-4 fill-white/30" />
                  Archive
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                </button>
              </MenuItem>
              {
                (file.is_file && file.name.endsWith('.tar.gz')) ?
                  (
                    <MenuItem key={file.name}>
                      <button
                        onClick={async (e) => {
                          await decompressFile(e)
                          await getFiles()
                        }}
                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                        <Undo2Icon className="size-4 fill-white/30" />
                        Unarchive
                        <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                      </button>
                    </MenuItem>
                  )

                  : null
              }
              <MenuItem>
                <button
                  onClick={async (e) => {
                    await deleteFile(e)
                  }}
                  className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                  <TrashIcon className="size-4 fill-white/30" />
                  Delete
                  <kbd className="ml-auto hidden font-sans text-xs text-white/50 group-data-[focus]:inline">⌘D</kbd>
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <Dialog open={newFileOpen}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger> */}
        <DialogContent
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit File or Folder</DialogTitle>
            <DialogDescription>
              Make changes to your file / folder here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                New Name
              </Label>
              {
                file.is_file ?
                  <Input
                    value={newFileName}
                    onChange={(e) => {
                      setNewFileName(e.target.value)
                    }}
                    id="name"
                    placeholder='Enter a new name for the file'
                    className="col-span-3 w-[200px]"
                  /> :
                  <Input
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    value={newFileName}
                    onChange={(e) => {
                      setNewFileName(e.target.value)
                    }}
                    id="name"
                    placeholder='Enter a new name for the folder'
                    className="col-span-3"
                  />
              }
            </div>

          </div>
          <DialogFooter>
            <Button
              onClick={async (e) => {
                e.stopPropagation()
                await renameFile()
                setNewFileOpen(false)
              }}
              type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={moveOpen}>

        <DialogContent
          onClick={(e) => {
            e.stopPropagation()
          }}
          className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Move File or Folder</DialogTitle>
            <DialogDescription>
              Move your file / folder here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
            className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                New Location
              </Label>
              <Input
                value={moveTo}
                onChange={(e) => {
                  setMoveTo(e.target.value)
                }}
                id="name"
                placeholder='Enter a new location for the file'
                className="col-span-3 w-[200px]"
              />
            </div>

          </div>
          <DialogFooter >
            <div className='flex flex-col '>
            <div className="text-gray-500 text-sm mx-auto mr-auto">
                  Current Location  - {`${startingPath || ''}/${file.name}`}
                  
            </div>
            <div className="text-gray-500 text-sm mx-auto mr-auto">
              New Location - {moveTo}
            </div>
            <br />
            <Button
              onClick={async (e) => {
                e.stopPropagation()
                await moveFile()
                setMoveOpen(false)
              }}
              type="submit">Save changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  )
}

const FileData = ({ 

  content, setCurrentFileContent, currentLocation 
  , identifier
}: { content: any, setCurrentFileContent: any, currentLocation: any, identifier: any  }) => {
//console.log('Data directory : ', currentLocation)
//console.log('type of content : ', typeof content)
//console.log('content : ', content)
  const writeFile = async () => {
    try {
      let acctualContent = content
      if (typeof content === "string") {
        // Remove surrounding quotes if they exist
        acctualContent = content.replace(/^"(.*)"$/, '$1');
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/write/${identifier}`, {
        file: `${currentLocation?.replace('home/container', '') || ''}`,
        content: acctualContent
      }, {
        withCredentials: true,
      })
     await axios.post(`${import.meta.env.VITE_BACKEND_URL}/client/server/files/${identifier}`, {
        file: `${currentLocation?.replace('home/container', '') || ''}`
      }, {
        withCredentials: true,
      })
      setCurrentFileContent(content)
      toast.success("File saved successfully", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      //console.log(error)
      toast.error("Error writing the file", {
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
    <div className='w-full flex flex-col '>
      <Textarea 
      onChange={(e) => setCurrentFileContent(e.target.value)}
      value={content} rows={20} className='w-full  ' />

        <div className='mt-4 ml-auto '>
        <Button
        onClick={async (e) => {
          e.stopPropagation()
          await writeFile()
        }}
        variant="outline" className='bg-orange-500 text-white' color="" >Save</Button>
        </div>

    </div>
  )
}


export default FileManager