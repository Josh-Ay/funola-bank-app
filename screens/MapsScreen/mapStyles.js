import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";
import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('screen');

export const mapStyles = StyleSheet.create({
    mapWrapper: {
        gap: 20,
        paddingTop: 25,
        paddingBottom: 25,
        backgroundColor: colors.white,
        position: 'relative',
    },
    titleContentWrapper: {
        flexDirection: 'row',
        paddingLeft: 25,
        paddingRight: 25,
        justifyContent: 'space-between',
    },
    titleContent: {
        gap: 5,
    },
    titleText: {
        color: colors.deepBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 26,
    },
    subtitleText: {
        fontFamily: 'Poppins',
        fontSize: 14,
        color: colors.grey,
    },
    lottieWrapper: {
        width: width,
        height: height * 0.7,
    },
    lottie: { 
        flex: 1,
    },
    userImageWrapper: {
        alignSelf: 'center',
        padding: 5,
        backgroundColor: colors.paleBlue,
        borderRadius: 50 / 2,
        position: 'absolute',
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },
    nearbyWrapper: {
        position: 'absolute',
        top: '86%',
        paddingLeft: 25,
        paddingRight: 25,
    },
    nearbyAtmText: {
        color: colors.deepBlue,
        fontFamily: 'Poppins-Medium',
        fontSize: 19,
    },
    nearbyAtmsWrap: {
        marginTop: 10,
        marginBottom: 20,
        gap: 20,
        marginLeft: 4,
        marginRight: 15,
        paddingRight: 20,
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
    modalContentWrapper: {
        // height: '100%',
        paddingTop: 20,
        gap: 30,
    },
    modalTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 20,
    },
    distanceTextWrap: {
        alignSelf: 'center',
        width: '80%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    distanceBtn: {
        padding: 10,
        backgroundColor: colors.paleBlue,
        borderRadius: 44 / 2,
    },
    distanceText: {
        fontFamily: 'Poppins-Medium',
        color: colors.blue,
        fontSize: 28,
    },
    quickDistances: {
        maxHeight: 60,
        alignItems: 'center',
    },
    quickDistanceBtn: {
        backgroundColor: colors.paleBlue,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        paddingLeft: 25,
        paddingRight: 25,
        height: 44,
        borderRadius: 10,
    },
    quickDistanceText: {
        fontFamily: 'Poppins',
        color: colors.deepBlue,
    },
    actionsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    cancelBtn: {
        backgroundColor: colors.paleBlue,
        flex: 0.5,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtnText: {
        fontFamily: 'Poppins-Medium',
        color: colors.grey,
    },
    acceptBtn: {
        backgroundColor: colors.blue,
        flex: 0.5,
        paddingTop: 16,
        paddingBottom: 16,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptBtnText: {
        fontFamily: 'Poppins-Medium',
        color: colors.white,
    },
})