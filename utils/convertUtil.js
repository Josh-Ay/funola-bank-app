const { default: axios } = require("axios")

const convertLiveBaseURL = 'https://ayoolaa.pythonanywhere.com';
const convertLocalBaseURL = 'http://127.0.0.1:6404';

const convertAxiosInstance = axios.create({
    baseURL: convertLiveBaseURL,
    // baseURL: convertLocalBaseURL,
})

exports.get_currency_rate = async (amount, inputCurrency, outputCurrency) => {
    return await convertAxiosInstance.get(`/?amount=${amount}&inputCurrency=${inputCurrency}&outputCurrency=${outputCurrency}`)
}
