
import axios from 'axios';

export const useUserLimits = async() => {

   
    
        const fetchUserLimits = async () => {
            try {
                const  response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/get-limits`, {
                    withCredentials: true,
                });
                //console.log(response.data.data)
                
                return [response?.data?.data, null];
             
            } catch (error) {
                console.error("Failed to fetch user limits", error);
                return [null, error];
            }
        };

        const [userLimits, error] = await fetchUserLimits();

        return [userLimits, error];
 


};