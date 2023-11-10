import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const cardSettingStyles = StyleSheet.create({
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
    },
    cardsTitleWrap: {
        paddingLeft: 25,
        paddingRight: 25,
        flexDirection: 'row',
        paddingTop: 32,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardsTitleWrapText: {
        color: colors.deepBlue,
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
    },
    cardsTitleWrapBtn: {
        fontFamily: 'Poppins',
        color: colors.blue,
    },
    cardsListing: {
        marginTop: 18,
    },
    cardActionsStyle: {
        marginTop: 25,
    },
    infoText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    transactionItemWrapper: {
        padding: 25,
    },
    transactionItemWrap: {
        gap: 15,
        borderRadius: 15,
        backgroundColor: colors.white,
        padding: 15,
    },
})