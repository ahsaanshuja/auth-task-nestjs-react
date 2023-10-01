import axios, { AxiosInstance } from "axios";
import cookie from "cookie";

export const baseURL = process.env.REACT_APP_BASE_URL;
const instance: AxiosInstance = axios.create({ baseURL });

export const setAuth = () => {
  const cookies = cookie.parse(document.cookie);
  const user = cookies.user ? JSON.parse(cookies.user) : {};
  const token = user?.token || "";

  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

setAuth();

export default instance;
