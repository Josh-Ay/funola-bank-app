import { Platform, Text, TouchableOpacity, View } from "react-native";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useEffect, useRef, useState } from "react";
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { onboardingStyles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import CustomDropdownItem from "../../../components/DropdownItemComponent/CustomDropdownItem";
import { userGenderChoices, userTitles } from "../../../utils/utils";
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';
import { useToast } from "react-native-toast-notifications";
import { AuthServices } from "../../../services/authServices";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { StackActions } from "@react-navigation/native";


const OnboardingScreen = ({ navigation, route }) => {

    const [ userDetails, setUserDetails ] = useState({
        email: '',
        password: '',
        dateOfBirth: new Date(),
        firstName: '',
        lastName: '',
        country: '',
        phoneNumber: '',
        phoneNumberExtension: '',
        title: '',
        gender: '',
        dateOfBirthSet: false,
    });
    const [ passwordObscured, setPasswordObscured ] = useState(true);
    const [ dataLoading, setDataLoading ] = useState(false);
    const [ showDatePicker, setShowDatePicker ] = useState(false);
    const surnameInputRef = useRef();
    const toast = useToast();

    useEffect(() => {

        handleUpdateUserDetail('email', route.params?.email);
        handleUpdateUserDetail('country', route.params?.country);
        handleUpdateUserDetail('phoneNumber', route.params?.number);
        handleUpdateUserDetail('phoneNumberExtension', route.params?.countryCode);

    }, [])


    const handleUpdateUserDetail = (passedName, passedVal) => {
        setUserDetails((prev) => {
            return {
                ...prev,
                [passedName]: passedVal,
            }
        })
    }

    const handleDateChange = (event, selectedDate) => {
        handleUpdateUserDetail('dateOfBirth', new Date(selectedDate));
        handleUpdateUserDetail('dateOfBirthSet', true);
        setShowDatePicker(false);
    }

    
    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleRegisterNewUser = async () => {
        if (userDetails.firstName.length < 1) return showToastMessage('Please enter your first name');
        if (userDetails.lastName.length < 1) return showToastMessage('Please enter your last name');
        if (!userDetails.dateOfBirthSet) return showToastMessage('Please enter your date of birth');
        if (userDetails.title.length < 1) return showToastMessage('Please enter your title');
        if (userDetails.gender.length < 1) return showToastMessage('Please enter your gender');
        if (userDetails.password.length < 1) return showToastMessage('Please enter a password');

        if (dataLoading) return

        setDataLoading(true);

        const dataToPost = {...userDetails};
        delete dataToPost.dateOfBirthSet;

        const authService = new AuthServices();

        try {
            
            const res = (await authService.registerNewUser(dataToPost)).data;
            setDataLoading(false);
            
            showToastMessage(res, 'success');

            navigation.dispatch(
                StackActions.replace('AccountConfirmation')
            )

        } catch (error) {
            // console.warn(error);
            const errorMsg = error.response ? error.response.data : error.message;

            setDataLoading(false);
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to onboard you. Please try again' : errorMsg, 'danger')
        }
    }

    return <>
        <AuthLayout
            title={'Fill your information'}
            subtitle={'Enter your details'}
            buttonText={'Continue'}
            handleAuthButtonClick={handleRegisterNewUser}
            showLoadingEffect={dataLoading}
            navigation={navigation}
        >
            <View style={onboardingStyles.container}>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your email</Text>
                    <TextInputComponent
                        placeholder="abc@gmail.com"
                        name={'email'}
                        value={userDetails.email}
                        isEditable={false}
                        isEmailInput={true}
                    />
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your first name</Text>
                    <TextInputComponent
                        placeholder="John"
                        name={'firstName'}
                        value={userDetails.firstName}
                        handleInputChange={(name, val) => handleUpdateUserDetail(name, val)}
                        isEditable={true}
                        returnKeyType={'next'}
                        handleSubmitBtnPress={() => surnameInputRef?.current?.focus()}
                    />
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your last name</Text>
                    <TextInputComponent
                        placeholder="Doe"
                        name={'lastName'}
                        value={userDetails.lastName}
                        handleInputChange={(name, val) => handleUpdateUserDetail(name, val)}
                        isEditable={true}
                        textInputRef={surnameInputRef}
                    />
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Date of birth</Text>
                    {
                        showDatePicker ?
                        <View style={onboardingStyles.datePickerWrapper}>
                            <DateTimePicker 
                                mode="date"
                                testID="datePicker"
                                value={userDetails.dateOfBirth}
                                onChange={handleDateChange}
                                maximumDate={new Date(2020, 10, 20)}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            />
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <MaterialIcons name="cancel" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                        :
                        <>
                            {
                                userDetails.dateOfBirthSet ? 
                                <View style={onboardingStyles.datePickerWrapper}>
                                    <Text style={onboardingStyles.dateValueText}>{userDetails.dateOfBirth.toDateString()}</Text>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                        <MaterialIcons name="edit" size={24} color="black" />
                                    </TouchableOpacity>
                                </View> 
                                :
                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <Text style={onboardingStyles.dateLabelText}>Select date of birth</Text>
                                </TouchableOpacity>
                            }
                        </>
                    }
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your title</Text>
                    <CustomDropdownItem 
                        hasDropdownItems={true}
                        dropdownItems={userTitles}
                        extractKey={'title'}
                        content={userDetails.title}
                        handleItemSelect={(selectedVal) => handleUpdateUserDetail('title', selectedVal.title)}
                        contentHasLoaded={true}
                        style={onboardingStyles.selectItemWrapper}
                        placeholderText={''}
                    />
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your gender</Text>
                    <CustomDropdownItem 
                        hasDropdownItems={true}
                        dropdownItems={userGenderChoices}
                        extractKey={'gender'}
                        content={userDetails.gender}
                        handleItemSelect={(selectedVal) => handleUpdateUserDetail('gender', selectedVal.gender)}
                        contentHasLoaded={true}
                        style={onboardingStyles.selectItemWrapper}
                        placeholderText={''}
                    />
                </View>
                <View>
                    <Text style={onboardingStyles.headerText}>Enter your password</Text>
                    <View style={onboardingStyles.inputContainer}>
                        <TextInputComponent
                            placeholder="password"
                            name={'password'}
                            value={userDetails.password}
                            handleInputChange={handleUpdateUserDetail}
                            isSecure={passwordObscured}
                            isEditable={!dataLoading}
                        />
                        <TouchableOpacity style={onboardingStyles.eyeBtn} onPress={() => setPasswordObscured(!passwordObscured)}>
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

export default OnboardingScreen;