import { axiosInstance } from "./config"

export class AuthServices {
    constructor () {
        this.urlPrefix = 'auth'
    }

    sendVerificationCode = async (data) => {
        return await axiosInstance.post(`${this.urlPrefix}/code`, data)
    }

    verifyCode = async (data) => {
        return await axiosInstance.post(`${this.urlPrefix}/verify-code`, data)
    }

    registerNewUser = async (data) => {
        return await axiosInstance.post(`${this.urlPrefix}/register`, data)
    }

    loginUser = async (data) => {
        return await axiosInstance.post(`${this.urlPrefix}/login`, data)
    }

    getLoginStatus = async () => {
        return await axiosInstance.get(`${this.urlPrefix}/login-status`)
    }
}