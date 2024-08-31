import axios from "axios";
import https from "https";
import fs from "fs";
export const useUserLimits = async () => {
  const fetchUserLimits = async () => {
    try {
      const key = fs.readFileSync(
        `/home/subhamoy/Coding/Projects/How2MC-GSM/backend/localhost-key.pem`
      );
      const cert = fs.readFileSync(
        `/home/subhamoy/Coding/Projects/How2MC-GSM/backend/localhost.pem`
      );

      const httpsAgent = new https.Agent({
        cert,
        key,
      });
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/users/get-limits`,
        {
          withCredentials: true,
          httpsAgent,
        }
      );
      //console.log(response.data.data)

      return [response?.data?.data, null];
    } catch (error) {
      //   console.error("Failed to fetch user limits");
      return [null, error];
    }
  };

  const [userLimits, error] = await fetchUserLimits();

  return [userLimits, error];
};
