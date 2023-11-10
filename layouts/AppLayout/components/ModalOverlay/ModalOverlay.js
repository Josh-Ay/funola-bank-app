import { TouchableWithoutFeedback, View } from "react-native";
import { appLayoutStyles } from "../../styles";

export default function ModalOverlay ({ children, handleClickOutside }) {
    return <TouchableWithoutFeedback 
        onPress={
            handleClickOutside && typeof handleClickOutside === 'function' ?
                () => handleClickOutside()
            :
            () => {}
        }>
        <View  style={appLayoutStyles.modalOverlay} >
        { children }

        </View>
    </TouchableWithoutFeedback>
}