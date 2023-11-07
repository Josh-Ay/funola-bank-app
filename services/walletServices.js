import { axiosInstance } from "./config"

export class WalletServices {
    constructor () {
        this.urlPefix = 'wallet'
    }

    createNewWallet = async (data) => {
        return await axiosInstance.post(`${this.urlPefix}/create`, data)
    }
    
    getWalletsBalance = async () => {
        return await axiosInstance.get(`${this.urlPefix}/balance`)
    }

    fundWallet = async (data) => {
        return await axiosInstance.put(`${this.urlPefix}/fund`, data)
    }

    transferFromWallet = async (data, walletType) => {
        return await axiosInstance.post(`${this.urlPefix}/transfer/${walletType}`)
    }

    withdrawFromWallet = async (data) => {
        return await axiosInstance.post(`${this.urlPefix}/withdrawal`, data)
    }

    swapFundsBetweenWallet = async (data) => {
        return await axiosInstance.post(`${this.urlPefix}/swap`, data)
    }

    requestFundingToWallet = async (data) => {
        return await axiosInstance.post(`${this.urlPefix}/request`, data)
    }
}