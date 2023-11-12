import { useEffect, useRef, useState } from "react";
import AppLayout from "../../layouts/AppLayout/AppLayout";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../utils/colors";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from "lottie-react-native";
import { mapStyles } from "./mapStyles";
import { Animated } from "react-native";
import { Easing } from "react-native";
import UserProfileImage from "../../components/UserProfileImage/UserProfileImage";
import { useUserContext } from "../../contexts/UserContext";
import { UserServices } from "../../services/userServices";
import { useToast } from "react-native-toast-notifications";
import { Dimensions } from "react-native";
import { AtmServices } from "../../services/atmServices";
import { useAtmContext } from "../../contexts/AtmsContext";
import SingleAtmItem from "../../components/SingleAtmItem/SingleAtmItem";
import { FlatList } from "react-native";
import AnimatedLoader from "react-native-animated-loader";

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const { width, height } = Dimensions.get('screen');

const generatePosition = (width, height) => {
    const topPos = Math.floor(Math.random() * ((height * 0.5) - (height * 0.2) + 1)) + height * 0.2;
    const rightPos = Math.floor(Math.random() * ((width * 0.8) - (width * 0.1) + 1)) + width * 0.1;

    return {
        top: topPos,
        right: rightPos,
    }
}


const MapsScreen = ({ navigation }) => {
    const {
        currentUser,
        setCurrentUser,
        userProfileLoaded,
        setUserProfileLoaded,
        setUserProfileLoading,
    } = useUserContext();

    const {
        atms,
        setAtms,
        atmsLoading,
        setAtmsLoading,
        atmsLoaded,
        setAtmsLoaded,
    } = useAtmContext();

    const [ refreshing, setRefreshing ] = useState(false);
    const animationProgress = useRef(new Animated.Value(0));
    const  [ floatingUserIconPosition, setFloatingUserIconPosition ] = useState(generatePosition(width, height));
    const [ distance, setDistance ] = useState('10');
    const [ loading, setLoading ] = useState(false);
    const toast = useToast();

    const [
        userService, 
        atmService,
    ] = [
        new UserServices(),
        new AtmServices(),
    ]

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    useEffect(() => {
        setRefreshing(false);

        Animated.timing(animationProgress.current, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        if (!userProfileLoaded) {
            setUserProfileLoading(true);

            userService.getUserProfile().then(res => {
                setCurrentUser(res.data);
                setUserProfileLoaded(true);
                setUserProfileLoading(false);
            }).catch(err => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your details. Please refresh' : errorMsg, 'danger')
    
                setUserProfileLoading(false);
            })
        }

        if (!atmsLoaded) {
            atmService.getNearbyAtms()
            .then((res) => {
                setAtms(res?.data);

                setAtmsLoading(false);
                setAtmsLoaded(true);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get atms close to you. Please refresh' : errorMsg, 'danger');
                setAtmsLoading(false);
            })
        }
    }, [])

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            const res = (await atmService.getNearbyAtms()).data;
            setAtms(res);

            setRefreshing(false);
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying get latest atms close to you.' : errorMsg, 'danger');
            setRefreshing(false);
        }
    }

    const replayMapAnimation = () => {
        Animated.timing(animationProgress.current, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).reset();

        Animated.timing(animationProgress.current, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }

    const handleDotsButtonPress = () => {
        setLoading(true);

        setTimeout(() => {
            setLoading(false);

            replayMapAnimation();
            setFloatingUserIconPosition(generatePosition(width, height));
        }, 2000)
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={mapStyles.mapWrapper}>
                    <View style={mapStyles.titleContentWrapper}>
                        <View style={mapStyles.titleContent}>
                            <Text style={mapStyles.titleText}>Find ATM</Text>
                            <Text style={mapStyles.subtitleText}>Find the nearest ATM to you</Text>
                        </View>
                        <TouchableOpacity onPress={handleDotsButtonPress}>
                            <MaterialCommunityIcons name="dots-horizontal" size={34} color={colors.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={mapStyles.lottieWrapper}>
                        <AnimatedLottieView 
                            source={require("../../assets/json-animations/map-animation-1.json")} 
                            // autoPlay 
                            // loop 
                            style={mapStyles.lottie}
                            resizeMode='cover'
                            progress={animationProgress.current}
                        />
                    </View>

                    <UserProfileImage 
                        user={currentUser}
                        wrapperStyle={Object.assign({}, mapStyles.userImageWrapper, floatingUserIconPosition)}
                        imageStyle={mapStyles.image}
                    />

                    <View style={mapStyles.nearbyWrapper}>
                        <Text style={mapStyles.nearbyAtmText}>Related Nearby</Text>
                        <FlatList
                            data={Array.isArray(atms) ? atms : []}
                            renderItem={
                                ({item}) => 
                                <SingleAtmItem item={item} />
                            }
                            keyExtractor={item => item._id}
                            horizontal={true}
                            contentContainerStyle={mapStyles.nearbyAtmsWrap}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                </View>
                <AnimatedLoader
                    visible={loading}
                    overlayColor={colors.paleBlue}
                    animationStyle={mapStyles.loader}
                    speed={1}
                    source={require("../../assets/json-animations/map-loading-animation.json")}
                >
                    <Text style={mapStyles.loadingText}>
                        {`Fetching ATMs within a ${distance} metre radius...`}
                    </Text>
                </AnimatedLoader>
            </SafeAreaView>
        </AppLayout>
    </>
}

export default MapsScreen;