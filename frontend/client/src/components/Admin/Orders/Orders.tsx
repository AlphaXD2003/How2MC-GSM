import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { UserPaymentTable } from "./data-table";
import { columns } from "./columns";
import axios from "axios";
interface OrderTableColumn {
  id: string;
  amount: number;
  status: string;
  startingDate: string;
  endingDate: string;
  uid: string;
  sid: string;
}
const Orders = () => {
  const [data, setData] = useState([])
  const [tableData, setTableData] = useState<OrderTableColumn[]>([])
  const getAllOrders = async () =>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders/`,{
        withCredentials: true
      })

      console.log(response.data.data)
      const td = response.data.data
      response.data.data.forEach((ad : any) =>{
          setTableData((prev:any) =>{
            return [
              ...prev,
              {
                id: ad.order_id,
                amount: ad.price,
                status: ad.currentStatus,
                startingDate : `${new Date(ad.startingDateAndTime).toLocaleString()}`,
                endingDate : `${new Date(ad.endingDateAndTime).toLocaleString()}`,
                uid: ad.userId,
                sid: ad.serverId
              }
            ]
          })
      })
      setData(response.data.data)
    } catch (error) {
      toast.error('Error while fetching the orders',{
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: true
      })
    }
  }

  useEffect(() =>{
    ;(async() => await getAllOrders())();
  },[])
  if(!data.length ) return <></>

  return (
    <div className="w-[100%]  rounded-lg ">
      <UserPaymentTable columns={columns} data={tableData} />
    </div>
  );
};

export default Orders;
