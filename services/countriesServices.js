import { countriesAxiosInstance } from "./config"

export class CountryServices {
    /**
     * Class defined to interact with all APIs pertaining to fetching countries.
     * 
     */

    fetchCountries = async () => {
        /**
         * Fetches all countries in the world.
         * 
         * @returns A promise
         * 
         */
        
        return await countriesAxiosInstance.get('/')
    }
}
