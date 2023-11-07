import { Text, TouchableOpacity, View } from "react-native"
import { navigationItems } from "../../layouts/AppLayout/utils"
import React from "react"
import { colors } from "../../utils/colors"
import { bottomNavStyles } from "./bottomNavStyles"

export default function BottomNavigationBar ({
    applayoutModalIsOpen,
    handleNavItemPress,
    currentRouteName
}) {
    return <>
        <View 
            style={
                applayoutModalIsOpen ?
                Object.assign({}, bottomNavStyles.footer, bottomNavStyles.overlayContent)
                :
                bottomNavStyles.footer
            }
        >
            {
                React.Children.toArray(navigationItems.map(item => {
                    return <>
                        <TouchableOpacity
                            style={bottomNavStyles.footerItem} 
                            onPress={
                                handleNavItemPress && typeof handleNavItemPress === 'function' ?
                                    () => handleNavItemPress(item.routeName)
                                :
                                () => {}
                            }
                        >
                            {
                                item.icon && typeof item.icon === 'function' && 
                                <View>
                                    {
                                        item.icon(currentRouteName == item.routeName ? colors.blue : colors.grey)
                                    }
                                </View>
                            }
                            <Text
                                style={
                                    Object.assign(
                                        {}, 
                                        bottomNavStyles.footerContentText,
                                        currentRouteName == item.routeName ?
                                            bottomNavStyles.activeItem :
                                            bottomNavStyles.nonActiveItem
                                    )
                                }
                            >
                                {item.displayName}
                            </Text>
                        </TouchableOpacity>
                    </>
                }))
            }
        </View>
    </>
}