import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
