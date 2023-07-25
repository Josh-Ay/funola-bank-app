import axios from "axios";

// const baseURL = 'https://yoola-bank-app.onrender.com';
const baseURL = 'https://real-fly-hoodie.cyclic.app';
const countriesBaseURL = 'https://restcountries.com/v3.1/all';

export const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: baseURL,
})

export const countriesAxiosInstance = axios.create({
    baseURL: countriesBaseURL,
})
