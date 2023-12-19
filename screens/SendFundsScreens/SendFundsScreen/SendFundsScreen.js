import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "../../../utils/colors";
import UserActionItem from "../../../components/UserActionItem/UserActionItem";
import { Ionicons } from '@expo/vector-icons';
import { sendFundStyles } from "./sendFundStyles";
import * as Contacts from 'expo-contacts';
import { SendFundTabs } from "./utils";
import CustomDropdownItem from "../../../components/DropdownItemComponent/CustomDropdownItem";
import { useUserContext } from "../../../contexts/UserContext";
import { FlashList } from "@shopify/flash-list";
import { useBanksContext } from "../../../contexts/BanksContext";
import { BankServices } from "../../../services/bankServices";
import RecentItem from "./components/RecentsItem/RecentItem";
import ContactItem from "./components/ContactItem/ContactItem";
import BankItem from "./components/BankItem/BankItem";


const SendFundsScreen = ({ navigation, route }) => {
    const [ activeTab, setActiveTab ] = useState(SendFundTabs[0]?.action);
    const [ searchValue, setSearchValue ] = useState('');
    const [ statusGranted, setStatusGranted ] = useState(null);
    const [ contacts, setContacts ] = useState([]);
    const [ showContactsOnFunola, setShowContactsOnFunola ] = useState(true);
    const {
        otherUsers,
    } = useUserContext();

    const {
        banks,
        setBanks,
        setBanksLoading,
        banksLoaded,
        setBanksLoaded,
    } = useBanksContext();

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

        if (!banksLoaded) {
            const bankService = new BankServices();

            bankService.getBanksFOrUser()
            .then((res) => {
                setBanks(res?.data);

                setBanksLoading(false);
                setBanksLoaded(true);
            })
            .catch((err) => {
                const errorMsg = err.response ? err.response.data : err.message;
                showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your saved banks. Please refresh' : errorMsg, 'danger');
                setBanksLoading(false);
            })
        }

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
                            {
                                banks?.length < 0 ? <>
                                    <View>
                                        <Text style={sendFundStyles.noBankText}>You have not added any banks yet</Text>
                                    </View>
                                </> :
                                <>
                                    <FlatList 
                                        data={banks}
                                        renderItem={({ item }) => 
                                            <BankItem 
                                                item={item} 
                                                handlePress={(bank) => navigation.navigate('SelectAmountToSend')}
                                            />
                                        }
                                        keyExtractor={item => item._id}
                                    />
                                </>
                            }
                        </View>
                    </> :

                    <></>
                }
                
            </View>
        </SafeAreaView>
    </>
}

export default SendFundsScreen;