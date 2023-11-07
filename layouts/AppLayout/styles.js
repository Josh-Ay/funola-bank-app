import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const { width } = Dimensions.get('screen');


export const appLayoutStyles = StyleSheet.create({
    mainContent: {    
        backgroundColor: colors.paleBlue,
    },
    modalWrapper: {
        backgroundColor: colors.white,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    modalContainer: {
        paddingBottom: 40,
        paddingLeft: 25,
        paddingRight: 25,
        backgroundColor: colors.white
    },
    modalTitleText: {
        fontFamily: 'Poppins',
        fontWeight: 600,
        fontSize: 20,
        marginTop: 15,
        marginBottom: 15,
    },
    modalInputHeaderText: {
        fontFamily: 'Poppins',
    },
    modalInputItemWrapper: {
        gap: 10,
        width: '100%',
        marginTop: 20,
    },
    modalSelectItem: {
        width: '98%',
        height: 45,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 7,
        elevation: 2,
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: 10,
        paddingRight: 10,
    },
    modalSelectDropIcon: { 
        marginLeft: 'auto' 
    },
    modalBtnStyle: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: colors.blue,
        marginTop: 40,
        marginBottom: 40,
        borderRadius: 10,
    },
    modalBtnTextStyle: {
        fontFamily: 'Poppins',
        color: colors.white,
    },
    overlayContent: {
        backgroundColor: colors.grey,
    },
    disabledModalBtn: {
        backgroundColor: colors.grey,
    },
    modalAddWalletBtnStyle: {
        borderWidth: 1,
        borderColor: colors.blue,
        backgroundColor: colors.paleBlue,
    },
    modalBlueBtnTextStyle: {
        color: colors.blue,
    },
    walletItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: colors.white,
    },
    activeWalletItem: {
        backgroundColor: colors.paleBlue,
    },
    walletImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    walletItemLeftContent: {
        gap: 10,
    },
    walletTitleText: {
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    balanceText: {
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.bgOverlay,
    }
})