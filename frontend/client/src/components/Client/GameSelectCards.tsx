import axios from 'axios'
import React, { useEffect, useState } from 'react'
import GameCards from './GameCards'

const GameSelectCards = ({handleCreateServer,setChoosenEgg,choosenEgg, setConfirmEgg , setConfirmNest } : {handleCreateServer:any,choosenEgg:any,setChoosenEgg:any,setConfirmEgg:any,setConfirmNest:any }) => {
    
    const [nestDetails, setNestDetails] = useState<any>(null)
    const [nestEggCombo, setNestEggCombo] = useState<any>(null);

    const getNestDetails = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/nests/nest-details`)
        // //console.log(response.data.data)
        setNestDetails(response.data.data)
    }

    useEffect(() => {
        if(!nestDetails) return;
        nestDetails.map((nest : any) => {
            setNestEggCombo((prev : any) => ({
                ...prev,
                [nest.id] : null
            }))
        })
    },[nestDetails])

    useEffect(() => {
        (async() => {
            
            await getNestDetails()
        })()
    },[])
  return (
    <>
    <div className='mt-8'>
            Select a Game
        </div>
    <div className='mt-2 grid grid-cols-2 lg:grid-cols-3 space-y-2'>
        
        {
            nestDetails  && nestDetails.map((nest : any, index : Number) => {
                return (
                    <div className='w-[400px]' key={nest.id || index}>
                        <GameCards 
                        handleCreateServer={handleCreateServer}
                        setNestEggCombo={setNestEggCombo}
                        nestEggCombo={nestEggCombo}
                            choosenEgg={choosenEgg}
                            setChoosenEgg={setChoosenEgg}
                            db_id={nest._id}
                            description={nest.description}
                            serverCount={Number(nest.servers.length)}
                            name={nest.name}
                            id={nest.id}
                            setConfirmEgg={setConfirmEgg}
                            setConfirmNest={setConfirmNest}
                           
                        />
                    </div>
                )
            })
        }
    </div>
        </>
  )
}

export default GameSelectCards