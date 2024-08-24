import { useEffect, useState } from 'react'
import { Card, CardFooter, CardDescription, CardTitle, CardContent } from '../ui/card'
import axios from 'axios'
import { HoverBorderGradient } from '../ui/hover-border-gradient'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@mui/material'

const GameCards = ({ handleCreateServer,id, description, serverCount, name , db_id
  , choosenEgg, setChoosenEgg, setNestEggCombo, nestEggCombo, setConfirmEgg , setConfirmNest 
}: { db_id:any,id: any, description: String, serverCount: Number, name: String
    , choosenEgg: any, setChoosenEgg : any , setNestEggCombo:any , nestEggCombo:any,
    setConfirmEgg:any,setConfirmNest:any,handleCreateServer:any

 }) => {
  const [selectedEgg, setSelectedEgg] = useState('');
  const [eggDetails, setEggDetails] = useState<any>(null)
  const [isEgg, setIsEgg] = useState(false)
  const getEggDetails = async () => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eggs/egg-details`)
    // //console.log(response.data.data)
    setEggDetails(response.data.data)
    if(choosenEgg){
      // //console.log('choosenEgg',choosenEgg)
      const eggInfo = response.data.data
    if(eggInfo.length > 0){
      const temp_egg = eggInfo.filter((egg : any) => egg.id === choosenEgg).filter((egg : any) => egg.parentNest[0] === id)
      // //console.log('temp_egg',temp_egg)
      if(temp_egg.length > 0){
        setIsEgg(true)
        setSelectedEgg(choosenEgg)
        setChoosenEgg(choosenEgg)
      }
    }
  }
  }
  const handleStringToInt = (value: any) => {
    setChoosenEgg(Number(value))
    setSelectedEgg(value)
    setNestEggCombo((prev : any) => (
      {
        ...prev, [id] : Number(value)
      }
    ))
    // //console.log(nestEggCombo)
  }

  const handleServer = async () => {
    setChoosenEgg(nestEggCombo[id])
    setConfirmEgg(nestEggCombo[id])
    setConfirmNest(id);

  }


  useEffect(() => {
    (async () => {
      await getEggDetails()

    })()
  }, [])
  useEffect(() => {
    if(choosenEgg){
      // //console.log(choosenEgg);
      (async () => {
        await getEggDetails()
      })();

    }
  }, [choosenEgg])
  useEffect(() => {
    if(isEgg){
      // //console.log('isEgg',isEgg)
    }
  }, [isEgg])
  return (

    <HoverBorderGradient
      containerClassName="rounded-full"
      as="div"
      className="dark:bg-black cursor-pointer bg-white text-black dark:text-white flex items-center space-x-2"
      cnClassName='h-[230px] w-[400px] rounded-md'
    >
      <Card className='p-3 h-[230px] w-[25rem] '>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardContent className='flex  flex-col mt-2'>
          <div className=''>
            Total {Number(serverCount)} servers are running for {name}.
          </div>
          <div className='mt-2'>
            <Select value={selectedEgg}  onValueChange={handleStringToInt} >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={isEgg ? 'Choose game1' : `Choose game ${name}`} />
              </SelectTrigger>
              <SelectContent >
                
                {
                  eggDetails && eggDetails.filter((egg : any) => egg.parentNest[0] === id)
                  .map((egg:any, i:Number) => 
                    
                        <SelectItem  key={egg.id || i} value={egg.id || choosenEgg}>{egg.name}</SelectItem>
                  )
                }
                
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className='mt-auto flex  '>
         <div className='ml-auto'>
         <Button  variant='contained' color="success" onClick = {handleServer} >Go ahead</Button>
         </div> 
        </CardFooter>
      </Card>
    </HoverBorderGradient>

  )
}

export default GameCards