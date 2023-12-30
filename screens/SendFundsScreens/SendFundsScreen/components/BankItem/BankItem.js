import { Text, TouchableOpacity, View } from "react-native"
import { FontAwesome } from '@expo/vector-icons';
import { sendFundStyles } from "../../sendFundStyles";
import { Entypo } from '@expo/vector-icons';
import { colors } from "../../../../../utils/colors";

export default BankItem = ({ 
    item,
    handlePress,
    isNotPressable,
    style,
}) => {
    if (!item) return <></>
    
    if (isNotPressable) return <>
        <View
            style={
                style && typeof style === 'object' ?
                    Object.assign(
                        {},
                        sendFundStyles.bankItemWrap,
                        style,
                    )
                :
                sendFundStyles.bankItemWrap
            }
        >
            <View style={sendFundStyles.bankIcon}>
                <FontAwesome name="bank" size={24} color="black" />
            </View>
            <View>
                <Text style={sendFundStyles.bankName}>{item?.name}</Text>
                <View style={sendFundStyles.bankDetailWrap}>
                    <Text style={sendFundStyles.bankDetail}>{item?.type} account</Text>
                    <Text style={sendFundStyles.bankDetail}>
                        <Entypo name="dots-two-horizontal" size={15} color={colors.grey} /> {item?.accountNumber?.slice(-4)}
                    </Text>
                </View>
            </View>
        </View>
    </>

    return <>
        <TouchableOpacity 
            style={
                style && typeof style === 'object' ?
                    Object.assign(
                        {},
                        sendFundStyles.bankItemWrap,
                        style,
                    )
                :
                sendFundStyles.bankItemWrap
            }
            onPress={
                handlePress && typeof handlePress === 'function' ?
                    () => handlePress(item)
                :
                () => {}
            }
        >
            <View style={sendFundStyles.bankIcon}>
                <FontAwesome name="bank" size={24} color="black" />
            </View>
            <View>
                <Text style={sendFundStyles.bankName}>{item?.name}</Text>
                <View style={sendFundStyles.bankDetailWrap}>
                    <Text style={sendFundStyles.bankDetail}>{item?.type} account</Text>
                    <Text style={sendFundStyles.bankDetail}>
                        <Entypo name="dots-two-horizontal" size={15} color={colors.grey} /> {item?.accountNumber?.slice(-4)}
                    </Text>
                </View>
            </View>
            <FontAwesome name="angle-right" size={18} color="black"  style={sendFundStyles.bankRightIcon} />
        </TouchableOpacity>
    </>
}