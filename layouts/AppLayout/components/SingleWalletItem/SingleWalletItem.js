import { Image, Text, TouchableOpacity, View } from 'react-native';
import { appLayoutStyles } from '../../styles';
import { getCurrencySymbol } from '../../../../utils/helpers';

export default function SingleWalletItem ({
    wallet,
    currentActiveWallet,
    walletIndex,
    handleWalletItemClick,
}) {
    if (!wallet) return <></>

    return <>
        <TouchableOpacity
            onPress={
                handleWalletItemClick && typeof handleWalletItemClick === 'function' ?
                    () => handleWalletItemClick(walletIndex)
                :
                () => {}
            } 
            style={
                currentActiveWallet?._id === wallet?._id ?
                    Object.assign({}, appLayoutStyles.walletItem, appLayoutStyles.activeWalletItem)
                :
                appLayoutStyles.walletItem
            }
        >
            <View style={appLayoutStyles.walletItemLeftContent}>
                {
                    wallet?.currency === 'NGN' ?   
                        <Image
                            source={require('../../../../assets/currenciesFlag/NGN.jpg')}
                            style={appLayoutStyles.walletImage}
                        />   
                    :
                    wallet?.currency === 'USD' ?      
                        <Image 
                            source={require('../../../../assets/currenciesFlag/USD.jpg')}
                            style={appLayoutStyles.walletImage}
                        />
                    : 
                    <></>
                }
                <Text style={appLayoutStyles.walletTitleText}>{wallet?.currency} wallet</Text>
            </View>
            <View>
                <Text style={appLayoutStyles.balanceText}>
                    {
                        `${getCurrencySymbol(wallet?.currency)} ${Number(Number(wallet?.balance)?.toFixed(2))?.toLocaleString()}`
                    }
                </Text>
            </View>
        </TouchableOpacity>
    </>
}