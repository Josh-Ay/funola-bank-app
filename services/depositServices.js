import { axiosInstance } from "./config"

export class DepositServices {
    /**
     * Class defined to interact with all APIs pertaining to deposits.
     * 
     * @constructor A url prefix to route to deposit APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'deposit'
    }

    createNewDeposit = async (data) => {
        /**
         * Creates a new deposit
         * 
         * @param data Request body containing details  neccessary to make a deposit such as amount, rate, duration and so on
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/new`, data)
    }
    
    getDepositsDetail = async () => {
        /**
         * Get all deposits for a user
         * 
         * @returns A promise 
         */

        return await axiosInstance.get(`${this.urlPrefix}/`)
    }
}