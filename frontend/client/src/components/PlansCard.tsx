import { Button } from '@mui/material'
import { HoverBorderGradient } from "./ui/hover-border-gradient";

const PlansCard = ({title, semi_title ,description, price }: {title: string, semi_title: string, description: string, price: string}) => {
  return (
    <HoverBorderGradient
    containerClassName="rounded-xl"
    as="div"
    className="dark:bg-black bg-white text-black dark:text-white flex items-center  "
    cnClassName="no-style"
    >
        <div className='w-[300px] cursor-pointer h-[200px] lg:w-[400px] lg:h-[250px] bg-[var(--quinary-color)] flex flex-col justify-center items-center rounded-xl p-4 shadow-xl'>
        <div className='w-[200px] h-[50px] flex justify-center items-center text-white text-2xl font-bold bg-[var(--card-bg)] rounded-md px-4 py-1 uppercase text-center'>{title}</div>
        <div className='mt-4 text-white text-lg font-semibold'>{semi_title}</div>
        <div className='mt-1 text-gray-300 text-sm font-semibold'>{description}</div>
        <div className='flex flex-row gap-4'>
            <div className='border border-gray-300 rounded-md p-2 text-gray-300 text-sm font-semibold'>Starting at ${price}/monthly</div>
            <Button variant='contained'>Select</Button>
        </div>
    </div>
    </HoverBorderGradient>
  )
}

export default PlansCard