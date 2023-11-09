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

    fundCard = async (data, cardCurrency) => {
        return await axiosInstance.post(`${this.urlPefix}/fund/${cardCurrency}`, data)
    }

    getCardTransactions = async (cardCurrency) => {
        return await axiosInstance.get(`${this.urlPefix}/transactions/${cardCurrency}`)
    }

    updateCardSetting = async (id, type, data) => {
        return await axiosInstance.patch(`${this.urlPefix}/update-setting/${id}/${type}`, data)
    }
}