import { countriesAxiosInstance } from "./config"

export class CountryServices {
    fetchCountries = async () => {
        return await countriesAxiosInstance.get('/')
    }
}
