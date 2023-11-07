import { axiosInstance } from "./config"

export class DepositServices {
    constructor () {
        this.urlPefix = 'deposit'
    }

    createNewDeposit = async (data) => {
        return await axiosInstance.post(`${this.urlPefix}/new`, data)
    }
    
    getDepositsDetail = async () => {
        return await axiosInstance.get(`${this.urlPefix}/`)
    }
}