import { axiosInstance } from "./config"

export class CardServices {
    constructor () {
        this.urlPefix = 'card'
    }

    createNewCard = async (data, cardType) => {
        return await axiosInstance.post(`${this.urlPefix}/create/${cardType}`, data)
    }
    
    getCardsDetail = async () => {
        return await axiosInstance.get(`${this.urlPefix}/detail`)
    }

    getSingleCardDetail = async (id) => {
        return await axiosInstance.get(`${this.urlPefix}/single-card-detail/${id}`)
    }

    fundCard = async (data, id) => {
        return await axiosInstance.post(`${this.urlPefix}/fund/${id}`, data)
    }

    getCardTransactions = async (id) => {
        return await axiosInstance.get(`${this.urlPefix}/transactions/${id}`)
    }

    updateCardSetting = async (id, type, data) => {
        return await axiosInstance.patch(`${this.urlPefix}/update-setting/${id}/${type}`, data)
    }
}