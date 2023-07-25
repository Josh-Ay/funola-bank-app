import { Dimensions, StyleSheet } from "react-native";
import { colors } from "../../utils/colors";

const { width, height } = Dimensions.get('window');

export const dropdownStyles = StyleSheet.create({
    customDropdown: {
        minWidth: 20,
        minHeight: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
        backgroundColor: colors.white,
        position: 'relative',
        zIndex: 1,
    },
    wrapper: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingLeft: 10,
        paddingRight: 5,
        gap: 5,
        alignItems: 'center'
    },
    dropdownItemsWrapper: {
        gap: 20,
        flexDirection: 'column',
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: colors.paleBlue,
        paddingTop: 30,
        paddingBottom: 20,
    },
    dropdownListWrapper: {
        marginBottom: 20,
        minHeight: 400,
        height: height * 0.8,
    },  
    modal: {
        backgroundColor: colors.paleBlue,
    },
    modalCloseIcon: {
        alignSelf: "flex-end",
    },
    dropdownListItem: {
        fontFamily: 'Poppins',
        marginBottom: 20,
    },
    countrySearchWrapper: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 10,
        zIndex: 2,
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100%',
    },
    searchInput: {
        paddingLeft: 40,
        width: "100%",
        height: '100%',
    },
    imageItem: {
        width: 20,
        height: 10,
        marginLeft: 15,
    },
})
