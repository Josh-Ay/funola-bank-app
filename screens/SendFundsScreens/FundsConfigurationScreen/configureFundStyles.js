import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const configureFundStyles = StyleSheet.create({
    topContentWrapper: {
        backgroundColor: colors.deepBlue,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
        paddingBottom: 40,
    },
    topContent: {
        gap: 5,
        marginTop: 15,
    },
    titleText: {
        fontFamily: 'Poppins-Medium',
        color: colors.white,
        fontSize: 26,
    },
    subtitleText: {
        fontFamily: 'Poppins',
        color: colors.lightGrey,
    },
    contentWrapper: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colors.paleBlue,
        top: -20,
        minHeight: '30%',
    },
    itemContentTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
    },
    selectAmount: {
        padding: 25,
    },
    amountTextWrap: {
        alignSelf: 'center',
        width: '80%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    amountBtn: {
        padding: 10,
        backgroundColor: colors.paleGrey,
        borderRadius: 44 / 2,
    },
    amountText: {
        backgroundColor: colors.paleBlue,
        elevation: 0,
        shadowOffset: {},
        shadowColor: colors.paleBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 32,
        color: colors.blue,
    },
    amountTextDetailWrap: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectDebitAccount: {
        backgroundColor: colors.white,
        padding: 25,
    },
    actionsWrap: {
        position: 'absolute',
        bottom: 0,
        padding: 25,
        backgroundColor: colors.white,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    cancelActionBtn: {
        backgroundColor: colors.paleGrey,
        flex: 0.5,
        borderRadius: 12,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        color: colors.grey,
        fontFamily: 'Poppins-Medium',
    },
    sendActionBtn: {
        backgroundColor:colors.blue,
        borderRadius: 12,
        flex: 0.5,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        fontFamily: 'Poppins-Medium',
        color: colors.white,
    },
    quickAmounts: {
        maxHeight: 60,
        alignItems: 'center',
        marginTop: 20,
    },
    quickAmountBtn: {
        backgroundColor: colors.paleGrey,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        paddingLeft: 25,
        paddingRight: 25,
        height: 44,
        borderRadius: 10,
    },
    quickAmountText: {
        fontFamily: 'Poppins',
        color: colors.deepBlue,
    },
})