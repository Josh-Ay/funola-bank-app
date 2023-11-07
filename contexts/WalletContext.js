import React, { useContext, useState } from "react";

const WalletContext = React.createContext({});

export const useWalletContext = () => useContext(WalletContext);

const initialNewWalletState = {
    currency: '',
}

export default WalletContextProvider = ({ children }) => {
    const [ wallets, setWallets ] = useState([]);
    const [ walletsLoaded, setWalletsLoaded ] = useState(false);
    const [ walletsLoading, setWalletsLoading ] = useState(true);
    const [ showAddWalletModal, setShowAddWalletModal ] = useState(false);
    const [ newWalletDetails, setNewWalletDetails ] = useState(initialNewWalletState);
    const [ showAllWalletsModal, setShowAllWalletsModal ] = useState(false);

    const handleUpdateNewWalletDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewWalletDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
    }

    const resetNewWalletDetailState = () => {
        setNewWalletDetails(initialNewWalletState)
    }

    return <>
        <WalletContext.Provider
            value={{ 
                wallets,
                setWallets,
                walletsLoaded,
                setWalletsLoaded,
                walletsLoading,
                setWalletsLoading,
                showAddWalletModal,
                setShowAddWalletModal,
                newWalletDetails,
                handleUpdateNewWalletDetails,
                resetNewWalletDetailState,
                showAllWalletsModal,
                setShowAllWalletsModal,
            }}
        >
            { children }
        </WalletContext.Provider>
    </>
}