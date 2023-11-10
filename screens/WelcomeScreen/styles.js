import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const { width, height } = Dimensions.get('screen');

export const welcomeStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: colors.paleBlue,
    },
    topContent: {
        flex: 0.7,
        justifyContent: 'flex-end',
    },
    bottomContent: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: 20,
        gap: 10,
    },
    welcomeImage: {
        resizeMode: 'contain',
        width: '100%',
        flex: 0.7,
        marginBottom: 20,
    },
    getStartedText: {
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 30,
        marginBottom: 10,
    },
    extraInfoText: {
        fontFamily: 'Poppins',
        textAlign: 'center',
        width: width * 0.65,
        flex: 0.2,
        alignSelf: 'center',
        fontSize: 14,
    },
    createBtn: {
        backgroundColor: colors.blue,
        width: width * 0.85,
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    loginBtn: {
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createBtnText: {
        color: colors.white,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
    loginBtnText: {
        color: colors.blue,
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
    },
})
