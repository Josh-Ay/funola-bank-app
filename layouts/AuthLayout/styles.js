import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const authStyles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.paleBlue,
        gap: 10,
        marginTop: 10,
    },
    titleText: {
        fontFamily: 'Poppins',
        fontSize: 30,
        marginTop: 15,
        marginBottom: 10,
    },
    subtitleText: {
        fontFamily: 'Poppins',
        width: '80%',
    },
    topContent: {
        flex: 0.2,
    },
    mainContent: {
        flex: 0.55,
        paddingTop: 20,
    },
    bottomContent: {
        flex: 0.25,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
    },
    btn: {
        backgroundColor: colors.blue,
        width: '100%',
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 5,
    },
    btn_: {
        backgroundColor: colors.blue,
        width: '100%',
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginBottom: 5,
    },
    btnText: {
        color: colors.white,
        fontFamily: 'Poppins',
        fontSize: 14,
    },
    legalContentText: {
        textAlign: 'center',
        color: colors.blue,
        textDecorationLine: 'underline',
    },
    loader: {
        width: 250,
        height: 250,
    },
    loadingText: {
        fontFamily: 'Poppins',
        marginTop: 10,
        letterSpacing: 1,
    },
    fullText: {
        width: "100%"
    }
})
