import { Text, View } from "react-native";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { loginStyles } from "../LoginScreen/styles";
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { AuthServices } from "../../../services/authServices";
import { validateEmail } from "../../../utils/helpers";

const PasswordResetScreen = ({ navigation }) => {
    const [ email, setEmail ] = useState('');
    const [ dataLoading, setDataLoading ] = useState(false);
    const toast = useToast();
    const authService = new AuthServices();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleRequestPasswordReset = async () => {
        if (email.length < 1) return showToastMessage('Please enter an email');
        if (!validateEmail(email)) return showToastMessage('Please enter a valid email');
        if (dataLoading) return

        setDataLoading(true);

        try {
            const res = (await authService.requestPasswordReset({ email: email })).data;
            showToastMessage(res, 'success');
            setDataLoading(false);
            navigation.pop();
        } catch (error) {
            setDataLoading(false);

            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to request password reset. Please try again' : errorMsg, 'danger')
        }
    }

    return <>
        <AuthLayout
            title={'Reset Password'}
            subtitle={'We will send you an email with a link to reset your password'}
            navigation={navigation}
            buttonText={'Reset'}
            handleAuthButtonClick={handleRequestPasswordReset}
            showLoadingEffect={dataLoading}
        >
            <View style={loginStyles.container}>
                <View>
                    <Text style={loginStyles.headerText}>Enter your email</Text>
                    <TextInputComponent
                        placeholder="abc@gmail.com"
                        name={'email'}
                        value={email}
                        handleInputChange={(name, val) => setEmail(val)}
                        isEditable={!dataLoading}
                        isEmailInput={true}
                    />
                </View>
            </View>
        </AuthLayout>
    </>
}

export default PasswordResetScreen;