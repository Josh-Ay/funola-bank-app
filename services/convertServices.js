import { convertCurrencyAxiosInstance } from "./config"

export class ConvertServices {
    /**
     * Class defined to interact with all APIs pertaining to currency conversion.
     * 
     */

    getCurrencyRate = async (amount, inputCurrency, outputCurrency) => {
        /**
         * Get the currency's current equivalent value in another currency.
         * 
         * @param amount The amount you will like to convert
         * @param inputCurrency The currency you will like to convert from
         * @param outputCurrency The currency you will like to convert to
         * 
         * @returns A promise
         */

        return await convertCurrencyAxiosInstance.get(`/?amount=${amount}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`)
    }
}