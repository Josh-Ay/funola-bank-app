import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from "../../utils/helpers";
import { depositStyles } from "./depositStyles";

export default function DepositItem ({
    deposit, 
    modalIsOpen,
    handleDepositClick,
}) {
    if (!deposit) return <></>
    
    return <>
        <TouchableOpacity 
            style={depositStyles.singleUserItem}
            onPress={
                handleDepositClick && typeof handleDepositClick === 'function' ?
                    () => handleDepositClick(deposit)
                :
                () => {}   
            }
        >
            <View style={depositStyles.cardLeftContent}>
                <View
                    style={
                        modalIsOpen ? 
                            Object.assign({}, depositStyles.cardImageWrapper, depositStyles.overlayCardImageWrapper)
                        :
                        depositStyles.cardImageWrapper
                    }
                >
                    <MaterialCommunityIcons name="bank-outline" size={24} color="black" />
                </View>
                <View>
                    <Text style={depositStyles.userItemContentText}>{'For ' + deposit?.duration + ' months'}</Text>
                    <Text style={depositStyles.userItemSubContentText}>{formatDate(deposit?.paybackDate)}</Text>
                </View>
            </View>
            <View style={depositStyles.cardRightContent}>
                <Text style={depositStyles.cardBalance}>
                    {
                        `${
                            deposit?.currency === 'NGN' ? 
                                '₦' 
                            : 
                            deposit?.currency === 'USD' ? 
                                '$' 
                            : 
                                ''
                            } ${Number(deposit?.paybackAmount)?.toFixed(2)}`
                    }
                </Text>
                <Text style={depositStyles.cardDateText}>
                    {'Rate ' + deposit.rate + '%'}
                </Text>
            </View>
        </TouchableOpacity>
    </>
}