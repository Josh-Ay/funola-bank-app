import AnimatedLoader from "react-native-animated-loader";
import { colors } from "../../utils/colors";
import { styles } from "./styles";
import { Text } from "react-native";

const LoadingScreen = ({ contentText }) => {
    return <>
        <AnimatedLoader
            visible={true}
            overlayColor={colors.paleBlue}
            animationStyle={styles.loader}
            speed={1}
            source={require("../../assets/json-animations/loader-circless.json")}
        >
            <Text style={styles.loadingText}>
                {
                    contentText ? contentText : 
                    "Welcome to Funola. This will just take a few seconds..."
                }
            </Text>
        </AnimatedLoader>
    </>
}

export default LoadingScreen;