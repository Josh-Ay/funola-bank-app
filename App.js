import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen/WelcomeScreen';
import { useState } from 'react';
import RegistrationScreen from './screens/AuthenticationScreens/RegistrationScreen/RegistrationScreen';
import LoginScreen from './screens/AuthenticationScreens/LoginScreen/LoginScreen';
import AppContextProvider from './contexts/AppContext';
import { ToastProvider } from 'react-native-toast-notifications';
import VerificationScreen from './screens/AuthenticationScreens/VerificationScreen/VerificationScreen';
import OnboardingScreen from './screens/AuthenticationScreens/OnboardingScreen/OnboardingScreen';
import AccountConfirmationScreen from './screens/AuthenticationScreens/ConfirmationScreen/ConfirmationScreen';
import useLoadFonts from './hooks/useLoadFonts';
import UserContextProvider from './contexts/UserContext';
import HomeScreen from './screens/HomeScreen/HomeScreen';
import useCheckLoginStatus from './hooks/useCheckLoginStatus';
import LoadingScreen from './screens/LoadingScreen/LoadingScreen';
import WalletContextProvider from './contexts/WalletContext';
import CardContextProvider from './contexts/CardContext';
import DepositContextProvider from './contexts/DepositContext';
import CardsScreen from './screens/CardsScreen/CardsScreen';
import MapsScreen from './screens/MapsScreen/MapsScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import NotificationScreen from './screens/NotificationScreen/NotificationScreen';
import CardSettingsScreen from './screens/CardSettingsScreen/CardSettingsScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [ appIsReady, setAppIsReady ] = useState(false);
  const [ userStatusChecked, setUserStatusChecked ] = useState(false);
  const [ userLoggedIn, setUserLoggedIn ] = useState(false);

  // load fonts and check if user is already logged in
  useLoadFonts(setAppIsReady);
  useCheckLoginStatus(appIsReady, userLoggedIn, setUserLoggedIn, setUserStatusChecked);

  if (!appIsReady) return null

  // show loading screen while login status is checked
  if (!userStatusChecked) return (
    <NavigationContainer>
      <ToastProvider>
        <Stack.Navigator initialRouteName='Loading' screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name='Loading'
              component={LoadingScreen}
            />  
          </Stack.Navigator>
      </ToastProvider>
    </NavigationContainer>
  )

  // LOGGED IN USERS
  if (userLoggedIn) return (
    <NavigationContainer>
      <ToastProvider>
        <UserContextProvider>
          <WalletContextProvider>
            <CardContextProvider>
              <DepositContextProvider>
                <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name='Home'
                    component={HomeScreen}
                  />
                  <Stack.Screen
                    name='Cards'
                    component={CardsScreen}
                  />
                  <Stack.Screen
                    name='CardSettings'
                    component={CardSettingsScreen}
                  />
                  <Stack.Screen
                    name='Map'
                    component={MapsScreen}
                  />
                  <Stack.Screen
                    name='Profile'
                    component={ProfileScreen}
                  />
                  <Stack.Screen
                    name='Notifications'
                    component={NotificationScreen}
                  />
                </Stack.Navigator>
              </DepositContextProvider>
            </CardContextProvider>
          </WalletContextProvider>
        </UserContextProvider>
      </ToastProvider>
    </NavigationContainer>
  )

  // NON-LOGGED IN USERS
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
            >
              { 
                props => <LoginScreen 
                  {...props} 
                  setLoggedIn={setUserLoggedIn} 
                /> 
              }
            </Stack.Screen>
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

