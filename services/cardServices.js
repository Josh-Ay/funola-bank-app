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

    fundCard = async (data, cardCurrency) => {
        return await axiosInstance.post(`${this.urlPefix}/fund/${cardCurrency}`, data)
    }

    getCardTransactions = async (cardCurrency) => {
        return await axiosInstance.get(`${this.urlPefix}/transactions/${cardCurrency}`)
    }
}