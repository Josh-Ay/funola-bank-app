import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

const { height } = Dimensions.get('window');

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
    contentText: {
        fontFamily: 'Poppins',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    recentsWrapper: {
        padding: 25,
        gap: 12,
    },
    contactTabFilter: {
        marginTop: 10,
        marginBottom: 20,
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
    contactImageWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10
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
    recentUserImageWrapper: {
        borderRadius: 50 / 2,
        width: 50,
        height: 50,
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
    qrWrapper: {
        padding: 25,
        gap: 12,
    },
    scanWrapper: {
        position: 'relative',
        marginTop: 25,
    },
    leftTopSquareScan: {
        position: 'absolute',
        left: 20,
        top: 0,
        height: 30,
        width: 30,
        borderTopWidth: 3,
        borderLeftWidth: 3,
    },
    leftBottomSquareScan: {
        position: 'absolute',
        left: 20,
        bottom: 0,
        height: 30,
        width: 30,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
    },
    rightTopSquareScan: {
        position: 'absolute',
        right: 20,
        top: 0,
        height: 30,
        width: 30,
        borderTopWidth: 3,
        borderRightWidth: 3,
    },
    rightBottomSquareScan: {
        position: 'absolute',
        right: 20,
        bottom: 0,
        height: 30,
        width: 30,
        borderRightWidth: 3,
        borderBottomWidth: 3,
    },
    qrContainer: {
        backgroundColor: colors.grey,
        width: '70%',
        height: height * 0.32,
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 25,
    },
})