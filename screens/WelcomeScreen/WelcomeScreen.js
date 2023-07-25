import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { welcomeStyles } from "./styles";
import { useEffect } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { CountryServices } from "../../services/countriesServices";

const WelcomeScreen = ({ navigation }) => {    

    const { countries, setCountries, setCountriesLoaded } = useAppContext();
    const countryService = new CountryServices();

    useEffect(() => {
        if (countries.length > 0) return

        countryService.fetchCountries().then(res => {
            const countriesResponse = res.data;
            if (!Array.isArray(countriesResponse) || !countriesResponse.every(country => typeof country === "object")) return 
            
            const sortedCountriesByName = countriesResponse.sort((a, b) => a?.name?.common?.localeCompare(b?.name?.common));
            setCountries(sortedCountriesByName)
            setCountriesLoaded(true);
        }).catch (error => {
            console.warn('Failed to fetch countries')
            setCountriesLoaded(true);
        });

    }, [])
    
    return (
        <>
            <SafeAreaView style={welcomeStyles.container}>
                <View style={welcomeStyles.topContent}>
                    <Image source={require('../../assets/welcome-illustration.png')} style={welcomeStyles.welcomeImage}/>
                    <Text style={welcomeStyles.getStartedText}>Let's get started</Text>
                    <Text style={welcomeStyles.extraInfoText}>Never a better time than now to start thinking about how you manage all your finances with ease.</Text>
                </View>
                <View style={welcomeStyles.bottomContent}>
                    <TouchableOpacity style={welcomeStyles.createBtn} onPress={() => navigation.navigate('Registration')}>
                        <Text style={welcomeStyles.createBtnText}>Create account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={welcomeStyles.loginBtn} onPress={() => navigation.navigate('Login')}>
                        <Text style={welcomeStyles.loginBtnText}>Login to Account</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    )
}

export default WelcomeScreen;
