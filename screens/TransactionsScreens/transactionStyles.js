import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";
import { Dimensions } from "react-native";

const { height } = Dimensions.get('window');

export const transactionStyles = StyleSheet.create({
    wrapper: {
        paddingLeft: 20,
        paddingRight: 20,
        gap: 30,
    },
    allTransactionsHeader: {
        gap: 15,
    },
    allTransactionsHeaderTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 26,
    },
    allTransactionsHeaderSubtitle: {
        fontFamily: 'Poppins',
        color: colors.grey,
    },
    transactionHeaderWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 40,
        height: 40,
    },
    logoText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        letterSpacing: 1,
    },
    receiptText: {
        fontFamily: 'Poppins',
        fontSize: 12,
    },
    singleTransactionItemWrap: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 10,
        paddingTop: 35,
        paddingBottom: 35,
        paddingLeft: 15,
        paddingRight: 15,
        gap: 25,
        // maxHeight: height * 0.62,
        // overflow: 'visible'
    },
    amountDetailWrap: {
        gap: 5,
    },
    amount: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        textAlign: 'center',
    },
    greenText: {
        color: colors.green,
    },
    redText: {
        color: colors.red,
    },
    statusText: {
        textTransform: 'uppercase',
        fontFamily: 'Poppins',
        textAlign: 'center',
        fontSize: 16,
    },
    dateOfTransaction: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        fontSize: 12,
        color: colors.grey
    },
    divider: {
        height: 0.5,
        width: '100%',
        backgroundColor: colors.grey,
    },
    transactionDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    transactionDetailItemText: {
        fontFamily: 'Poppins',
        fontSize: 11,
        textTransform: 'capitalize'
    },
    supportWrap: {
        gap: 5
    },
    supportTitle: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        fontSize: 14,
    },
    supportEmail: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        fontSize: 12,
        color: colors.blue,
    },
})