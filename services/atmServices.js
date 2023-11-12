import { axiosInstance } from "./config"

export class AtmServices {
    constructor () {
        this.urlPrefix = 'atm'
    }

    getNearbyAtms = async () => {
        return await axiosInstance.get(`${this.urlPrefix}/nearby-atms`)    
    }

    findAtmWithinDistance = async (data) => {
        return await axiosInstance.post(`${this.urlPrefix}/find-atms`, data) 
    }
}