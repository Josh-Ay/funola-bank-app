import { TouchableWithoutFeedback } from "react-native";
import { appLayoutStyles } from "../../styles";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ModalOverlay ({ children, handleClickOutside }) {
    const handlePressInTouchableFeedback = (e) => {

        if (handleClickOutside && typeof handleClickOutside === 'function') {
        
        }
        
    }

    return <TouchableWithoutFeedback 
        onPress={handlePressInTouchableFeedback}
    >
        <GestureHandlerRootView style={appLayoutStyles.modalOverlay}>
            { children }
        </GestureHandlerRootView>
    </TouchableWithoutFeedback>
}