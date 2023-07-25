import { axiosInstance } from "./config"

export class UserServices {
    constructor () {
        this.urlPefix = 'user'
    }

    getUserProfile = async () => {
        return await axiosInstance.get(`${this.urlPefix}/profile`)
    }
    
}