import { axiosInstance } from "./config"

export class WalletServices {
    /**
     * Class defined to interact with all APIs pertaining to wallets.
     * 
     * @constructor A url prefix to route to wallet APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'wallet'
    }

    createNewWallet = async (data) => {
        /**
         * Creates a new wallet for a user
         * 
         * @param data Request body containing details necessary to create a new card for a user
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/create`, data)
    }
    
    getWalletsBalance = async () => {
        /**
         * Get the balances of all wallets for a user
         * 
         * @returns A promise 
         */

        return await axiosInstance.get(`${this.urlPrefix}/balance`)
    }

    fundWallet = async (data) => {
        /**
         * Funds an existing wallet of a user
         * 
         * @param data Request body containing the amount to be added to the wallet 
         * 
         * @returns A promise
         * 
         */

        return await axiosInstance.put(`${this.urlPrefix}/fund`, data)
    }

    transferFromWallet = async (data, walletType) => {
        /**
         * Transfer funds from an existing wallet
         * 
         * @param data Request body containing the amount to be transferred from the wallet
         * @param walletType The type of wallet being transferred from (e.g NGN, USD)
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/transfer/${walletType}`)
    }

    withdrawFromWallet = async (data) => {
        /**
         * Withdraw funds from an existing wallet
         * 
         * @param data Request body containing the amount to be withdrawn and so on
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/withdrawal`, data)
    }

    swapFundsBetweenWallet = async (data) => {
        /**
         * Swap funds between wallets
         * 
         * @param data Request body containing details to make a swap possible
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/swap`, data)
    }

    requestFundingToWallet = async (data) => {
        /**
         * Request for funding to a wallet
         * 
         * @param data Request body containing details to make a request possible such as request amount and so on
         * 
         * @returns A promise
         */
        
        return await axiosInstance.post(`${this.urlPrefix}/request`, data)
    }
}