import AsyncStorage from '@react-native-async-storage/async-storage';

// key used to save user next timeout in async storage
export const USER_DETAIL_KEY = 'funola-user-next-timeout';

// Dictionary of user actions in the application
export const userItemActions = {
    walletFund: 'fund-wallet',
    walletSend: 'send-wallet',
    walletRequest: 'request-wallet',
    walletHistory: 'history-wallet',
    walletSwap: 'swap-wallet',
    cardFund: 'fund-card',
    cardSend: 'send-card',
    cardRequest: 'request-card',
    cardHistory: 'history-card',
    cardSwap: 'swap-card',
}

// List of allowed titles for users in the application
export const userTitles = [
    {
        title: 'Mr',
    },
    {
        title: 'Mrs',
    },
    {
        title: 'Miss',
    },
]

// List of allowed gender options in the application
export const userGenderChoices = [
    {
        gender: 'M'
    },
    {
        gender: 'F'
    },
]


// List of allowed currencies in the application
export const validFunolaCurrencies = [
    {
        'currency': 'USD'
    },
    {
        'currency': 'NGN'
    },
]

// List of allowed card payment networks in the application
export const validFunolaCardPaymentNetworks = [
    {
        network: 'Visa', 
    },
    {
        network: 'Mastercard'
    },
]


// List of rates for a deposit ranging from 1 to 25
export const validFunolaRates = [...Array(25).fill(0).map((val, idx) => ({ rate: `${idx + 1}` }))];

// List of durations for a deposit ranging from 1 to 12 (months)
export const validFunolaDurations = [...Array(12).fill(0).map((val, idx) => ({ duration: `${idx + 1}` }))];

// List of allowed payment methods in the application
export const validFunolaPaymentMethods = [
    {
        method: 'card',
    },
    {
        method: 'wallet',
    },
]

// List of valid bank account bank types in the application
export const validFunolaBankAccountTypes = [
    {
        type: 'Personal',
    },
    {
        type: 'Savings',
    }
]

// function to get saved user timout detail
export const getSavedUserTimeoutDetail = async () => {
    try {
      const value = await AsyncStorage.getItem(USER_DETAIL_KEY);
      if (value !== null) {
        // value previously stored
        try {
            return JSON.parse(value)
        } catch (error) {
            return null
        }
      }
      return null
    } catch (e) {
      // error reading value
      return null
    }
};

export const clearSavedUserTimeoutDetail = async () => {
    try {
      await AsyncStorage.removeItem(USER_DETAIL_KEY);
    } catch (e) {
      // error removing
      console.log('error removing detail: ', e);
    }
}
