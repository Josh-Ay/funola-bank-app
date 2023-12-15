import { axiosInstance } from "./config"

export class CardServices {
    /**
     * Class defined to interact with all APIs pertaining to cards.
     * 
     * @constructor A url prefix to route to card APIs is instantiated each time an object of this class is created.
     * 
     */

    constructor () {
        this.urlPrefix = 'card'
    }

    createNewCard = async (data, cardType) => {
        /**
         * Create a new card for a user
         * 
         * @param data Request body containing neccessary information to be used in creating the card
         * @param cardType The type of card to be created e.g virtual, physical
         * 
         * @returns A promise
         */
        
        return await axiosInstance.post(`${this.urlPrefix}/create/${cardType}`, data)
    }
    
    getCardsDetail = async () => {
        /**
         * Get all cards for a user
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/detail`)
    }

    getSingleCardDetail = async (id) => {
        /**
         * Get details of a user's card
         * 
         * @param id The id of the card you will like to get details for
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/single-card-detail/${id}`)
    }

    fundCard = async (data, id) => {
        /**
         * Fund an existing card for a user
         * 
         * @param data Request body containing amount to be funded and other neccessary details
         * @id The id of the card to be funded
         * 
         * @returns A promise
         */

        return await axiosInstance.post(`${this.urlPrefix}/fund/${id}`, data)
    }

    getCardTransactions = async (id) => {
        /**
         * Get all transactions for a card
         * 
         * @param id The id of the card for which transactions are to be fetched
         * 
         * @returns A promise
         */

        return await axiosInstance.get(`${this.urlPrefix}/transactions/${id}`)
    }

    updateCardSetting = async (id, type, data) => {
        /**
         * Update withdrawal, payment and other settings for a card
         * 
         * @param id The id of the card you will like to change setting for
         * @param type The type of setting update you will like to make
         * @param data Request body containing other data to successfully complete this request
         * 
         * @returns A promise
         */

        return await axiosInstance.patch(`${this.urlPrefix}/update-setting/${id}/${type}`, data)
    }
}