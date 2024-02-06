import { axiosInstance } from "./config"

export class AuthServices {
    /**
     * Class defined to interact with all APIs pertaining to authentication and authorization.
     * 
     * @constructor A url prefix to route to auth APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'auth'
    }

    sendVerificationCode = async (data) => {
        /**
         * Send a verification code for a new user
         * 
         * @param data Request body containing details of the new user
         * 
         * @returns A promise
         */
        
        return await axiosInstance.post(`${this.urlPrefix}/code`, data)
    }

    verifyCode = async (data) => {
        /**
         * Checks code sent to verify new user account
         * 
         * @param data Request body containing the code to be verified
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/verify-code`, data)
    }

    registerNewUser = async (data) => {
        /**
         * Register a new user
         * 
         * @param data Request body containing the new user details
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/register`, data)
    }

    loginUser = async (data) => {
        /**
         * Login an existing user
         * 
         * @param data Request body containing user details such as email and password
         * 
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/login`, data)
    }

    getLoginStatus = async () => {
        /**
         * Get authorization status of a user
         * 
         * @returns A promise 
         */

        return await axiosInstance.get(`${this.urlPrefix}/login-status`)
    }

    logoutUser = async () => {
        /**
         * Logout an existing user
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/logout`)
    }

    requestPasswordReset = async (data) => {
        /**
         * Send a request to reset password of a user's account
         * 
         * @returns A promise
         */
        return await axiosInstance.post(`${this.urlPrefix}/request-password-reset`, data)
    }
}