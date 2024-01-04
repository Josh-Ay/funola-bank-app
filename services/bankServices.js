import { axiosInstance } from "./config"

export class BankServices {
    /**
     * Class defined to interact with all APIs pertaining to banks.
     * 
     * @constructor A url prefix to route to ATM APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'bank'
    }

    getBanksFOrUser = async () => {
        /**
         * Get banks added by current user
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/`)
    }

    addNewBank = async (data) => {
        /**
         * Add new bank account for user
         * 
         * @param data Request body containing the necessary details to add new bank account
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/new`, data) 
    }

    updateBankDetail = async (bankId, data) => {
        /**
         * Update existing bank details for user
         * 
         * @param bankId The id of the bank account for which you will like to update
         * @param data Request body containing the updated details
         * 
         * @returns A promise
         */

        return await axiosInstance.patch(`${this.urlPrefix}/update/${bankId}`, data) 
    }

    deletebankDetail = async (bankId) => {
        /**
         * Deletes an existing bank detail for a user
         * 
         * @returns A promise
         */

        return await axiosInstance.delete(`${this.urlPrefix}/delete/${bankId}`) 
    }
}