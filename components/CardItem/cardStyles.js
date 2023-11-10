import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const cardStyles = StyleSheet.create({
    singleUserItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginBottom: 8,
        alignItems: 'center',
    },
    cardSettingItem: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 14,
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
    cardImage: {
        width: 24,
        height: 24,
    },
    overlayCardImageWrapper: {
        opacity: 0.3,
    },
    userItemContentText: {
        color: colors.deepBlue,
        fontSize: 16,
        fontFamily: 'Poppins',
        marginBottom: 4,
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
    cardSettingContentText: {
        color: colors.deepBlue,
        fontSize: 14,
        fontFamily: 'Poppins',
    },
})