import { Text, TouchableOpacity, View } from "react-native"
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useEffect, useRef, useState } from "react";
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { verificationStyles } from "./styles";
import { AuthServices } from "../../../services/authServices";
import { useToast } from "react-native-toast-notifications";

const VerificationScreen = ({ navigation, route }) => {

    const initialVerificationCode = {
        firstNum: '',
        secondNum: '',
        thirdNum: '',
        fourthNum: ''
    }
    const [ dataLoading, setDataLoading ] = useState(false);
    const [ resetLoading, setResetLoading ] = useState(false);
    const [ resetTimeLeftInSecs, setResetTimeLeftInSecs ] = useState(50);
    const [ verificationCode, setVerificationCode ] = useState(initialVerificationCode);
    const secondInputRef = useRef();
    const thirdInputRef = useRef();
    const fourthInputRef = useRef();
    const [ inputsDisabled, setInputsDisabled ] = useState(false);
    const [ numberVerified, setNumberVerified ] = useState(false);
    const toast = useToast();


    useEffect(() => {

        const interval = setInterval(() => {
            if (resetTimeLeftInSecs < 1) return

            setResetTimeLeftInSecs(resetTimeLeftInSecs - 1);
        }, 1000)

        return () => {
            clearInterval(interval)
        }

    }, [resetTimeLeftInSecs])

    useEffect(() => {
        if (
            verificationCode.firstNum.length > 0 &&
            verificationCode.secondNum.length > 0 &&
            verificationCode.thirdNum.length > 0 &&
            verificationCode.fourthNum.length > 0
        ) {
            secondInputRef.current.blur();
            thirdInputRef.current.blur();
            fourthInputRef.current.blur();
            setInputsDisabled(true);
            handleContinueBtnClick();
            return
        }

        setInputsDisabled(false);

    }, [verificationCode])

    const handleChange = (passedName, passedVal) => {
        setVerificationCode((prevDetails) => {
            return {
                ...prevDetails,
                [passedName]: passedVal
            }
        })

        // switch focus to next input
        if (passedName === 'firstNum' && passedVal.length > 0) secondInputRef.current.focus();
        if (passedName === 'secondNum' && passedVal.length > 0) thirdInputRef.current.focus();
        if (passedName === 'thirdNum' && passedVal.length > 0) fourthInputRef.current.focus();
    }

    const handleContinueBtnClick = async () => {
        if (
            verificationCode.firstNum.length < 1 ||
            verificationCode.secondNum.length < 1 ||
            verificationCode.thirdNum.length < 1 ||
            verificationCode.fourthNum.length < 1 ||
            dataLoading
        ) return

        if (numberVerified) return navigation.navigate('Onboarding', { ...route.params });

        setDataLoading(true);
        
        try {
            const authService = new AuthServices();

            const res = (await authService.verifyCode({ 
                code: `${verificationCode.firstNum}${verificationCode.secondNum}${verificationCode.thirdNum}${verificationCode.fourthNum}`, 
                number: `${route.params?.countryCode}${route.params?.number}`
            })).data;
            
            setDataLoading(false);
            setNumberVerified(true);

            toast.show(res, {
                type: 'success',
                placement: 'top',
            });
            navigation.navigate('Onboarding', { ...route.params });

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            // console.log(errorMsg);

            setDataLoading(false);
            toast.show(errorMsg, {
                type: 'danger',
                placement: 'top'
            })
            setVerificationCode(initialVerificationCode);
        }
    }

    const handleResetCode = async () => {
        if (
            numberVerified ||
            dataLoading
        ) return

        setResetLoading(true);
        
        try {
            const authService = new AuthServices();
            const res = (await authService.sendVerificationCode({ number: `${route.params?.countryCode}${route.params?.number}` , email: route.params?.email })).data;
            // console.log(res);
            
            setResetLoading(false);
            setResetTimeLeftInSecs(50);

            toast.show(res, {
                type: 'success',
                placement: 'top',
            });

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            // console.log(errorMsg);

            setResetLoading(false);
            toast.show(errorMsg, {
                type: 'danger',
                placement: 'top'
            })
        }
    }

    return <>
        <AuthLayout
            title={'Verification'}
            subtitle={`Enter the 4-digit code we sent to ${route.params?.countryCode}${route.params?.number} and ${route.params?.email}`}
            showLoadingEffect={dataLoading}
            buttonText={'Continue'}
            isVerificationScreen={true}
            navigation={navigation}
            handleAuthButtonClick={handleContinueBtnClick}
        >
            <View style={verificationStyles.container}>
                <View style={verificationStyles.inputWrapper}>
                    <TextInputComponent 
                        style={verificationStyles.inputWrapperTextItem} 
                        isNumericInput={true}
                        value={verificationCode.firstNum}
                        name={'firstNum'}
                        handleInputChange={(name, val) => handleChange(name, val)}
                        isEditable={!dataLoading || !numberVerified || !resetLoading}
                        length={1}
                    />
                    <TextInputComponent 
                        style={verificationStyles.inputWrapperTextItem} 
                        isNumericInput={true}
                        value={verificationCode.secondNum}
                        name={'secondNum'}
                        handleInputChange={(name, val) => handleChange(name, val)}
                        textInputRef={secondInputRef}
                        isEditable={!dataLoading || !numberVerified || !resetLoading}
                        length={1}
                    />
                    <TextInputComponent 
                        style={verificationStyles.inputWrapperTextItem} 
                        isNumericInput={true}
                        value={verificationCode.thirdNum}
                        name={'thirdNum'}
                        handleInputChange={(name, val) => handleChange(name, val)}
                        textInputRef={thirdInputRef}
                        isEditable={!dataLoading || !numberVerified || !resetLoading}
                        length={1}
                    />
                    <TextInputComponent 
                        style={verificationStyles.inputWrapperTextItem} 
                        isNumericInput={true}
                        value={verificationCode.fourthNum}
                        name={'fourthNum'}
                        handleInputChange={(name, val) => handleChange(name, val)}
                        textInputRef={fourthInputRef}
                        isEditable={!dataLoading || !numberVerified || !resetLoading}
                        length={1}
                    />
                </View>
                {
                    resetTimeLeftInSecs < 1 ? <>
                        <TouchableOpacity 
                            style={Object.assign({}, verificationStyles.resetBtn,  resetLoading || inputsDisabled || numberVerified ? verificationStyles.resetBtnLoading : {})}
                            activeOpacity={resetLoading || inputsDisabled || numberVerified ? 1 : 0.2}
                            onPress={handleResetCode}
                        >
                            <Text style={verificationStyles.resetBtnText}>{resetLoading ? 'Resetting...' : 'Reset code'}</Text>
                        </TouchableOpacity>
                    </>
                    :
                    <Text style={verificationStyles.resetText}>Reset code in {`00:${resetTimeLeftInSecs < 10 ? '0' + resetTimeLeftInSecs : resetTimeLeftInSecs}`}</Text>
                }
            </View>
        </AuthLayout>
    </>
}

export default VerificationScreen;