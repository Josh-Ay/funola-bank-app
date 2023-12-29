import { TouchableOpacity, View } from "react-native"
import { tabFilterStyles } from "./tabFilterStyles"
import { Text } from "react-native"

export default NavigationTabFilterItems = ({ 
    firstFilterItem,
    firstFilterItemActive,
    handleFirstFilterItemClick,
    secondFilterItem,
    secondFilterItemActive,
    handleSecondFilterItemClick,
    style,
}) => {
    if (
        !firstFilterItem ||
        !secondFilterItem
    ) return

    return <>
        <View
            style={
                style && typeof style === 'object' ?
                    Object.assign(
                        {},
                        tabFilterStyles.filterWrap,
                        style,
                    )
                :
                tabFilterStyles.filterWrap
            }
        >
            <View 
                style={tabFilterStyles.filterItem}
            >
                <TouchableOpacity
                    onPress={
                        handleFirstFilterItemClick && typeof handleFirstFilterItemClick ?
                            () => handleFirstFilterItemClick()
                        :
                        () => {}
                    }
                >
                    <Text
                        style={
                            Object.assign(
                                {},
                                tabFilterStyles.filterItemText,
                                firstFilterItemActive ? tabFilterStyles.activeFilter : {},
                            )
                        }
                    >
                        {firstFilterItem}
                    </Text>
                </TouchableOpacity>
                <View 
                    style={
                        Object.assign(
                            {}, 
                            tabFilterStyles.filterIndicator,
                            firstFilterItemActive ? tabFilterStyles.blueFilterIndicator : {}
                        )
                    }
                ></View>
            </View>
            <View 
                style={tabFilterStyles.filterItem}
            >
                <TouchableOpacity
                    onPress={
                        handleSecondFilterItemClick && typeof handleSecondFilterItemClick ?
                            () => handleSecondFilterItemClick()
                        :
                        () => {}
                    }
                >
                    <Text
                        style={
                            Object.assign(
                                {},
                                tabFilterStyles.filterItemText,
                                secondFilterItemActive ? tabFilterStyles.activeFilter : {},
                            )
                        }
                    >
                        {secondFilterItem}
                    </Text>
                </TouchableOpacity>
                <View 
                    style={
                        Object.assign(
                            {}, 
                            tabFilterStyles.filterIndicator,
                            secondFilterItemActive ? tabFilterStyles.blueFilterIndicator : {}
                        )
                    }
                ></View>
            </View>
        </View>
    </>
}