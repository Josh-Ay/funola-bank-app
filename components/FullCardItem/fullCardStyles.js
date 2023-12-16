import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { colors } from "../../utils/colors";

export const fullCardStyles = StyleSheet.create({
    cardItemWrapper: {
        padding: 28,
        borderRadius: 24,
        maxWidth: '100%',
        gap: 25,
    },
    cardAccountDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBalanceText: {
        fontFamily: 'Poppins',
        color: colors.white,
        fontSize: 22,
    },
    cardPaymentNetworkText: {
        fontFamily: 'Poppins',
        color: colors.white,
        textTransform: 'uppercase',
        fontSize: 15,
    },
    cardNumberText: {
        fontFamily: 'Poppins',
        color: colors.white,
        letterSpacing: 1,
    },
    cardHolderDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 40,
    },
    infoText: {
        fontFamily: 'Poppins',
        color: colors.grey,
        textTransform: 'uppercase',
        fontSize: 12,
    },
    detailText: {
        fontFamily: 'Poppins',
        textTransform: 'capitalize',
        color: colors.white,
        fontSize: 15,
    },
})