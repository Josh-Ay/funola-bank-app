import { convertCurrencyAxiosInstance } from "./config"

export class ConvertServices {
    getCurrencyRate = async (amount, inputCurrency, outputCurrency) => {
        return await convertCurrencyAxiosInstance.get(`/?amount=${amount}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`)
    }
}