
import { Link } from 'react-router-dom'

const SubscribeNewsLater = () => {
  return (
    <div className='w-full my-4 lg:my-10 flex flex-col items-center justify-center bg-[var(--quinary-color)] py-10 px-4 lg:px-20 lg:py-10'>
        <div className='roboto-slab-600  text-2xl lg:text-4xl text-center'>Subscribe to our newsletter to get the latest updates</div>
        <div className='roboto-slab-400 text-xl lg:text-2xl mt-4  dark:text-gray-500'>We will never spam you with promotional emails</div>
        <div className='flex flex-col items-center justify-center lg:flex-row lg:items-center mt-4 lg:mt-10'>
            <Link to={'#'}>
                <div className='text-lg lg:text-xl uppercase font-bold text-center px-3 py-2 lg:px-6 lg:py-4 bg-[var(--text-color)] rounded-xl hover:shadow hover:shadow-black'>
                    Subscribe
                </div>
            </Link>
        </div>
    </div>
  )
}

export default SubscribeNewsLater