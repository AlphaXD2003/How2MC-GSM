import { Button } from "@mui/material";
import axios from "axios";
import {
  Backpack,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Pin,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { setEggId,  setPrice,  setProductId } from "@/slice/orderSlice";
import serverCreatedHtml from "@/template/ServerCreated";
import orderCreatedHtml from "@/template/OrderCreated";


const ProductPlanCard = ({ plan }: { plan: any }) => {
  //console.log(plan);
  const [eggs, setEggs] = useState<any>([]);
  const dispatch = useDispatch()
  const [EggId, SetEggId] = useState<any>(null)
  const [locationId, setLocationId] = useState<any>(useSelector((state: any) => state.order.locationId))
  const [priceAmount, setPriceAmount] = useState<any>()
  // useSelector
  const eggId = useSelector((state: any) => state.order.eggId)
  const productId = useSelector((state: any) => state.order.productId)
  const price = useSelector((state: any) => state.order.price)
  const paymentType = useSelector((state: any) => state.order.paymentType)



  // Order Starts
  const [buyNow, setBuyNow] = useState<any>(false)
  const [event, setEvent] = useState<any>(null)
  const createOrder = async(e : any) => {
    try {
      setBuyNow(true)
      setEvent(e)
      
    } catch (error) {
      
    }
  }
  const { toast } = useToast()
  const createOrderMain = async () => {
    try {
      // //console.log('hello')
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/razorpay/create-order`, {
        locationId: locationId,
        eggId: eggId,
        productId: productId,
        amount: priceAmount,
        paymentType: paymentType,
      }, {
        withCredentials: true,
      })
      ////console.log('Response: ',response.data.data)
      const order = response.data.data
      //console.log(order)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: priceAmount * 100,
        currency: "INR",
        name: "How2MC",
        description: "Order Placed",
        image: "https://w7.pngwing.com/pngs/960/884/png-transparent-minecraft-app-logo-games-minecraft.png",
        order_id: order.id,
        prefill: {
          name: order.name,
          email: order.email,
          contact: order.contact,
          address: order.address,
          city: order.city,
          state: order.state,
          country: order.country,
          postal_code: order.postal_code,
          mobile: order.mobile,
        },
        meta: {
          orderId: order._id,
          productId: productId,
          eggId: eggId,
          locationId: locationId,
        },
        handler : async function(response : any) {
          ////console.log('Response: ',response)
          const body = {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }
          const validateRResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/payment/razorpay/verify-order`, body, {
            headers:{
              'Content-Type': 'application/json'
            },
            withCredentials: true,
          })
          ////console.log('Validate Response: ',validateRResponse)
            setBuyNow(false)
            setEvent(null)
            setEggId(null)
            dispatch(setEggId(null))
            dispatch(setProductId(null))
            dispatch(setPrice(null))
          if(validateRResponse.status === 200){
            



            toast({
              title: "Order Placed Successfully!",
            })

            // create a server
            try {
              const user = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/get-user`, {}, {
                withCredentials: true,
              })
              const getEggInformation = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`, {
                eggId: eggId,
              }, {
                withCredentials: true,
              })
              const nest = getEggInformation.data.data.parentNest[0]
              const startUpRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo/${nest}/${eggId}`,{
                withCredentials: true,
              })
              const envReady = startUpRes.data.data.relationships.variables.data
              const startup = startUpRes.data.data.startup
              const pteroId = user.data.data.pteroId
              const username = user.data.data.username
              //console.log(pteroId)
              //console.log(eggId)
              //console.log(startup)
              //console.log(envReady)
              let envInfo : any = {}
              envReady.map((v: any) => {
                envInfo[v.attributes.env_variable] = v.attributes.default_value
              })
              //console.log(envInfo)


              const limits = {
                cpu: plan.resources.cpu,
                memory: plan.resources.ram,
                disk: plan.resources.storage,
                swap : 512,
                io: 500,

                
              }
              const feature_limits = {
                allocations: plan.resources.allocation ,
                backups: plan.resources.backup,
                databases: plan.resources.database,
                
              }

              const allocation = {
                default: plan.resources.allocation,
              }

              const deploy = {
                locations: [locationId],
                dedicated_ip: false,
                port_range: [],
              }
              const docker_image = startUpRes.data.data.docker_image
              const server = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/servers/create`, {
                name: `${username}'s server [${plan?.name}]`,
                user: pteroId,
                eggInfo: eggId,
                docker_image: docker_image,
                startup: startup,
                environment: envInfo,
                limits: limits,
                feature_limits: feature_limits,
                allocation: allocation,
                deploy: deploy,
                cost: priceAmount,
                status : "paid"
                
              }, {
                withCredentials: true,
              })
              //console.log(server.data.data)
              const serverId = server.data.data.attributes.id

              const serverInfo = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/servers/info/${serverId}`, {
                withCredentials: true,
              })
              const server_id = serverInfo.data.data._id
              
              // update order
              const updatedOrder = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/orders/updateOrder`, {
                orderId: order.id,
                serverId: server_id,
                status: 'delivered',
              }, {
                withCredentials: true,
              })
              toast({
                title: "Server Created Successfully!",
              })

              const user_email = user.data.data.email
              let serverCreatedHtmlActual = serverCreatedHtml.replace("{{username}}", username)
              serverCreatedHtmlActual = serverCreatedHtmlActual.replace("{{serverId}}", server_id)

              let orderCreatedHtmlActual = orderCreatedHtml.replace("{{username}}", username)
              orderCreatedHtmlActual = orderCreatedHtmlActual.replace("{{orderId}}", order.id)
              const sm1 = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mail`, {
                to:  user_email,
                subject: "Order Created",
                body: orderCreatedHtmlActual,
              }, {
                withCredentials: true,
              })

              const sm2 = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/mail`, {
                to:  user_email,
                subject: "Server Created",
                body: serverCreatedHtmlActual,
              }, {
                withCredentials: true,
              })
             

            } catch (error) {
              
            }
          
          }else{

           

            toast({
              title: "Order Placed Failed!",
            })
          }
        },

      }

      let rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function(response : any) {
        ////console.log(response);
        toast({
          title: "Payment Failed!",
        });
      });
      event.preventDefault();

    } catch (error) {
      toast({
        title: "Creating the order failed!",
      });
    }
  }

  useEffect(() => {
    if(buyNow){
      ////console.log(locationId)
      ////console.log(plan)
      ////console.log(eggId)
      ////console.log(productId)
      ////console.log(price)
      ////console.log(paymentType);
      // //console.log('hello');
      (async () => {
        await createOrderMain()
      })();
      setBuyNow(false)
    }
  },[buyNow])

  // Order Ends

  
  const getEggDetails = async (id: any) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/eggs/egginfo`,
        {
          eggId: id,
        },
        {
          withCredentials: true,
        }
      );
      ////console.log(response.data.data);
      setEggs((prev: any) => [...prev, response.data.data]);
    } catch (error) {
      toast({
        title: "Getting the eggs failed!",  
      });
    }
  };


  useEffect(() => {
    if (plan.eggId) {
      plan.eggId.map(async (eggId: any) => {
        await getEggDetails(eggId);
      });
    }

    return () => {
      setEggs([]);
    };
  }, []);

  return (
    <div className="  w-[400px] flex flex-col m-4 p-4 border-2 border-gray-700 rounded-lg bg-[var(--quinary-color)]">
      <div className="mx-auto ">
        <img
          src={plan.image}
          alt={plan.name}
          className="w-[150px]  object-cover rounded-lg"
          loading="lazy"
        />
      </div>
      <div className="mt-3 uppercase text-2xl font-bold text-gray-100 mx-auto">
        {plan?.name}
      </div>
      <div className="mt-3 bg-[#0195f4] p-3 rounded-lg text-white text-2xl font-bold">
        {`₹${plan?.price} / month`}
      </div>
    <div className="mt-3">
    <Select
      onValueChange={
        (v : any) => {
          SetEggId(v)
          setPriceAmount(plan.price)
          dispatch(setPrice(plan.price))
          dispatch(setEggId(v))
          dispatch(setProductId(plan._id))
        }
      }
    >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a Software" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Server Software</SelectLabel>
           
                {
                    eggs && eggs.map((egg: any, index: number) => {
                        return (
                            <SelectItem value={egg.id} key={index}>
                                {egg.name}
                            </SelectItem>
                        );
                    })
                }
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <Cpu color="blue" size={30} />
        {`${plan.resources.cpu}% CPU`}
        {` - `}
        {` [ Xeon/Epyc 3.6GHz ]`}
      </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <MemoryStick color="blue" size={30} />
        {`${Math.ceil(plan.resources.ram / 1024)}GB DDR5 RAM`}
      </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <HardDrive color="blue" size={30} />
        {`${Math.ceil(plan.resources.storage / 1024)}GB NVME SSD`}
      </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <Backpack color="blue" size={30} />
        {`${plan.resources.backup} Backups`}
      </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <Database color="blue" size={30} />
        {`${plan.resources.database} Databases`}
      </div>
      <div className="flex gap-3 text-lg items-center mt-5 mx-auto justify-center">
        <Pin color="blue" size={30} />
        {`${plan.resources.allocation} Port Allocation`}
      </div>
      <div className="mt-8 flex w-full ">
       
        <div className="ml-auto">
        <Button
        disabled = {!EggId}
        onClick = {async (e : any) => {
          setPriceAmount(plan.price)
          dispatch(setEggId(EggId))
          dispatch(setProductId(plan._id))
          dispatch(setPrice(plan.price))
          await createOrder(e)
        }}
        variant="contained" color="error" className="mt-5 mx-auto">
          Buy Now
        </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default ProductPlanCard;
