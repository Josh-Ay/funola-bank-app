import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const { width } = Dimensions.get('screen');

export const bottomNavStyles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'space-between',
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
        paddingBottom: 20,
        backgroundColor: colors.paleBlue,
    },
    footerItem: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    footerContentText: {
        fontFamily: 'Poppins',
        fontSize: 12,
    },
    activeItem: {
        color: colors.blue,
    },
    nonActiveItem: {
        color: colors.grey,
    },
    overlayContent: {
        backgroundColor: colors.grey,
    },
})