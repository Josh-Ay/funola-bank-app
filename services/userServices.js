import { axiosInstance } from "./config"

export class UserServices {
    /**
     * Class defined to interact with all APIs pertaining to user actions.
     * 
     * @constructor A url prefix to route to user APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'user'
    }

    getUserProfile = async () => {
        /**
         * Get the profile details for a user
         * 
         * @returns A promise
         * 
         */
        return await axiosInstance.get(`${this.urlPrefix}/profile`)
    }
    
    updateUserProfile = async (data, updateType) => {
        /**
         * Update the profile information of a user
         * 
         * @param data Request body containing the updated data you will like to use to replace the old data
         * @param updateType The type of update you want to make to the user profile
         * 
         * @returns A promise
         * 
         */
        return await axiosInstance.patch(`${this.urlPrefix}/update-profile/${updateType}`, data)
    }

    getNotifications = async () => {
        /**
         * Get notifications for a user
         * 
         * @returns A promise
         * 
         */

        return await axiosInstance.get(`${this.urlPrefix}/notifications`)
    }

    getOtherUsers = async () => {
        /**
         * Get other users on the application
         * 
         * @returns A promise
         */
        return await axiosInstance.get(`${this.urlPrefix}/users`)
    }

    checkLoginPinStatus = async () => {
        /**
         * Checks if the current user has configured a login pin
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/login-pin-status`)
    }

    checkTransactionPinStatus = async () => {
        /**
        * Checks if the current user has configured a transaction pin
        * 
        * @returns A promise
        */

        return await axiosInstance.get(`${this.urlPrefix}/transaction-pin-status`)
    }
}