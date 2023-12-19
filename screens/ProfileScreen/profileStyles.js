import { StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

export const profileStyles = StyleSheet.create({
    topContentWrapper: {
        backgroundColor: colors.deepBlue,
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 40,
        paddingBottom: 35,
        gap: 12,
    },
    contentWrapper: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colors.paleBlue,
        top: -20,
        paddingLeft: 25,
        paddingTop: 30,
        paddingRight: 25,
        gap: 18,
    },
    profileImageWrapper: {
        alignSelf: 'center',
        padding: 5,
        backgroundColor: colors.white,
        borderRadius: 140 / 2,
    },
    image: {
        width: 130,
        height: 130,
        borderRadius: 130 / 2,
    },
    username: {
        fontFamily: 'Poppins-Medium',
        color: colors.lightGrey,
        textAlign: 'center',
        fontSize: 16,
    },
    profileSettingHeading: {
        fontFamily: 'Poppins-Medium',
        color: colors.deepBlue,
        fontSize: 18,
    },
    logoutItem: {
        width: 100,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginTop: 15,
        marginBottom: 15,
    },
    logoutItemText: {
        fontFamily: 'Poppins',
        color: colors.deepBlue,
        fontSize: 15,
    },
    profileOptionListing: {
        gap: 10,
    },
})