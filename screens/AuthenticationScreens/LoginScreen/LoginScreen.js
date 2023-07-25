import { Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout"
import { useState } from "react";
import { loginStyles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { AuthServices } from "../../../services/authServices";
import { useToast } from "react-native-toast-notifications";
import { validateEmail } from "../../../utils/helpers";

const LoginScreen = ({ navigation }) => {
    const [ userDetails, setUserDetails ] = useState({
        email: '',
        password: '',
    });
    const [ passwordObscured, setPasswordObscured ] = useState(true);
    const [ dataLoading, setDataLoading ] = useState(false);
    const toast = useToast();

    const handleUpdateUserDetail = (name, val) => {
        setUserDetails((prev) => {
            return {
                ...prev,
                [name]: val,
            }
        })
    }

    const showToastInfoMessage = (message) => {
        toast.show(message, {
            type: 'normal',
            placement: 'top'
        })
    }

    const handleLogin = async () => {
        if (userDetails.email.length < 1) return showToastInfoMessage('Please enter an email');
        if (userDetails.password.length < 1) return showToastInfoMessage('Please enter a password');
        if (!validateEmail(userDetails.email)) return showToastInfoMessage('Please enter a valid email');

        if (dataLoading) return

        setDataLoading(true);

        const authService = new AuthServices();

        try {
            
            const res = (await authService.loginUser(userDetails)).data;
            setDataLoading(false);
            
            toast.show(res, {
                type: 'success',
                placement: 'top',
            });

            // navigation.dispatch(
            //     StackActions.replace('AccountConfirmation')
            // )

        } catch (error) {
            // console.warn(error);
            const errorMsg = error.response ? error.response.data : error.message;

            setDataLoading(false);
            toast.show(errorMsg, {
                type: 'danger',
                placement: 'top'
            })
        }
    }

    return <>
        <AuthLayout
            title={'Login'} 
            subtitle={'Enter your details'}
            navigation={navigation}
            buttonText={'Login'}
            handleBackBtnClick={() => navigation.popToRoot()}
            showLoadingEffect={dataLoading}
            handleAuthButtonClick={handleLogin}
        >
            <View style={loginStyles.container}>
                <View>
                    <Text style={loginStyles.headerText}>Enter your email</Text>
                    <TextInputComponent
                        placeholder="abc@gmail.com"
                        name={'email'}
                        value={userDetails.email}
                        handleInputChange={handleUpdateUserDetail}
                        isEditable={!dataLoading}
                        isEmailInput={true}
                    />
                </View>
                <View>
                    <Text style={loginStyles.headerText}>Enter your password</Text>
                    <View style={loginStyles.inputContainer}>
                        <TextInputComponent
                            placeholder="password"
                            name={'password'}
                            value={userDetails.password}
                            handleInputChange={handleUpdateUserDetail}
                            isSecure={passwordObscured}
                            isEditable={!dataLoading}
                        />
                        <TouchableOpacity style={loginStyles.eyeBtn} onPress={() => setPasswordObscured(!passwordObscured)}>
                            {
                                passwordObscured ? 
                                <Ionicons name="eye-outline" size={24} color="black" />
                                :
                                <Ionicons name="eye-off-outline" size={24} color="black" />
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </AuthLayout>
    </>
}

export default LoginScreen;
