
import {  toast, Bounce } from 'react-toastify';
const SuccessToadtEmitter = ({ message }: { message: string }) => {
  return (
    toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        })
  )
}

export default SuccessToadtEmitter