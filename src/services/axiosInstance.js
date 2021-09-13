import axios from 'axios'
import API_URL_HOST from '../config/Config'
import authHeader from './auth-header'
const authToken=authHeader()
const axiosInstance = axios.create({
    baseURL: API_URL_HOST.API_URL_HOST,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = authToken.Authorization;
      if (token) {
        config.headers["Authorization"] = token
        // config.headers["x-access-token"] = token; // for Node.js Express back-end
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
      return Promise.reject(err)
    }
  );
  export default axiosInstance