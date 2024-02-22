import { Text, TouchableOpacity, View } from "react-native";
import { userActionItemStyles } from "./styles";
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator";

export default function UserActionItem ({ item, handleItemPress, style, itemLoading }) {
    return <>
        <TouchableOpacity 
            style={
                style && typeof style === 'object' ?
                    Object.assign({}, userActionItemStyles.singleActionItem, style)
                :
                userActionItemStyles.singleActionItem
            } 
            onPress={
                itemLoading ? () => {} :
                handleItemPress && typeof handleItemPress === 'function' ? 
                    () => handleItemPress(item.action)
                    :
                    () => {}
            }
        >
            
            <View style={userActionItemStyles.actionItemIcon}>
                {
                    itemLoading ? <LoadingIndicator
                        removeTextContent={true}
                    /> :
                    item.icon
                }
            </View>
            <Text style={userActionItemStyles.actionItemText}>{item.title}</Text>
        </TouchableOpacity>
    </>
}