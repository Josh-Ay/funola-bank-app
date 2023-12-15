import { axiosInstance } from "./config"

export class AtmServices {
    /**
     * Class defined to interact with all APIs pertaining to ATMs.
     * 
     * @constructor A url prefix to route to ATM APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'atm'
    }

    getNearbyAtms = async () => {
        /**
         * Get nearby atms
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/nearby-atms`)    
    }

    findAtmWithinDistance = async (data) => {
        /**
         * Find atms within a specified distance
         * 
         * @param data Request body containing the limiting distance to check within
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/find-atms`, data) 
    }
}