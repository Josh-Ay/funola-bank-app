import { View } from "react-native";
import { appLayoutStyles } from "../../styles";

export default function ModalOverlay ({ children }) {
    return <View style={appLayoutStyles.modalOverlay}>
        { children }
    </View>
}