import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const profileUpdateStyles = StyleSheet.create({
    topContent: {
        gap: 5,
        marginBottom: 15,
    },
    titleText: {
        fontFamily: 'Poppins-Medium',
        color: colors.white,
        fontSize: 24,
    },
    subtitleText: {
        fontFamily: 'Poppins',
        color: colors.lightGrey,
        fontSize: 12,
    },
    poppinsText: {
        fontFamily: 'Poppins',
    },
    inputWrapper: {
        gap: 10,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        gap: 10,
    },
    phoneInput: {
        flex: 1,
        elevation: 0,
        shadowOffset: {},
        shadowColor: colors.paleBlue,
        paddingTop: 8,
        paddingBottom: 8
    },
    verticalLine: {
        height: '50%',
        width: 1,
        backgroundColor: colors.lightGrey,
        alignSelf: 'center'
    },
    confirmModalWrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bgOverlay,
    },
    confirmModal: {
        backgroundColor: colors.white,
        width: '80%',
        alignSelf: 'center',
        padding: 22,
        paddingBottom: 35,
        borderRadius: 10,
        shadowColor: colors.black,
        shadowOffset: {
            width: 1,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        gap: 22,
    },
    modalTitle: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        fontSize: 22,
    },
    modalText: {
        textAlign: 'center',
        fontSize: 13,
    },
    confirmModalActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 18,
        marginTop: 8,
    },
    cancelBtn: {
        backgroundColor: colors.paleGrey,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 50,
    },
    proceedBtn: {
        backgroundColor: colors.blue,
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 50,
    },
    proceedBtnText: {
        color: colors.white,
    },
    noBankText: {
        textAlign: 'center',
    },
    redBtn: {
        backgroundColor: colors.red,
        marginTop: 0,
    },
    actionBtn: {
        marginBottom: 0,
        marginTop: 25,
    },
    addBankBtn: {
        backgroundColor: colors.blue,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        height: 48,
        width: 90,
        alignSelf: 'center',
    },
})