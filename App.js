import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import AppContextProvider from './contexts/AppContext';
import { ToastProvider } from 'react-native-toast-notifications';
import useLoadFonts from './hooks/useLoadFonts';
import UserContextProvider from './contexts/UserContext';
import useCheckLoginStatus from './hooks/useCheckLoginStatus';
import LoadingScreen from './screens/LoadingScreen/LoadingScreen';
import WalletContextProvider from './contexts/WalletContext';
import CardContextProvider from './contexts/CardContext';
import DepositContextProvider from './contexts/DepositContext';
import AtmContextProvider from './contexts/AtmsContext';
import BanksContextProvider from './contexts/BanksContext';
// import useCheckIfTimeToLockApp from './hooks/useCheckIfTimeToLockApp';
import { LogBox } from 'react-native';
import { loggedInUserRoutes } from './routes/loggedInUserRoutes';
import { nonLoggedInuserRoutes } from './routes/nonLoggedInUserRoutes';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createNativeStackNavigator();

export default function App() {

  const [ appIsReady, setAppIsReady ] = useState(false);
  const [ userStatusChecked, setUserStatusChecked ] = useState(false);
  const [ userLoggedIn, setUserLoggedIn ] = useState(false);
  // const [ appLocked, setAppLocked ] = useState(false);

  // load fonts and check if user is already logged in
  useLoadFonts(setAppIsReady);
  useCheckLoginStatus(
    appIsReady, 
    userLoggedIn, 
    setUserLoggedIn,
    setUserStatusChecked
  );

  // useCheckIfTimeToLockApp(
  //   userLoggedIn,
  //   setAppLocked,
  // )

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
                <AtmContextProvider>
                  <BanksContextProvider>
                    <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
                      {
                        React.Children.toArray(loggedInUserRoutes.map(route => {
                          if (route.hasOptions) return <Stack.Screen
                            name={route.routeName}
                            component={route.component}
                            options={route.options}
                          />

                          if (route.hasProps) return <Stack.Screen
                            name={route.routeName}
                          >
                            { 
                              props => <route.component 
                                {...props} 
                                setLoggedIn={setUserLoggedIn} 
                              /> 
                            }
                          </Stack.Screen>

                          return <Stack.Screen 
                            name={route.routeName}
                            component={route.component}
                          />
                        }))
                      }
                    </Stack.Navigator>
                  </BanksContextProvider>
                </AtmContextProvider>
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
            {
              React.Children.toArray(nonLoggedInuserRoutes.map(route => {
                if (route.hasProps) return <Stack.Screen
                  name={route.routeName}
                >
                  { 
                    props => <route.component 
                      {...props} 
                      setLoggedIn={setUserLoggedIn} 
                    /> 
                  }
                </Stack.Screen>

                return <Stack.Screen 
                  name={route.routeName}
                  component={route.component}
                />
              }))
            }
          </Stack.Navigator>
        </AppContextProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}

