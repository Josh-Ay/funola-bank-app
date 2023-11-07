import { Text } from "react-native";
import { TouchableOpacity } from "react-native";

export default function CustomButton ({ buttonText, handleBtnPress, btnStyle, textContentStyle, disabled }) {
    
    return <>
        <TouchableOpacity 
            onPress={
                disabled ? 
                    () => {}
                :
                handleBtnPress && typeof handleBtnPress === 'function' ? 
                    () => handleBtnPress() 
                : 
                () => {}
            }
            style={btnStyle}
            activeOpacity={ 
                disabled ? 
                    1
                :
                0.2
            }
        >
            <Text style={textContentStyle}>{buttonText}</Text>
        </TouchableOpacity>
    </>
}