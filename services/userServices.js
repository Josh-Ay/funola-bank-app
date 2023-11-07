import { axiosInstance } from "./config"

export class UserServices {
    constructor () {
        this.urlPefix = 'user'
    }

    getUserProfile = async () => {
        return await axiosInstance.get(`${this.urlPefix}/profile`)
    }
    
    updateUserProfile = async (data, updateType) => {
        return await axiosInstance.put(`${this.urlPefix}/update-profile/${updateType}`)
    }

    getNotifications = async () => {
        return await axiosInstance.get(`${this.urlPefix}/notifications`)
    }

    getOtherUsers = async () => {
        return await axiosInstance.get(`${this.urlPefix}/users`)
    }
}