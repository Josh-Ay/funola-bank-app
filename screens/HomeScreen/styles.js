import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const homePageStyles = StyleSheet.create({
    topContentWrapper: {
        backgroundColor: colors.deepBlue,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 35,
        paddingBottom: 40,
    },
    topContent: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: 'flex-start',
    },
    balanceText: {
        color: colors.white,
        fontFamily: 'Poppins-Medium',
        fontSize: 34,
    },
    balanceTextIndicator: {
        color: colors.lightGrey,
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    pendingBalanceTextIndicator: {
        color: colors.lightGrey,
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        marginTop: 8,
    },
    notificationIcon: {
        transform: [{rotate: '20deg'}]
    },
    userImage: {

    },
    leftTopContent: {
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center'
    },
    leftTopContentWrapper: {
        backgroundColor: colors.red,
        flexDirection: 'row'
    },
    rightTopContent: {
        flexDirection: 'row',
        gap: 15,
    },
    image: {
        width: 30,
        height: 30,
        borderRadius: 6,
    },
    walletActionsStyle: {
        marginTop: 25,
        marginBottom: 18,
    },
    walletActionsWrapper: {
        width: '100%',
    },
    mainContent: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colors.paleBlue,
        top: -20,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 25,
    },
    headerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        fontFamily: 'Poppins',
        fontSize: 20,
    },
    addNewText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: colors.blue,
    },
    spacingItem: {
        height: 20,
    },
    userItemsWrapper: {
        backgroundColor: colors.white,
        borderRadius: 10,
        padding: 10,
    },
    contentItemLoading: {
        fontSize: 14,
        fontFamily: 'Poppins',
        textAlign: 'center',
    },
    noWalletText: {
        fontSize: 14,
        fontFamily: 'Poppins',
        color: colors.paleBlue,
        marginBottom: 25,
    },
    whiteText: {
        color: colors.paleBlue,
    },
    createNewWallet: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addNewWalletText: {
        fontSize: 14,
        fontFamily: 'Poppins',
    },
    noContentWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 35,
    },
    noContentImage: {
        width: 45,
        height: 45,
        marginTop: 20,
    },
    overlayContent: {
        backgroundColor: colors.grey,
    },
    noWalletContentImage: {
        width: 130,
        height: 130,
    },
    switchWalletsBtn: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: colors.paleBlue,
        width: 120,
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 20,
        marginBottom: 15,
    },
    walletImage: {
        width: 15,
        height: 15,
    },
    seeAllBtn: {
        marginTop: 20,
    },
    seeAllBtnText: {
        color: colors.blue,
        fontFamily: 'Poppins',
        textAlign: 'center',
    },
    modalContentWrapper: {
        marginTop: 10,
    },
    swapResultText: {
        color: colors.blue,
    },
})