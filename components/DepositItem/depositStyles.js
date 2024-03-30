import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const depositStyles = StyleSheet.create({
    singleUserItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginBottom: 8,
    },
    cardLeftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    cardRightContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    cardImageWrapper: {
        backgroundColor: colors.paleBlue,
        padding: 7,
        borderRadius: 7,
    },
    overlayCardImageWrapper: {
        opacity: 0.3,
    },
    userItemContentText: {
        color: colors.deepBlue,
        fontSize: 16,
        fontFamily: 'Poppins',
        marginBottom: 4,
        textTransform: 'capitalize',
    },
    userItemSubContentText: {
        fontSize: 10,
        fontFamily: 'Poppins',
    },
    cardBalance: {
        color: colors.deepBlue,
        fontSize: 16,
        fontFamily: 'Poppins-Medium',
    },
    cardDateText: {
        color: colors.grey,
        fontSize: 10,
        fontFamily: 'Poppins',
    },
    creditBal: {
        color: colors.green,
    },
    debitBal: {
        color: colors.red,
    },
})