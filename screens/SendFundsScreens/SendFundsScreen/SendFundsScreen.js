import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useWalletContext } from "../../../contexts/WalletContext";
import { WalletServices } from "../../../services/walletServices";
import NavigationTabFilterItem from "../../../components/NavigationTabFilterItem/NavigationTabFilterItem";
import { useToast } from "react-native-toast-notifications";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import ModalOverlay from "../../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";
import { appLayoutStyles } from "../../../layouts/AppLayout/styles";
import TextInputComponent from "../../../components/TextInputComponent/TextInputComponent";
import { validFunolaBankAccountTypes } from "../../../utils/utils";
import CustomButton from "../../../components/CustomButton/CustomButton";
import { fullSnapPoints } from "../../../layouts/AppLayout/utils";

const SendFundsScreen = ({ navigation, route }) => {
    const initialContactUpperLimit = 30;
    const initialNewBankDetail = {
        name: '',
        type: '',
        accountNumber: '',
    };

    const [ activeTab, setActiveTab ] = useState(SendFundTabs[0]?.action);
    const [ searchValue, setSearchValue ] = useState('');
    const [ statusGranted, setStatusGranted ] = useState(null);
    const [ contacts, setContacts ] = useState([]);
    const [ showContactsOnFunola, setShowContactsOnFunola ] = useState(true);
    const [ contactsUpperLimit, setContactsUpperLimit ] = useState(initialContactUpperLimit);
    const {
        otherUsers,
    } = useUserContext();
    const [ hasPermission, setHasPermission ] = useState(null);
    const [ scanned, setScanned ] = useState(false);
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ bankIsBeingAdded, setBankIsBeingAdded ] = useState(false);
    const [ newBankDetail, setNewBankDetail ] = useState(initialNewBankDetail);

    const sheetPanelRef = useRef();
    const {
        banks,
        setBanks,
        setBanksLoading,
        banksLoaded,
        setBanksLoaded,
    } = useBanksContext();

    const {
        recents,
        setRecents,
        recentsLoading,
        setRecentsLoading,
    } = useWalletContext();

    const [
        bankService,
        walletService,
    ] = [
        new BankServices(),
        new WalletServices(),
    ]

    const toast = useToast();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'info',
            placement: 'top'
        })
    }

    const requestContactAccess = async () => {
        const { status } = await Contacts.requestPermissionsAsync();

        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.RawImage, Contacts.Fields.Image],
            });

            return data
        }
    }

    const getBarCodeScannerPermissions = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    
    const handleUpdateNewBankDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewBankDetail((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
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

        setRecentsLoading(true);

        walletService.getRecents().then(res => {

            setRecents(res.data);
            setRecentsLoading(false);

        }).catch(err => {
            const errorMsg = err.response ? err.response.data : err.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to get your recents. Please refresh' : errorMsg, 'danger');
            setRecentsLoading(false);
        })

    }, []);

    useEffect(() => {
        if (activeTab === 'qr') {
            getBarCodeScannerPermissions()
        }
    }, [activeTab])


    const handleSelectContactFromSearch = (contact) => {
        setSearchValue(contact?.name);

        const userHasOneNumberOnFunola = otherUsers?.find(user => contact?.phoneNumbers?.find(number => user?.phoneNumber ===  number?.digits?.slice(-10)));
        if (userHasOneNumberOnFunola) return setShowContactsOnFunola(true);

        setShowContactsOnFunola(false);
    }

    const handleSelectContact = (numberPassed) => {
        const foundUserOnFunola = otherUsers?.find(user => user?.phoneNumber === numberPassed?.slice(-10));

        if (foundUserOnFunola) {
            // console.log('contact to send funds to: ', foundUserOnFunola);
            navigation.navigate(
                'SelectAmountToSend', 
                {
                    type: 'wallet',
                    receiverDetail: foundUserOnFunola,
                }
            )
            return
        }

        console.log('invite user to funola');
    }

    const handleSelectRecentItem = (recentItem) => {
        // console.log('recent item: ', recentItem);

        navigation.navigate(
            'SelectAmountToSend',
            {
                type: 'wallet',
                receiverDetail: recentItem,
                isRecent: true,
            }
        )
    }

    const handleSelectBankItem = (bank) => {
        // console.log('bank item: ', bank);

        navigation.navigate(
            'SelectAmountToSend',
            {
                type: 'bank',
                receiverDetail: bank,
            }
        )
    }

    const handleAddNewBank = async () => {
        if (
            newBankDetail.name.length < 1 || 
            newBankDetail.type.length < 1 || 
            newBankDetail.accountNumber.length < 1
        ) return

        if (newBankDetail.name.length < 3) return showToastMessage('Please make sure the name of your bank has at least 3 characters', 'info');
        if (newBankDetail.accountNumber.length !== 10) return showToastMessage('Please enter a 10 digit account number', 'info');

        setBankIsBeingAdded(true);

        try {
            const newBankRes = (await bankService.addNewBank(newBankDetail)).data;

            const copyOfBanks = banks?.slice();
            copyOfBanks.unshift(newBankRes);

            setBanks(copyOfBanks);
            setNewBankDetail(initialNewBankDetail);

            setBankIsBeingAdded(false);
            setSheetModalIsOpen(false);

            showToastMessage('Successfully added new payee!', 'success');

        } catch (error) {
            setBankIsBeingAdded(false);
            
            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to add your payee. Please try again later' : errorMsg, 'danger');
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        console.log(type);
        console.log(data);
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
            <ScrollView style={sendFundStyles.contentWrapper}>
                {
                    activeTab === 'mobile' ? <>
                        <View style={sendFundStyles.recentsWrapper}>
                            <Text style={sendFundStyles.itemContentTitle}>
                                Recent
                            </Text>
                            {
                                recentsLoading ? <>
                                    <Text style={sendFundStyles.contentText}>Fetching your recents...</Text>
                                </> :

                                recents.length < 1 ? <>
                                    <Text style={sendFundStyles.contentText}>Your recents will show up here</Text>
                                </> :

                                <FlatList 
                                    data={recents}
                                    renderItem={
                                        ({item}) => 
                                            <RecentItem
                                                item={item}
                                                handleSelectRecent={handleSelectRecentItem}
                                            />
                                    }
                                    keyExtractor={item => item._id}
                                    horizontal={true}
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={sendFundStyles.recentListingWrap}
                                />
                            }
                        </View>
                        <View style={sendFundStyles.contactWrapper}>
                            <Text style={sendFundStyles.contactHeadingTitle}>
                                All contacts
                            </Text>
                            {
                                statusGranted === 'yes' ?
                                <>
                                    <NavigationTabFilterItem 
                                        firstFilterItem={'On Funola'}
                                        firstFilterItemActive={showContactsOnFunola}
                                        handleFirstFilterItemClick={
                                            () => {
                                                setShowContactsOnFunola(true)
                                                setContactsUpperLimit(initialContactUpperLimit)
                                            }
                                        }
                                        secondFilterItem={'Not On Funola'}
                                        secondFilterItemActive={!showContactsOnFunola}
                                        handleSecondFilterItemClick={
                                            () => {
                                                setShowContactsOnFunola(false)
                                                setContactsUpperLimit(initialContactUpperLimit)
                                            }
                                        }
                                        style={sendFundStyles.contactTabFilter}
                                    />

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
                                    <View style={{ 
                                        height: contactsUpperLimit < 100 ? 
                                            contactsUpperLimit + 100 
                                            : 
                                            contactsUpperLimit < 200 ?
                                                contactsUpperLimit + 200 
                                            :
                                            contactsUpperLimit 
                                        }}
                                    >
                                        <FlashList
                                            data={
                                                showContactsOnFunola ?
                                                    contacts.filter(contact => {
                                                        if (searchValue.length < 1) return true
            
                                                        return contact?.name?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase()) || contact?.phoneNumbers?.find(number => number.digits.includes(searchValue))
                                                    })
                                                    .filter(
                                                        item => item?.phoneNumbers?.find(number => otherUsers?.find(user => user?.phoneNumber === number?.digits?.slice(-10)))
                                                    )
                                                    .slice(0, contactsUpperLimit)
                                                :
                                                contacts.filter(contact => {
                                                    if (searchValue.length < 1) return true
        
                                                    return contact?.name?.toLocaleLowerCase()?.includes(searchValue?.toLocaleLowerCase()) || contact?.phoneNumbers?.find(number => number.digits.includes(searchValue))
                                                })
                                                .slice(0, contactsUpperLimit)
                                            }
                                            renderItem={
                                                ({ item }) => 
                                                <ContactItem
                                                    item={item}
                                                    showOnlyContactsOnFunola={showContactsOnFunola}
                                                    handleSelectContact={handleSelectContact}
                                                />
                                            }
                                            estimatedItemSize={400}
                                            contentContainerStyle={sendFundStyles.contactListing}
                                            onEndReached={
                                                contactsUpperLimit < contacts.length ?
                                                    () => setContactsUpperLimit(contactsUpperLimit + 20)
                                                        :
                                                    () => {}
                                                }
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
                            
                        </View>
                    </> :

                    activeTab === 'bank' ? <>
                        <View style={sendFundStyles.payeeWrapper}>
                            <View style={sendFundStyles.payeeHeaderWrap}>
                                <Text style={sendFundStyles.itemContentTitle}>
                                    Payee List
                                </Text>
                                <TouchableOpacity onPress={() => setSheetModalIsOpen(true)}>
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
                                    {
                                        React.Children.toArray(banks.map(item => {
                                            return <BankItem 
                                                item={item} 
                                                handlePress={handleSelectBankItem}
                                            />
                                        }))
                                    }
                                </>
                            }
                        </View>
                    </> :

                    activeTab === 'nearby' ? <>
                    
                    </> :
                    
                    activeTab === 'qr' ? <>
                        <View style={sendFundStyles.qrWrapper}>
                            <Text style={sendFundStyles.itemContentTitle}>
                                Scan Payment Code
                            </Text>
                            {
                                hasPermission === null ? <>
                                    <Text style={sendFundStyles.contentText}>Requesting for camera permission...</Text>
                                </> :

                                hasPermission === false ? <>
                                    <Text style={sendFundStyles.contentText}>No access to camera</Text>
                                </> :
                                
                                <View style={sendFundStyles.scanWrapper}>
                                    <View style={sendFundStyles.leftTopSquareScan}></View>
                                    <View style={sendFundStyles.leftBottomSquareScan}></View>
                                    <View style={sendFundStyles.rightTopSquareScan}></View>
                                    <View style={sendFundStyles.rightBottomSquareScan}></View>

                                    <View style={sendFundStyles.qrContainer}>
                                        <BarCodeScanner
                                            onBarCodeScanned={
                                                scanned ? 
                                                    undefined 
                                                : 
                                                handleBarCodeScanned
                                            }
                                            style={StyleSheet.absoluteFillObject}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                    </> :
                    
                    <></>
                }
                
            </ScrollView>

            {/* ADD BANK SHEET MODAL */}
            {
                sheetModalIsOpen && 
                <ModalOverlay
                    handleClickOutside={() => setSheetModalIsOpen(false)}
                >
                    <BottomSheet
                        ref={sheetPanelRef}
                        snapPoints={
                            fullSnapPoints
                        }
                        style={appLayoutStyles.modalWrapper}
                        enablePanDownToClose={true}
                        onClose={() => setSheetModalIsOpen(false)}
                    >
                        <BottomSheetView style={appLayoutStyles.modalContainer}>
                            <View>
                                <Text style={appLayoutStyles.modalTitleText}>Add Payee</Text>
                                <View style={appLayoutStyles.modalInputItemWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>Bank Name</Text>
                                    <TextInputComponent 
                                        value={newBankDetail.name}
                                        name={'name'}
                                        handleInputChange={(name, val) => handleUpdateNewBankDetails(name, val)}
                                        placeholder={'Citibank'}
                                    />
                                </View>

                                <View style={appLayoutStyles.modalInputItemWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>Account Number</Text>
                                    <TextInputComponent 
                                        value={newBankDetail.accountNumber}
                                        name={'accountNumber'}
                                        handleInputChange={(name, val) => handleUpdateNewBankDetails(name, val)}
                                        placeholder={'0123456789'}
                                    />
                                </View>

                                <View style={appLayoutStyles.modalInputItemWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>Account Type</Text>
                                    <CustomDropdownItem
                                        hasDropdownItems={true}
                                        dropdownItems={validFunolaBankAccountTypes}
                                        extractKey={'type'}
                                        content={newBankDetail.type}
                                        handleItemSelect={(selectedVal) => handleUpdateNewBankDetails('type', selectedVal.type)}
                                        contentHasLoaded={true}
                                        style={appLayoutStyles.modalSelectItem}
                                        placeholderText={'Select account type'}
                                        dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                    />
                                </View>
                            </View>
                            <CustomButton 
                                buttonText={
                                    bankIsBeingAdded ? 'Please wait...'
                                    :
                                    'Add'
                                }
                                btnStyle={
                                    bankIsBeingAdded ?
                                        Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn)
                                    :
                                    appLayoutStyles.modalBtnStyle
                                }
                                textContentStyle={
                                    appLayoutStyles.modalBtnTextStyle
                                }
                                handleBtnPress={handleAddNewBank}
                                disabled={bankIsBeingAdded ? true : false}
                            />
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </SafeAreaView>
    </>
}

export default SendFundsScreen;