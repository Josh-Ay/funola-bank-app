import { StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

export const sendFundStyles = StyleSheet.create({
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
    recentsWrapper: {
        padding: 25,
        gap: 12,
    },
    contactHeadingTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        marginBottom: 12,
    },
    contactWrapper: {
        backgroundColor: colors.white,
        padding: 25,
        // marginBottom: 250,
    },
    searchWrapper: {
        borderRadius: 8,
        backgroundColor: colors.paleBlue,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        height: 45,
        paddingLeft: 12,
        paddingRight: 12,
        justifyContent: 'flex-start',
        marginBottom: 12,
    },
    inputItem: {
        fontFamily: 'Poppins',
        fontSize: 12,
        flex: 1,
        height: '100%'
    },
    requestAccessWrap: {
        marginTop: 20,
        gap: 10,
    },
    requestText: {
        fontFamily: 'Poppins',
        fontSize: 13,
    },
    contactListing: {
        // paddingBottom: 250,
    },
    contactImage: {
        width: 35,
        height: 35,
        objectFit: 'cover',
        borderRadius: 8,
    },
    singleContact: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 10,
        paddingLeft: 4,
        paddingRight: 4,
    },
    singleContactTopContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    contactName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    contactNumber: {
        fontFamily: 'Poppins',
        color: colors.grey,
        fontSize: 12,
    },
    contactActionBtn: {
        backgroundColor: colors.blue,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 8,
    },
    contactActionBtnText: {
        fontFamily: 'Poppins',
        color: colors.white,
        fontSize: 11,
    },
    depositFilterWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    depositFilterItem: {
        gap: 7,
        flex: 0.5,
    },
    depositFilterItemText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        color: colors.grey,
    },
    activeFilter: {
        color: colors.blue,
    },
    depositFilterIndicator: {
        height: 3,
        backgroundColor: colors.lightGrey,
    },
    blueDepositFilterIndicator: {
        backgroundColor: colors.blue,
    },
    recentListingWrap: {
        gap: 20,
    },
    recentUserItem: {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 23,
        paddingBottom: 23,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recentUsername: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        marginTop: 18,
    },
    recentUserNumber: {
        fontFamily: 'Poppins',
        color: colors.grey,
        fontSize: 12,
        marginTop: 5,
    },
    payeeWrapper: {
        padding: 25,
        gap: 12,
    },
    payeeHeaderWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    addPayeeBtnText: {
        fontFamily: 'Poppins',
        color: colors.blue,
    },
    noBankText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        marginTop: 22,
    },
    bankItemWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginTop: 20,
        marginBottom: 5,
    },
    bankIcon: {
        backgroundColor: colors.white,
        padding: 14,
        borderRadius: 8,
    },
    bankName: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
    },
    bankDetailWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 3,
    },
    bankDetail: {
        fontFamily: 'Poppins',
        color: colors.grey,
        fontSize: 12,
    },
    bankRightIcon: {
        marginLeft: 'auto'
    },
})