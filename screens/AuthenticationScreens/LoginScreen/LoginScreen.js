import { Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useState } from "react";
import { loginStyles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { AuthServices } from "../../../services/authServices";
import { useToast } from "react-native-toast-notifications";
import { validateEmail } from "../../../utils/helpers";

const LoginScreen = ({ navigation, route, setLoggedIn }) => {
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

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleLogin = async () => {
        if (userDetails.email.length < 1) return showToastMessage('Please enter an email');
        if (userDetails.password.length < 1) return showToastMessage('Please enter a password');
        if (!validateEmail(userDetails.email)) return showToastMessage('Please enter a valid email');

        if (dataLoading) return

        setDataLoading(true);

        const authService = new AuthServices();

        try {
            
            const { data, status } = (await authService.loginUser(userDetails));
            setDataLoading(false);
            
            showToastMessage(data, 'success');
            
            if (status === 200) {
                if (setLoggedIn && typeof setLoggedIn === 'function') setLoggedIn(true);            
            }

        } catch (error) {
            // console.warn(error);
            const errorMsg = error.response ? error.response.data : error.message;

            setDataLoading(false);
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to log you in. Please try again' : errorMsg, 'danger')
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
                <TouchableOpacity
                    onPress={() => navigation.navigate('PasswordReset')}
                >
                    <Text style={loginStyles.resetPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    </>
}

export default LoginScreen;
