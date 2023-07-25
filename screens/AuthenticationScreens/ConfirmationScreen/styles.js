import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../../utils/colors";

const { width } = Dimensions.get('window');


export const confirmationStyles = StyleSheet.create({
    wrapper: {
        flex: 1
    },  
    container: {
        flex: 1,
        backgroundColor: colors.paleBlue,
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    mainContent: {
        flex: 0.85,
        justifyContent: 'center',
        alignContent: 'center',
        // gap: 10,
    },
    imageContent: {
        resizeMode: 'contain',
        width: width * 0.7,
        flex: 0.5,
    },
    bottomContent: {
        flex: 0.15,
        flexDirection: 'column',
        width: '100%',
    },
    startBtn: {
        backgroundColor: colors.blue,
        width: '100%',
        height: 60,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    textContent: {
        fontFamily: 'Poppins',
    },
    startBtnText: {
        color: colors.white,
    },
    textContentWrapper: {
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    successText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
    },
    successTextSubtitle: {
        textAlign: 'center',
    }
})