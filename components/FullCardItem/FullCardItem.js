import { View } from "react-native"
import { colors } from "../../utils/colors";
import { Text } from "react-native";
import { fullCardStyles } from "./fullCardStyles";
import { formatDateToMonthAndYear } from '../../utils/helpers'

const FullCardItem = ({ card, defaultBg }) => {
    if (!card) return <></>

    return <>
        <View 
            style={
                Object.assign(
                    {}, 
                    { backgroundColor: defaultBg ? colors.deepBlue : colors.black },
                    fullCardStyles.cardItemWrapper
                )
            }
        >
            <View style={fullCardStyles.cardAccountDetails}>
                <Text style={fullCardStyles.cardBalanceText}>
                    {
                        `${
                            card?.currency === 'NGN' ? 
                                '₦' 
                            : 
                            card?.currency === 'USD' ? 
                                '$' 
                            : 
                                ''
                        } ${Number(card?.balance)?.toFixed(2)}`
                    }
                </Text>
                <Text style={fullCardStyles.cardPaymentNetworkText}>
                    {card?.paymentNetwork}
                </Text>
            </View>
            <Text style={fullCardStyles.cardNumberText}>{'**** **** **** ' + String(card._id).slice(String(card._id).length - 4, String(card._id).length)}</Text>
            <View style={fullCardStyles.cardHolderDetails}>
                <View>
                    <Text style={fullCardStyles.infoText}>Card Holder</Text>
                    <Text style={fullCardStyles.detailText}>{card?.cardName}</Text>
                </View>
                <View>
                    <Text style={fullCardStyles.infoText}>Expires</Text>
                    <Text style={fullCardStyles.detailText}>{formatDateToMonthAndYear(card?.expiryDate)}</Text>
                </View>
                <View>
                    <Text style={fullCardStyles.infoText}>CVV</Text>
                    <Text style={fullCardStyles.detailText}>{card?.cvv}</Text>
                </View>
            </View>
        </View>
    </>
}

export default FullCardItem;