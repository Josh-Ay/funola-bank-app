export const userItemActions = {
    walletFund: 'fund-wallet',
    walletSend: 'send-wallet',
    walletRequest: 'request-wallet',
    walletHistory: 'history-wallet',
    walletSwap: 'swap-wallet',
    cardSend: 'send-card',
    cardRequest: 'request-card',
    cardHistory: 'history-card',
    cardSwap: 'swap-card',
}

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

export const userGenderChoices = [
    {
        gender: 'M'
    },
    {
        gender: 'F'
    },
]


export const validFunolaCurrencies = [
    {
        'currency': 'USD'
    },
    {
        'currency': 'NGN'
    },
]

export const validFunolaCardPaymentNetworks = [
    {
        network: 'Visa', 
    },
    {
        network: 'Mastercard'
    },
]


export const validFunolaRates = [...Array(25).fill(0).map((val, idx) => ({ rate: `${idx + 1}` }))];
export const validFunolaDurations = [...Array(12).fill(0).map((val, idx) => ({ duration: `${idx + 1}` }))];
export const validFunolaPaymentMethods = [
    {
        method: 'card',
    },
    {
        method: 'wallet',
    },
]
