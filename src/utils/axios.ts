import axios from "axios";

console.log(`import.meta.env.PUBLIC_API_URL ${import.meta.env.PUBLIC_API_URL}`);
export const instance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
  timeout: 10000,
});
