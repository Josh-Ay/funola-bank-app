import React, { useContext, useState } from "react";

const AppContext = React.createContext({});

export const useAppContext = () => useContext(AppContext);

export default AppContextProvider = ({ children }) => {
    const [ countries, setCountries ] = useState([]);
    const [ countriesLoaded, setCountriesLoaded ] = useState(false);

    return <AppContext.Provider value={{
        countries,
        setCountries,
        countriesLoaded, 
        setCountriesLoaded,
    }}>
        { children }
    </AppContext.Provider>
}