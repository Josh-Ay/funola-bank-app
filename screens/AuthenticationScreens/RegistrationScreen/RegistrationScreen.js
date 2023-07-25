import { Text, View } from "react-native";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import { useEffect, useState } from "react";
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { registrationStyles } from "./styles";
import { AuthServices } from "../../../services/authServices";
import { validateEmail } from "../../../utils/helpers";
import CustomDropdownItem from "../../../components/DropdownItemComponent/CustomDropdownItem";
import { useAppContext } from "../../../contexts/AppContext";
import { useToast } from "react-native-toast-notifications";

const RegistrationScreen = ({ navigation }) => {
    const [ details, setDetails ] = useState({
        email: '',
        number: '',
        country: '',
        countryCode: '',
        flagImage: '',
    });
    const [ dataLoading, setDataLoading ] = useState(false);
    const [ dataLoaded, setDataLoaded ] = useState(false);
    const { countries, countriesLoaded } = useAppContext();
    const toast = useToast();

    useEffect(() => {
        setDataLoaded(false);
    }, [details.email, details.number, details.country])

    const handleUpdateUserDetail = (name, val) => {
        setDetails((prev) => {
            return {
                ...prev,
                [name]: val,
            }
        })
    }

    const handleCountrySelect = (val) => {
        handleUpdateUserDetail('countryCode', `${val?.idd?.root}${val?.idd?.suffixes.length === 1 ? val?.idd?.suffixes[0] : ''}`)
        handleUpdateUserDetail('flagImage', val?.flags?.png);
        handleUpdateUserDetail('country', val?.name?.common);
    }

    const showToastInfoMessage = (message) => {
        toast.show(message, {
            type: 'normal',
            placement: 'top'
        })
    }

    const handleStartBtnClick = async () => {
        // console.log(details);

        if (details.country.length < 1) return showToastInfoMessage('Please enter a location');
        if (details.number.length < 1) return showToastInfoMessage('Please enter a number');
        if (details.email.length < 1) return showToastInfoMessage('Please enter an email');
        if (details.number.length < 9) return showToastInfoMessage('Please enter a valid number');
        if (!validateEmail(details.email)) return showToastInfoMessage('Please enter a valid email');

        if (dataLoading) return

        const { countryCode, number, email } = details;
        const numberWithExtension = `${countryCode}${number}`;
            
        if (dataLoaded) {
            navigation.navigate('Verification', { ...details });
            return
        }
        
        const authService = new AuthServices();
        setDataLoading(true);

        try {
            const res = (await authService.sendVerificationCode({ number: numberWithExtension, email })).data;
            // console.log(res);
            
            setDataLoading(false);
            setDataLoaded(true);

            toast.show(res, {
                type: 'success',
                placement: 'top',
            });
            navigation.navigate('Verification', { ...details });

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            // console.log(errorMsg);

            setDataLoading(false);
            toast.show(errorMsg, {
                type: 'danger',
                placement: 'top'
            })
        }
    }

    return <>
        <AuthLayout 
            title={'Registration'} 
            subtitle={'Enter your mobile number and email, we will send your OTP to verify your number'}
            isRegistrationScreen={true}
            navigation={navigation}
            buttonText={'Start Using'}
            handleAuthButtonClick={handleStartBtnClick}
            showLoadingEffect={dataLoading}
        >
            <View style={registrationStyles.container}>
                <View>
                    <Text style={registrationStyles.headerText}>Enter your location</Text>
                    <View style={registrationStyles.splitItemWrapper}>
                        <CustomDropdownItem 
                            hasDropdownItems={true}
                            dropdownItems={countries}
                            resultingKeyIsNested={true}
                            levelOfNesting={1}
                            nestedKeyName={'common'}
                            extractKey={'name'}
                            handleItemSelect={handleCountrySelect}
                            imageContent={details.flagImage}
                            contentHasLoaded={countriesLoaded}
                            placeholderText={'Search country'}
                        />
                        <View style={registrationStyles.verticalLine}></View>
                        <View style={registrationStyles.locationText}>
                            <Text>{details.country}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={registrationStyles.headerText}>Enter your phone</Text>
                    <View style={registrationStyles.splitItemWrapper}>
                        <CustomDropdownItem 
                            content={details.countryCode}
                            style={registrationStyles.dropdownStyle}
                        />
                        <View style={registrationStyles.verticalLine}></View>
                        <TextInputComponent
                            placeholder="123456789"
                            name={'number'}
                            value={details.number}
                            handleInputChange={handleUpdateUserDetail}
                            isEditable={!dataLoading}
                            isNumericInput={true}
                            style={registrationStyles.textItem}
                        />
                    </View>
                </View>
                <View>
                    <Text style={registrationStyles.headerText}>Enter your email</Text>
                    <TextInputComponent
                        placeholder="abc@gmail.com"
                        name={'email'}
                        value={details.email}
                        handleInputChange={handleUpdateUserDetail}
                        isEditable={!dataLoading}
                        isEmailInput={true}
                    />
                </View>
            </View>
        </AuthLayout>
    </>
}

export default RegistrationScreen;
