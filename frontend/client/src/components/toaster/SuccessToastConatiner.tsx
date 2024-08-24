
import { Bounce, ToastContainer } from "react-toastify";
const SuccessToastConatiner = ({theme} : {theme: "dark" | "light"}) => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      transition={Bounce}
    />
  );
};

export default SuccessToastConatiner;
