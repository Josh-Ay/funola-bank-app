import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const fundsConfirmationStyles = StyleSheet.create({
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
        fontSize: 19,
        paddingLeft: 25,
        paddingTop: 25,
    },
    contentText: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    confirmFundDetailWrap: {
        gap: 20,
        padding: 25,
    },
    confirmFundDetailItem: {
        gap: 5,
    },
    contentTitleText: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
    },
    actionsWrap: {
        position: 'absolute',
        bottom: 0,
        padding: 25,
        backgroundColor: colors.white,
        width: '100%',
        gap: 10,
    },
    sendActionBtn: {
        backgroundColor:colors.blue,
        borderRadius: 12,
        flex: 1,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendText: {
        fontFamily: 'Poppins-Medium',
        color: colors.white,
    },
    confirmRecipientDetailItem: {
        gap: 2,
    },
    recipient: {
        backgroundColor: colors.paleBlue,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 20,
        borderRadius: 10,
    },
    imageContent: {
        resizeMode: 'contain',
        width: '80%',
        alignSelf: 'center',
        height: 200,
    },
    successAmountText: {
        fontFamily: 'Poppins-Medium',
        color: colors.blue,
        textAlign: 'center',
        fontSize: 38,
    },
    successInfoText: {
        fontFamily: 'Poppins',
        color: colors.grey,
        fontSize: 12,
        textAlign: 'center',
    },
})