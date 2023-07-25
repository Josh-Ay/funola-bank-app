import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import fonts from './assets/fonts';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import RegistrationScreen from './screens/AuthenticationScreens/RegistrationScreen/RegistrationScreen';
import LoginScreen from './screens/AuthenticationScreens/LoginScreen/LoginScreen';
import AppContextProvider from './contexts/AppContext';
import { ToastProvider } from 'react-native-toast-notifications';
import VerificationScreen from './screens/AuthenticationScreens/VerificationScreen/VerificationScreen';
import OnboardingScreen from './screens/AuthenticationScreens/OnboardingScreen/OnboardingScreen';
import AccountConfirmationScreen from './screens/AuthenticationScreens/ConfirmationScreen/ConfirmationScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [ appIsReady, setAppIsReady ] = useState(false);

  const loadFonts = async () => {
    try {

      await Font.loadAsync(fonts);
      setAppIsReady(true);

    } catch (error) {
      console.warn(error);      
      setAppIsReady(true);
    }
  }

  useEffect(() => {
    loadFonts();
  }, [])

  if (!appIsReady) return null

  return (
    <NavigationContainer>
      <ToastProvider>
        <AppContextProvider>
          <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name='Welcome'
              component={WelcomeScreen}
            />
            <Stack.Screen 
              name='Registration'
              component={RegistrationScreen}
            />
            <Stack.Screen 
              name='Login'
              component={LoginScreen}
            />
            <Stack.Screen 
              name='Verification'
              component={VerificationScreen}
            />
            <Stack.Screen 
              name='Onboarding'
              component={OnboardingScreen}
            />
            <Stack.Screen 
              name='AccountConfirmation'
              component={AccountConfirmationScreen}
            />
          </Stack.Navigator>
        </AppContextProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}

