import { TextInput } from "react-native"
import { textInputStyles } from "./styles";
import { useEffect, useState } from "react";
import { validateEmail } from '../../utils/helpers';
import { colors } from "../../utils/colors";

const TextInputComponent = ({ 
    placeholder, 
    name, 
    value, 
    handleInputChange, 
    isEditable, 
    isSecure, 
    isEmailInput, 
    isNumericInput, 
    style, 
    disableFocusStyle, 
    textInputRef,
    length,
    returnKeyType,
    handleSubmitBtnPress,
}) => {

    const [ inputFocused, setInputFocused ] = useState(false);
    const [ isEmailValid, setIsEmailValid ] = useState(true);

    useEffect(() => {

        if (value?.length < 1) return setIsEmailValid(true);
        if (!validateEmail(value)) return setIsEmailValid(false);

        setIsEmailValid(true);

    }, [value])
    
    return <>
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={
                handleInputChange && typeof handleInputChange === 'function' ?
                (val) => handleInputChange(name, val)
                :
                () => {}
            }
            style={
                isSecure ? 
                    Object.assign(
                        {}, 
                        textInputStyles.inputElement, 
                        textInputStyles.passwordInputElement, 
                        inputFocused ? 
                            textInputStyles.focused : 
                        {},
                        style,
                    ) 
                : 
                    Object.assign(
                        {}, 
                        textInputStyles.inputElement, 
                        inputFocused ? 
                            isEmailInput ? 
                                isEmailValid ?
                                    textInputStyles.focused :
                                    textInputStyles.invalid
                            :
                            textInputStyles.focused : 
                            {}
                        ,
                        isEmailInput ? 
                            isEmailValid ?
                                {} :
                                textInputStyles.invalid
                        :
                            {}
                        ,
                        style,
                    )
            }
            editable={isEditable}
            onFocus={disableFocusStyle ? () => {} : () => setInputFocused(true)}
            onBlur={disableFocusStyle ? () => {} : () => setInputFocused(false)}
            secureTextEntry={isSecure}
            keyboardType={
                isEmailInput ? 
                    "email-address" 
                :
                isNumericInput ? 
                    "numeric" 
                :
                "default"
            }
            ref={
                textInputRef ? 
                    textInputRef 
                    : 
                null
            }
            maxLength={length}
            returnKeyType={
                returnKeyType ? returnKeyType : 
                'default'
            }
            onSubmitEditing={
                handleSubmitBtnPress && typeof handleSubmitBtnPress === 'function' ? 
                    () => handleSubmitBtnPress() : 
                    () => {}
            }
            placeholderTextColor={colors.lightGrey}
        />
    </>
}

export default TextInputComponent;