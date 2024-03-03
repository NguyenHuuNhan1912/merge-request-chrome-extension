import axios from "axios";
import { BASE_URL } from "@/shares/constants/api.enum";

const baseURL = BASE_URL.BASE_URL_API;

const publicClient = axios.create({
  baseURL
});

publicClient.interceptors.request.use(async (config: any) => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
    },
  };
});

publicClient.interceptors.response.use((response) => {
  
  if (response && response.data) return response.data;
  return response;
}, (err) => {
  throw err.response.data;
});

export default publicClient;