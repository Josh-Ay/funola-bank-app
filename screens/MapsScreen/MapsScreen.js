import React, { useEffect, useRef, useState } from "react";
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
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ModalOverlay from "../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";
import { mapSnapPoints } from "../../layouts/AppLayout/utils";
import { appLayoutStyles } from "../../layouts/AppLayout/styles";
import Slider from "@react-native-community/slider";
import { AntDesign } from '@expo/vector-icons';

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
const { width, height } = Dimensions.get('screen');
const distancesOptions = [
    {
        id: '11',
        option: 100,
    }, 
    {
        id: '22',
        option: 200,
    },
    {
        id: '33',
        option: 300,
    },
    {
        id: '44',
        option: 400,
    },
    {
        id: '55',
        option: 500,
    },
    {
        id: '66',
        option: 600
    },
]

const generatePosition = (width, height) => {
    const topPos = Math.floor(Math.random() * ((height * 0.5) - (height * 0.2) + 1)) + height * 0.2;
    const rightPos = Math.floor(Math.random() * ((width * 0.8) - (width * 0.1) + 1)) + width * 0.1;

    return {
        top: topPos,
        right: rightPos,
    }
}

const QuickDistanceItem = ({ item, handlePress }) => {
    return <>
        <TouchableOpacity 
            onPress={() => handlePress(item.option)}
            style={mapStyles.quickDistanceBtn}
        >
            <Text style={mapStyles.quickDistanceText}>{item.option}m</Text>
        </TouchableOpacity>
    </>
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
    const [ distance, setDistance ] = useState(10);
    const [ loading, setLoading ] = useState(false);
    const sheetPanelRef = useRef();
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ results, setResults ] = useState(null);
    
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

    const handleCloseBottomSheet = (resetDistance=true) => {
        setSheetModalIsOpen(false);
        // setResults(null);
        // setDistance(10);
    }

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
        setSheetModalIsOpen(true);
    }

    const handleGetATMsInDistance = async () => {
        setLoading(true);

        try {
            const res = (await atmService.findAtmWithinDistance({ distance: distance })).data;
            // console.log(res);
            setResults(res);
            setLoading(false);
            
            replayMapAnimation();
            setFloatingUserIconPosition(generatePosition(width, height));
            handleCloseBottomSheet();

            showToastMessage(`Found ${res?.length} atms in a ${distance}m radius!`, 'success');
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get atms within the distance you passed' : errorMsg, 'danger');
            setLoading(false);
        }
    }

    return <>
        <AppLayout
            navigation={navigation}
            pageRefreshing={refreshing}
            handlePageRefresh={handleRefresh}
            sheetModalIsOpen={sheetModalIsOpen}
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
                        <Text style={mapStyles.nearbyAtmText}>
                            {
                                results && Array.isArray(results) ? 
                                    `${results?.length} ${results?.length > 1 ? 'ATMS' : 'ATM'} found in a ${distance}m radius`
                                :
                                'Related Nearby'
                            }</Text>
                        <FlatList
                            data={
                                results && Array.isArray(results) ? 
                                    results
                                :
                                Array.isArray(atms) ? 
                                    atms 
                                : 
                                []
                            }
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
                        {`Finding ATMs within a ${distance} metre radius...`}
                    </Text>
                </AnimatedLoader>

                {/* MAPs PAGE SHEET MODAL */}
                {
                    sheetModalIsOpen && 
                    <ModalOverlay
                        handleClickOutside={handleCloseBottomSheet}
                    >
                        <BottomSheet
                            ref={sheetPanelRef}
                            snapPoints={
                                mapSnapPoints
                            }
                            style={appLayoutStyles.modalWrapper}
                            enablePanDownToClose={true}
                            onClose={handleCloseBottomSheet}
                        >
                            <BottomSheetView style={appLayoutStyles.modalContainer}>
                                <View style={mapStyles.modalContentWrapper}>
                                    <Text style={mapStyles.modalTitle}>Set radius</Text>
                                    <View style={mapStyles.distanceTextWrap}>
                                        <TouchableOpacity 
                                            onPress={
                                                distance - 100 >= 100 ? 
                                                    () => setDistance(distance - 100)
                                                :
                                                () => {}
                                            }
                                            style={mapStyles.distanceBtn}
                                        >
                                            <AntDesign name="minus" size={24} color={colors.grey} />
                                        </TouchableOpacity>
                                        <Text style={mapStyles.distanceText}>{distance}m</Text>
                                        <TouchableOpacity
                                            onPress={
                                                distance + 100 <= 1800 ? 
                                                    () => setDistance(distance + 100)
                                                :
                                                () => {}
                                            }
                                            style={mapStyles.distanceBtn}
                                        >
                                            <AntDesign name="plus" size={24} color={colors.grey} />
                                        </TouchableOpacity>
                                    </View>
                                    <Slider
                                        style={mapStyles.slider}
                                        minimumValue={10}
                                        maximumValue={1800}
                                        minimumTrackTintColor={colors.blue}
                                        maximumTrackTintColor={colors.grey}
                                        thumbTintColor={colors.blue}
                                        value={distance}
                                        onValueChange={(val) => setDistance(val)}
                                        step={10}
                                        lowerLimit={10}
                                        upperLimit={1800}
                                    />
                                    <FlatList
                                        data={distancesOptions}
                                        renderItem={
                                            ({item}) => 
                                            <QuickDistanceItem item={item} handlePress={(itemVal) => setDistance(itemVal)} />
                                        }
                                        keyExtractor={item => item.id}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={mapStyles.quickDistances}
                                    />
                                    <View style={mapStyles.actionsWrap}>
                                        <TouchableOpacity 
                                            style={mapStyles.cancelBtn}
                                            onPress={handleCloseBottomSheet}
                                        >
                                            <Text style={mapStyles.cancelBtnText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={mapStyles.acceptBtn}
                                            onPress={handleGetATMsInDistance}
                                        >
                                            <Text style={mapStyles.acceptBtnText}>Accept</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </BottomSheetView>
                        </BottomSheet>
                    </ModalOverlay>
                }
            </SafeAreaView>
        </AppLayout>
    </>
}

export default MapsScreen;