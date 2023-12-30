import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const requestFundStyles = StyleSheet.create({
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
    cardActionsStyle: {
        marginTop: 25,
    },
    nonActiveTab: {
        opacity: 0.6,
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
    qrWrapper: {
        padding: 25,
        gap: 20,
    }, 
    qrCodeImage: {
        alignSelf: 'center',
        backgroundColor: colors.white,
        borderRadius: 15,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation: 2,
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    headingText: {
        fontFamily: 'Poppins-Medium',
    },
    amountText: {
        elevation: 0,
        shadowOffset: {},
        shadowColor: colors.paleBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: colors.blue,
        marginTop: 12,
    },
    contentText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 2,
    }
})