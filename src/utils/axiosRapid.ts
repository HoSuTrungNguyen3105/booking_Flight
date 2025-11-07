import axios from "axios";

export const axiosRapid = axios.create({
  baseURL: "https://wft-geo-db.p.rapidapi.com/v1/",
  headers: {
    "Content-Type": "application/json",
    "X-RapidAPI-Key": "d0f81ef94amsh2bf5537ea7d8bc6p182b9bjsn4e67a7051177",
    "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
  },
});
