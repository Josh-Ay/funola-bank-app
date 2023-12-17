import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../../utils/colors";
import UserActionItem from "../../../components/UserActionItem/UserActionItem";
import { Ionicons } from '@expo/vector-icons';
import { sendFundStyles } from "./sendFundStyles";
import * as Contacts from 'expo-contacts';
import { SendFundTabs } from "./utils";
import { AntDesign } from '@expo/vector-icons';
import CustomDropdownItem from "../../../components/DropdownItemComponent/CustomDropdownItem";
import { useUserContext } from "../../../contexts/UserContext";
import { FlashList } from "@shopify/flash-list";


const ContactItem = ({ item, showOnlyContactsOnFunola }) => {
    const {
        otherUsers,
    } = useUserContext();

    const handleSelectContact = (numberPassed) => {
        const foundUserOnFunola = otherUsers?.find(user => user?.phoneNumber === numberPassed?.slice(-10));

        if (foundUserOnFunola) {
            console.log(foundUserOnFunola);
            // navigator.navigate(
            //     '', 
            //     {}
            // )
            return
        }

        console.log('invite user to funola');
    }

    if (Array.isArray(item?.phoneNumbers)) return <>
        {
            React.Children.toArray(item?.phoneNumbers.map(number => {
                const numberIsOnFunola = otherUsers?.find(user => user?.phoneNumber === number?.digits?.slice(-10));

                if (showOnlyContactsOnFunola && !numberIsOnFunola) return <></>

                return <>
                    <View style={sendFundStyles.singleContact}>
                        <View style={sendFundStyles.singleContactTopContent}>
                            {
                                item.imageAvailable ? 
                                <Image 
                                    source={item.image}
                                    style={sendFundStyles.contactImage}
                                />
                                :
                                <AntDesign name="user" size={35} color="black" />
                            }
                            
                            <View>
                                <Text style={sendFundStyles.contactName}>{item?.name?.length > 25 ? item?.name?.slice(0, 25) + '...' : item?.name}</Text>
                                <Text style={sendFundStyles.contactNumber}>{number?.digits}</Text>
                            </View>
                        </View>
                        <TouchableOpacity 
                            style={sendFundStyles.contactActionBtn}
                            onPress={() => handleSelectContact(number?.digits)}
                        >
                            <Text style={sendFundStyles.contactActionBtnText}>
                                {
                                    numberIsOnFunola ? 
                                        'Select'
                                    :
                                    'Invite'
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </>
            }))
        }
    </>
    
    return <></>
}

const RecentItem = ({ item }) => {
    return <>
        <TouchableOpacity style={sendFundStyles.recentUserItem}>
            <AntDesign name="user" size={50} color="black" />

            <View>
                <Text style={sendFundStyles.recentUsername}>Hello</Text>
                <Text style={sendFundStyles.recentUserNumber}>+234940248920934</Text>
            </View>
        </TouchableOpacity>
    </>
}


const SendFundsScreen = ({ navigation, route }) => {
    const [ activeTab, setActiveTab ] = useState(SendFundTabs[0]?.action);
    const [ searchValue, setSearchValue ] = useState('');
    const [ statusGranted, setStatusGranted ] = useState(null);
    const [ contacts, setContacts ] = useState([]);
    const [ showContactsOnFunola, setShowContactsOnFunola ] = useState(true);
    const {
        otherUsers,
    } = useUserContext();

    const requestContactAccess = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.RawImage, Contacts.Fields.Image],
            });

            return data
        }
    }

    useEffect(() => {

        requestContactAccess().then(res => {
            setContacts(res.sort((a, b) => a?.name?.localeCompare(b?.name)));
            setStatusGranted('yes');
        }).catch(err => {
            console.log(err);
            setStatusGranted('no')
        })

    }, []);


    const handleSelectContactFromSearch = (contact) => {
        setSearchValue(contact?.name);

        const userHasOneNumberOnFunola = otherUsers?.find(user => contact?.phoneNumbers?.find(number => user?.phoneNumber ===  number?.digits?.slice(-10)));
        if (userHasOneNumberOnFunola) return setShowContactsOnFunola(true);

        setShowContactsOnFunola(false);
    }

    return <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paleBlue }}>
            <View style={sendFundStyles.topContentWrapper}>
                <TouchableOpacity onPress={() => navigation.pop()}>
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={sendFundStyles.topContent}>
                    <Text style={sendFundStyles.titleText}>Send money</Text>
                    <Text style={sendFundStyles.subtitleText}>Select options</Text>
                    <SafeAreaView style={sendFundStyles.cardActionsStyle}>
                        <FlatList
                            data={SendFundTabs}
                            renderItem={
                                ({item}) => 
                                <UserActionItem
                                    item={item} 
                                    handleItemPress={(item) => setActiveTab(item)} 
                                    style={activeTab !== item.action ? sendFundStyles.nonActiveTab : {}} 
                                />
                            }
                            keyExtractor={item => item.id}
                            horizontal={true}
                            contentContainerStyle={{
                                justifyContent: 'space-between',
                                width: '100%',
                                paddingLeft: 8,
                                paddingRight: 8,
                            }}
                        />
                    </SafeAreaView>
                </View>
            </View>
            <View style={sendFundStyles.contentWrapper}>
                {
                    activeTab === 'mobile' ? <>
                        <View style={sendFundStyles.recentsWrapper}>
                            <Text style={sendFundStyles.itemContentTitle}>
                                Recent
                            </Text>

                            <FlatList 
                                data={
                                    [
                                        {id: 1},
                                        {id: 2},
                                        {id: 3},
                                        {id: 4},
                                        {id: 5},
                                    ]
                                }
                                renderItem={
                                    ({item}) => 
                                        <RecentItem
                                            item={item}
                                        />
                                }
                                keyExtractor={item => item.id}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={sendFundStyles.recentListingWrap}
                            />
                        </View>
                        <ScrollView style={sendFundStyles.contactWrapper}>
                            <Text style={sendFundStyles.contactHeadingTitle}>
                                All contacts
                            </Text>
                            {
                                statusGranted === 'yes' ?
                                <>

                                
                                    <View 
                                        style={sendFundStyles.depositFilterWrap}
                                    >
                                        <View 
                                            style={sendFundStyles.depositFilterItem}
                                        >
                                            <TouchableOpacity
                                                onPress={
                                                    () => setShowContactsOnFunola(true)
                                                }
                                            >
                                                <Text
                                                    style={
                                                        Object.assign(
                                                            {},
                                                            sendFundStyles.depositFilterItemText,
                                                            !showContactsOnFunola ? {} : sendFundStyles.activeFilter,
                                                        )
                                                    }
                                                >On Funola</Text>
                                            </TouchableOpacity>
                                            <View 
                                                style={
                                                    Object.assign(
                                                        {}, 
                                                        sendFundStyles.depositFilterIndicator,
                                                        showContactsOnFunola ? sendFundStyles.blueDepositFilterIndicator : {}
                                                    )
                                                }
                                            ></View>
                                        </View>
                                        <View 
                                            style={sendFundStyles.depositFilterItem}
                                        >
                                            <TouchableOpacity
                                                onPress={
                                                    () => setShowContactsOnFunola(false)
                                                }
                                            >
                                                <Text
                                                    style={
                                                        Object.assign(
                                                            {},
                                                            sendFundStyles.depositFilterItemText,
                                                            showContactsOnFunola ? {} : sendFundStyles.activeFilter,
                                                        )
                                                    }
                                                >Not On Funola</Text>
                                            </TouchableOpacity>
                                            <View 
                                                style={
                                                    Object.assign(
                                                        {}, 
                                                        sendFundStyles.depositFilterIndicator,
                                                        !showContactsOnFunola ? sendFundStyles.blueDepositFilterIndicator : {}
                                                    )
                                                }
                                            ></View>
                                        </View>
                                    </View>

                                    <CustomDropdownItem
                                        hasDropdownItems={true}
                                        dropdownItems={contacts}
                                        extractKey={'name'}
                                        content={searchValue}
                                        handleItemSelect={(selectedVal) => handleSelectContactFromSearch(selectedVal)}
                                        contentHasLoaded={true}
                                        style={sendFundStyles.searchWrapper}
                                        placeholderText={'Search name or number...'}
                                        customSearch={true}
                                        handleClearSearch={() => setSearchValue('')}
                                    />
                                    
                                    {/* <FlatList 
                                        data={contacts.filter(contact => {
                                            if (searchValue.length < 1) return true

                                            return contact?.name?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase()) || contact?.phoneNumbers?.find(number => number.digits.includes(searchValue))
                                        })}
                                        renderItem={
                                            ({item}) => 
                                                <ContactItem
                                                    item={item}
                                                    showOnlyContactsOnFunola={showContactsOnFunola}
                                                />
                                        }
                                        keyExtractor={item => item.id}
                                        contentContainerStyle={sendFundStyles.contactListing}
                                        initialNumToRender={10}
                                    /> */}

                                    <View style={{ height: 400 }}>
                                        <FlashList
                                            data={
                                                contacts.filter(contact => {
                                                    if (searchValue.length < 1) return true
        
                                                    return contact?.name?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase()) || contact?.phoneNumbers?.find(number => number.digits.includes(searchValue))
                                                })
                                            }
                                            renderItem={
                                                ({ item }) => 
                                                <ContactItem
                                                    item={item}
                                                    showOnlyContactsOnFunola={showContactsOnFunola}
                                                />
                                            }
                                            estimatedItemSize={400}
                                            contentContainerStyle={sendFundStyles.contactListing}
                                        />
                                    </View>
                                    
                                </>
                                :
                                statusGranted === 'no' ?
                                <>
                                    <View style={sendFundStyles.requestAccessWrap}>
                                        <Text style={
                                            Object.assign(
                                                {}, 
                                                sendFundStyles.requestText,
                                                { 
                                                    textAlign: 'center'
                                                }
                                            )
                                        }>
                                            You need to grant Funola access to your contacts
                                        </Text>
                                        <View></View>
                                        <View></View>

                                        <Text style={sendFundStyles.requestText}>To do this, please follow these steps: </Text>
                                        
                                        <View></View>
                                        
                                        <Text style={sendFundStyles.requestText}>- Open up 'Settings' on your phone</Text>
                                        <Text style={sendFundStyles.requestText}>- Go to 'Apps', then select 'Expo GO'</Text>
                                        <Text style={sendFundStyles.requestText}>- Toggle on the option to allow access to your contacts</Text>
                                    </View>
                                </>
                                :
                                <></>
                            }
                            
                        </ScrollView>
                    </> :

                    activeTab === 'bank' ? <>
                        <View style={sendFundStyles.payeeWrapper}>
                            <View style={sendFundStyles.payeeHeaderWrap}>
                                <Text style={sendFundStyles.itemContentTitle}>
                                    Payee List
                                </Text>
                                <TouchableOpacity>
                                    <Text style={sendFundStyles.addPayeeBtnText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </> :

                    <></>
                }
                
            </View>
        </SafeAreaView>
    </>
}

export default SendFundsScreen;