import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { authStyles } from "./styles";
import AnimatedLoader from "react-native-animated-loader";
import { colors } from "../../utils/colors";

const AuthLayout = ({
  children,
  title,
  subtitle,
  isRegistrationScreen,
  navigation,
  buttonText,
  handleAuthButtonClick,
  showLoadingEffect,
  isVerificationScreen,
  handleBackBtnClick,
}) => {
  return (
    <>
      <View style={authStyles.container}>
        <View style={authStyles.topContent}>
          <AntDesign
            name="left"
            size={24}
            color="black"
            onPress={
              navigation
                ? () => navigation.canGoBack() && navigation.pop()
                : 
                handleBackBtnClick && typeof handleBackBtnClick === "function"
                ? handleBackBtnClick()
                : 
                () => {}
            }
          />
          <Text style={authStyles.titleText}>{title}</Text>
          <Text
            style={Object.assign(
              {},
              authStyles.subtitleText,
              isVerificationScreen ? authStyles.fullText : {}
            )}
          >
            {subtitle}
          </Text>
        </View>
        <View style={authStyles.mainContent}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
              {children}
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
        <View style={authStyles.bottomContent}>
          <TouchableOpacity
            style={Object.assign(
              {},
              !isRegistrationScreen ? authStyles.btn_ : authStyles.btn
            )}
            onPress={
              showLoadingEffect
                ? () => {}
                : handleAuthButtonClick &&
                  typeof handleAuthButtonClick === "function"
                ? () => handleAuthButtonClick()
                : () => {}
            }
            activeOpacity={showLoadingEffect ? 1 : 0.2}
          >
            <Text style={authStyles.btnText}>{buttonText}</Text>
          </TouchableOpacity>
          {isRegistrationScreen && (
            <>
              <View>
                <Text>By clicking start you agree to our</Text>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      "https://github.com/Josh-Ay/funola-bank-app"
                    )
                  }
                >
                  <Text style={authStyles.legalContentText}>
                    Privacy policy and Terms
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
      <AnimatedLoader
        visible={showLoadingEffect}
        overlayColor={colors.paleBlue}
        animationStyle={authStyles.loader}
        speed={1}
        source={require("../../assets/json-animations/loader-circless.json")}
      >
        <Text style={authStyles.loadingText}>Please wait...</Text>
      </AnimatedLoader>
    </>
  );
};

export default AuthLayout;
