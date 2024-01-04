import { ActivityIndicator, Text, View } from "react-native"
import { colors } from "../../utils/colors"
import { loadingIndicatorStyles } from "./loadingIndicatorStyles"

export default LoadingIndicator = ({ loadingContent, color, spinnerColor, removeTextContent }) => {
    return <>
        <View style={loadingIndicatorStyles.loaderWrap}>
            <ActivityIndicator color={spinnerColor ? spinnerColor : colors.blue} />
            {
                removeTextContent ? <></> : 
                <Text style={
                        color ?
                            {
                                ...loadingIndicatorStyles.loaderText,
                                color: color,
                            }
                        :
                        loadingIndicatorStyles.loaderText
                    }
                >
                    {
                        loadingContent && typeof loadingContent === 'string' ? 
                            `${loadingContent}...`
                        :
                            'Loading...'
                    }
                </Text>
            }
        </View>
    </>
}