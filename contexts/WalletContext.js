import React, { useContext, useState } from "react";

const WalletContext = React.createContext({});

export const useWalletContext = () => useContext(WalletContext);

const initialNewWalletState = {
    currency: '',
}

const initialNewWalletFundState = {
    currency: '',
    amount: '',
}

const initialWalletFundSwapState = {
    currency: '',
    amount: '',
    outputCurrency: '',
}

export default WalletContextProvider = ({ children }) => {
    const [ wallets, setWallets ] = useState([]);
    const [ walletsLoaded, setWalletsLoaded ] = useState(false);
    const [ walletsLoading, setWalletsLoading ] = useState(true);
    const [ showAddWalletModal, setShowAddWalletModal ] = useState(false);
    const [ newWalletDetails, setNewWalletDetails ] = useState(initialNewWalletState);
    const [ showAllWalletsModal, setShowAllWalletsModal ] = useState(false);
    const [ newWalletFundDetails, setNewWalletFundDetails ] = useState(initialNewWalletFundState);
    const [ walletSwapFundDetails, setWalletSwapFundDetails ] = useState(initialWalletFundSwapState);

    const handleUpdateNewWalletDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewWalletDetails((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
    }

    const handleUpdateWalletActionStateDetail = (action, stateKeyToUpdate, valueToUpdateTo) => {
        if (action === 'fund') {
            setNewWalletFundDetails((prevDetails) => {
                return {
                    ...prevDetails,
                    [stateKeyToUpdate]: valueToUpdateTo
                }
            })
        }

        if (action === 'swap') {
            setWalletSwapFundDetails((prevDetails) => {
                return {
                    ...prevDetails,
                    [stateKeyToUpdate]: valueToUpdateTo
                }
            })
        }
    }

    const resetNewWalletDetailState = () => {
        setNewWalletDetails(initialNewWalletState)
    }

    const resetWalletActionStateDetail = (action) => {
        if (action === 'fund') setNewWalletFundDetails(initialNewWalletFundState)
        if (action === 'swap') setWalletSwapFundDetails(initialWalletFundSwapState)
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
                newWalletFundDetails,
                walletSwapFundDetails,
                handleUpdateWalletActionStateDetail,
                resetWalletActionStateDetail,
            }}
        >
            { children }
        </WalletContext.Provider>
    </>
}