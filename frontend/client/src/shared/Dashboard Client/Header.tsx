import AvatarComponent from "@/components/Avatar"
import { Search } from "@/components/Client/SearchBar"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"


const Header = () => {
  const user =  useSelector((state : RootState) => state.user.user)
  return (
    <div className='flex flex-row justify-between items-center mt-4 ml-3'>
      <div className="hidden lg:block text-lg roboto-slab-400">
       {
        user ? ( 
          <div>
            Welcome, {`${user.firstName} ${user.lastName}`}
            </div>
        ) : null
       }
      </div>
      <div className="flex flex-row items-center gap-3">
      <Search />
      <div className="cursor-pointer mr-0 md:mr-3" >
        {
          user && <AvatarComponent size="40" />
        }
      </div>
      </div>

    </div>
  )
}

export default Header