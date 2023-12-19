import React, { useContext, useState } from "react";

const BanksContext = React.createContext({});

export const useBanksContext = () => useContext(BanksContext);

export default BanksContextProvider = ({ children }) => {
    const [ banks, setBanks ] = useState([]);
    const [ banksLoading, setBanksLoading ] = useState(true);
    const [ banksLoaded, setBanksLoaded ] = useState(false);

    return <>
        <BanksContext.Provider
            value={{
                banks,
                setBanks,
                banksLoading,
                setBanksLoading,
                banksLoaded,
                setBanksLoaded,
            }}
        >
            { children }
        </BanksContext.Provider>
    </>
}