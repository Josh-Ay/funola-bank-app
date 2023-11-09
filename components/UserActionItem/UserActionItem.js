import { Text, TouchableOpacity, View } from "react-native";
import { userActionItemStyles } from "./styles";

export default function UserActionItem ({ item, handleItemPress, style }) {
    return <>
        <TouchableOpacity 
            style={
                style && typeof style === 'object' ?
                    Object.assign({}, userActionItemStyles.singleActionItem, style)
                :
                userActionItemStyles.singleActionItem
            } 
            onPress={
                handleItemPress && typeof handleItemPress === 'function' ? 
                    () => handleItemPress(item.action)
                    :
                    () => {}
            }
        >
            <View style={userActionItemStyles.actionItemIcon}>{item.icon}</View>
            <Text style={userActionItemStyles.actionItemText}>{item.title}</Text>
        </TouchableOpacity>
    </>
}