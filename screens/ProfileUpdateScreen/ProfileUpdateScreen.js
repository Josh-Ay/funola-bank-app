import { useToast } from "react-native-toast-notifications";
import { useUserContext } from "../../contexts/UserContext";
import { UserServices } from "../../services/userServices";
import React, { useEffect, useRef, useState } from "react";
import { Modal, SafeAreaView, Text, View } from "react-native";
import { profileStyles } from "../ProfileScreen/profileStyles";
import { AuthServices } from "../../services/authServices";
import { userProfileActions } from "../ProfileScreen/utils";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { colors } from "../../utils/colors";
import { profileUpdateStyles } from "./profileUpdateStyles";
import CustomButton from "../../components/CustomButton/CustomButton";
import { appLayoutStyles } from "../../layouts/AppLayout/styles";
import TextInputComponent from "../../components/TextInputComponent/TextInputComponent";
import CustomDropdownItem from "../../components/DropdownItemComponent/CustomDropdownItem";
import { validateEmail } from "../../utils/helpers";
import LoadingIndicator from "../../components/LoadingIndicator/LoadingIndicator";
import BankItem from "../SendFundsScreens/SendFundsScreen/components/BankItem/BankItem";
import { useBanksContext } from "../../contexts/BanksContext";
import { BankServices } from "../../services/bankServices";
import { validFunolaBankAccountTypes } from "../../utils/utils";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { fullSnapPoints } from "../../layouts/AppLayout/utils";
import { initialNewBankDetail } from "../SendFundsScreens/SendFundsScreen/SendFundsScreen";
import ModalOverlay from "../../layouts/AppLayout/components/ModalOverlay/ModalOverlay";

export const ProfileUpdateScreen = ({ navigation, setLoggedIn, route }) => {
    const {
        currentUser,
        setCurrentUser,
    } = useUserContext();
    const [ loading, setLoading ] = useState(false);
    const [ updateType, setUpdateType ] = useState(null);
    const toast = useToast();
    const [ copyOfCurrentUser, setCopyOfCurrentUser ] = useState(null);
    const [ logoutActionConfirmed, setLogoutActionConfirmed ] = useState(false);
    const [ showLogoutInfoModal, setShowLogoutInfoModal ] = useState(false);
    const [ previousPinStatusChecked, setPreviousPinStatusChecked ] = useState(false);
    const [ userHasPreviousPin, setUserHasPreviousPin ] = useState(false);
    const [ showBankEditView, setShowBankEditView ] = useState(false);
    const [ bankBeingEdited, setBankBeignEdited ] = useState(null);
    const [ sheetModalIsOpen, setSheetModalIsOpen ] = useState(false);
    const [ newBankDetail, setNewBankDetail ] = useState(initialNewBankDetail);

    const {
        banks,
        setBanks,
        banksLoaded,
        setBanksLoaded,
        setBanksLoading,
    } = useBanksContext();

    const [
        userService, 
        authService,
        bankService,
    ] = [
        new UserServices(),
        new AuthServices(),
        new BankServices(),
    ]

    const sheetPanelRef = useRef();

    const showToastMessage = (message, type) => {
        toast.show(message, {
            type: type ? type : 'normal',
            placement: 'top'
        })
    }

    const handleUpdateUserDetail = (keyToUpdate, newValue) => {
        setCopyOfCurrentUser((prevDetail) => {
            return {
                ...prevDetail,
                [keyToUpdate]: newValue,
            }
        })
    }

    const handleUpdateBankDetail = (keyToUpdate, newValue) => {
        setBankBeignEdited((prevDetail) => {
            return {
                ...prevDetail,
                [keyToUpdate]: newValue,
            }
        })
    }
    
    const handleUpdateNewBankDetails = (keyToUpdate, valueToUpdateTo) => {
        setNewBankDetail((prevDetails) => {
            return {
                ...prevDetails,
                [keyToUpdate]: valueToUpdateTo
            }
        })
    }

    const validateBankDetail = (bankDetail) => {
        if (
            bankDetail.name.length < 1 || 
            bankDetail.type.length < 1 || 
            bankDetail.accountNumber.length < 1
        ) return false

        if (bankDetail.name.length < 3) {
            showToastMessage('Please make sure the name of your bank has at least 3 characters', 'info');
            return false
        }
        if (bankDetail.accountNumber.length !== 10) {
            showToastMessage('Please enter a 10 digit account number', 'info');
            return false
        }

        return true;
    }

    useEffect(() => {
        const passedUpdateType = route?.params?.updateType;
        
        if (!passedUpdateType) {
            navigation.pop()
            return
        }

        setUpdateType(passedUpdateType);
        setCopyOfCurrentUser({...currentUser});

        if (passedUpdateType === userProfileActions.loginPinChange) {
            setPreviousPinStatusChecked(false);

            userService.checkLoginPinStatus().then(res => {
                setUserHasPreviousPin(true);
                setPreviousPinStatusChecked(true);
            }).catch(err => {
                if (err?.response?.status === 500) {
                    showToastMessage('An error occured while trying to verify your detail. Please check back later')
                    navigation.pop();

                    return;
                }

                setUserHasPreviousPin(false);
                setPreviousPinStatusChecked(true);
            })
        }

        if (passedUpdateType === userProfileActions.transactionPinChange) {
            setPreviousPinStatusChecked(false);

            userService.checkTransactionPinStatus().then(res => {
                setUserHasPreviousPin(true);
                setPreviousPinStatusChecked(true);
            }).catch(err => {
                if (err?.response?.status === 500) {
                    showToastMessage('An error occured while trying to verify your detail. Please check back later')
                    navigation.pop();

                    return;
                }

                setUserHasPreviousPin(false);
                setPreviousPinStatusChecked(true);
            })
        }
        
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

    }, [])

    const handleLogout = async () => {
        try {
            const res = (await authService.logoutUser()).data;
            showToastMessage(res, 'success');
            setLoggedIn(false);

        } catch (error) {
            // console.warn(error);
            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to log you out. Please try again' : errorMsg, 'danger')
        }
    }

    const makeAPICallToUpdateUserInformation = async (dataToPost, action, logoutOnSuccess=false, actionConfirmed=false) => {
        if (logoutOnSuccess && !actionConfirmed) {
            setShowLogoutInfoModal(true);
            return
        } 

        try {
            const res = (await userService.updateUserProfile(dataToPost, action)).data;
            showToastMessage(res, 'success');

            if (logoutOnSuccess) return await handleLogout();

            setLoading(false);

            delete copyOfCurrentUser?.previousPassword;
            delete copyOfCurrentUser?.newPassword;
            delete copyOfCurrentUser?.previousPin;
            delete copyOfCurrentUser?.loginPin;
            delete copyOfCurrentUser?.transactionPin;

            setCurrentUser(copyOfCurrentUser);

            navigation.pop();
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;

            setLoading(false);
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to update your profile. Please try again' : errorMsg, 'danger')
        }
    }

    const handleProfileUpdate = async (bypassInitialCheck=false) => {
        if ((!updateType || loading) && bypassInitialCheck === false) return

        switch (updateType) {
            case userProfileActions.nameChange:
                if (copyOfCurrentUser.firstName.length < 2) return showToastMessage('First name should have at least 2 characters');
                if (copyOfCurrentUser.lastName.length < 2) return showToastMessage('Last name should have at least 2 characters');

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ firstName: copyOfCurrentUser.firstName, lastName: copyOfCurrentUser.lastName }, updateType);

                break;
            case userProfileActions.phoneChange:
                if (isNaN(Number(copyOfCurrentUser.phoneNumber))) return showToastMessage('Please enter a valid phone number');
                if (copyOfCurrentUser?.phoneNumber?.length < 10) return showToastMessage('Your phone number must have at least 10 digits');
                if (copyOfCurrentUser?.phoneNumber?.length > 11) return showToastMessage('Your phone number must not have more than 11 digits');

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ phoneNumber: copyOfCurrentUser.phoneNumber }, updateType);

                break;
            case userProfileActions.emailChange:
                if (!validateEmail(copyOfCurrentUser.email)) return showToastMessage('Please enter a valid email');
                if (copyOfCurrentUser.email === currentUser.email) {
                    navigation.pop();
                    return;
                }

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ email: copyOfCurrentUser?.email }, updateType, true, bypassInitialCheck);

                break;
            case userProfileActions.passwordChange:
                if (!copyOfCurrentUser?.previousPassword || !copyOfCurrentUser.newPassword) return;
                if (copyOfCurrentUser?.previousPassword?.length < 6) return showToastMessage('Your previous password must have at least 6 characters');
                if (copyOfCurrentUser?.newPassword?.length < 6) return showToastMessage('Your new password must have at least 6 characters');

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ previousPassword: copyOfCurrentUser?.previousPassword, newPassword: copyOfCurrentUser?.newPassword }, updateType);

                break;
            case userProfileActions.loginPinChange:
                if (userHasPreviousPin && !copyOfCurrentUser?.previousPin) return
                if (!copyOfCurrentUser?.loginPin) return
                if (userHasPreviousPin && copyOfCurrentUser?.previousPin?.length < 6) return showToastMessage('Your previous pin must have at least 6 characters');
                if (copyOfCurrentUser?.loginPin?.length < 6) return showToastMessage('Your new pin must have at least 6 characters');

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ previousPin: copyOfCurrentUser?.previousPin, loginPin: copyOfCurrentUser?.loginPin }, updateType);
                
                break;
            case userProfileActions.transactionPinChange:
                if (userHasPreviousPin && !copyOfCurrentUser?.previousPin) return
                if (!copyOfCurrentUser?.transactionPin) return
                if (userHasPreviousPin && copyOfCurrentUser?.previousPin?.length < 6) return showToastMessage('Your previous pin must have at least 6 characters');
                if (copyOfCurrentUser?.transactionPin?.length < 6) return showToastMessage('Your new pin must have at least 6 characters');

                setLoading(true);

                await makeAPICallToUpdateUserInformation({ previousPin: copyOfCurrentUser?.previousPin, transactionPin: copyOfCurrentUser?.transactionPin }, 'pin');
                
                break;
            case userProfileActions.viewBanks:
                const bankDetailIsValid = validateBankDetail(bankBeingEdited);
                if (!bankDetailIsValid) return

                setLoading(true);

                try {
                    const { name, accountNumber, type } = bankBeingEdited;

                    const updatedBank = (await bankService.updateBankDetail(bankBeingEdited?._id, { name, accountNumber, type })).data;
                    
                    const copyOfBanks = banks?.slice();
                    const foundUpdatedBankIndex = copyOfBanks?.findIndex(bank => bank._id === bankBeingEdited?._id);
                    
                    if (foundUpdatedBankIndex !== -1) {
                        copyOfBanks[foundUpdatedBankIndex] = updatedBank;
                        setBanks(copyOfBanks);
                    }

                    setBankBeignEdited(null);
                    setShowBankEditView(false);
                    setLoading(false);

                    showToastMessage('Successfully updated bank detail!', 'success');

                } catch (error) {
                    const errorMsg = error.response ? error.response.data : error.message;
        
                    setLoading(false);
                    showToastMessage(errorMsg?.toLocaleLowerCase()?.includes('html') ? 'Something went wrong trying to update your bank. Please try again' : errorMsg, 'danger')
                }

                break;
            default:
                console.log(`'${updateType}' case not implemented yet`);
                break;
        }
    }

    const handleAddNewBank = async () => {
        const bankDetailIsValid = validateBankDetail(newBankDetail);
        if (!bankDetailIsValid) return

        setLoading(true);

        try {
            const newBankRes = (await bankService.addNewBank(newBankDetail)).data;

            const copyOfBanks = banks?.slice();
            copyOfBanks.unshift(newBankRes);

            setBanks(copyOfBanks);
            setNewBankDetail(initialNewBankDetail);

            setLoading(false);
            setSheetModalIsOpen(false);

            showToastMessage('Successfully added new payee!', 'success');

        } catch (error) {
            setLoading(false);
            
            const errorMsg = error.response ? error.response.data : error.message;
            showToastMessage(errorMsg.toLocaleLowerCase().includes('html') ? 'Something went wrong trying to add your payee. Please try again later' : errorMsg, 'danger');
        }
    }

    const handleDeleteBank = async () => {
        if (loading) return

        setLoading(true);

        try {
            const res = (await bankService.deletebankDetail(bankBeingEdited?._id)).data;
                    
            const copyOfBanks = banks?.slice();
            setBanks(copyOfBanks?.filter(item => item._id !== bankBeingEdited?._id));

            setBankBeignEdited(null);
            setShowBankEditView(false);
            setLoading(false);

            showToastMessage(res, 'success');

        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;

            setLoading(false);
            showToastMessage(errorMsg?.toLocaleLowerCase()?.includes('html') ? 'Something went wrong trying to delete your bank. Please try again' : errorMsg, 'danger')
        }
    }

    return <>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.paleBlue }}>
            <View style={profileStyles.topContentWrapper}>
                <TouchableOpacity 
                    onPress={
                        showBankEditView ? () => {
                            setBankBeignEdited(null);
                            setShowBankEditView(false);
                        }
                        :
                        () => navigation.pop()
                    }
                >
                    <Ionicons name="chevron-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <View style={profileUpdateStyles.topContent}>
                    <Text style={profileUpdateStyles.titleText}>
                        {
                            updateType === userProfileActions.viewBanks ? 
                                showBankEditView ?
                                 'Edit '
                                :
                            'Your '
                            :
                            'Update '
                        }
                        {
                            updateType === userProfileActions.viewBanks ? 
                                showBankEditView ? 
                                    'bank'
                                :
                                'banks' 
                            : 
                            updateType?.replaceAll('-', ' ')
                        }
                    </Text>
                    <Text style={profileUpdateStyles.subtitleText}>Update your profile information on Funola</Text>    
                </View>
            </View>
            <View style={profileStyles.contentWrapper}>
                
                {
                    updateType === userProfileActions.nameChange ? <>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={profileUpdateStyles.poppinsText}>First Name</Text>
                            <TextInputComponent 
                                name={'firstName'}
                                value={copyOfCurrentUser?.firstName}
                                handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                isEditable={!loading}
                            />
                        </View>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={appLayoutStyles.modalInputHeaderText}>Last Name</Text>
                            <TextInputComponent 
                                name={'lastName'}
                                value={copyOfCurrentUser?.lastName}
                                handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                isEditable={!loading}
                            />
                        </View>                
                    </> 
                    : 
                    updateType === userProfileActions.phoneChange ? <>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={appLayoutStyles.modalInputHeaderText}>Phone Number</Text>

                            <View style={profileUpdateStyles.phoneInputWrapper}>
                                <CustomDropdownItem
                                    content={copyOfCurrentUser?.phoneNumberExtension}
                                    style={profileUpdateStyles.dropdownStyle}
                                    hideIcon={true}
                                />
                                <View style={profileUpdateStyles.verticalLine}></View>
                                <TextInputComponent
                                    placeholder="123456789"
                                    name={'phoneNumber'}
                                    value={copyOfCurrentUser?.phoneNumber}
                                    handleInputChange={handleUpdateUserDetail}
                                    isEditable={!loading}
                                    isNumericInput={true}
                                    style={profileUpdateStyles.phoneInput}
                                />
                            </View>
                        </View>
                    
                    </>
                    :
                    updateType === userProfileActions.emailChange ? <>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={profileUpdateStyles.poppinsText}>Email</Text>
                            <TextInputComponent 
                                name={'email'}
                                value={copyOfCurrentUser?.email}
                                handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                isEditable={!loading}
                                isEmailInput={true}
                            />
                        </View>
                    </>
                    :
                    updateType === userProfileActions.passwordChange ? <>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={profileUpdateStyles.poppinsText}>Current Password</Text>
                            <TextInputComponent 
                                name={'previousPassword'}
                                value={copyOfCurrentUser?.previousPassword}
                                handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                isEditable={!loading}
                                isSecure={true}
                            />
                        </View>
                        <View style={profileUpdateStyles.inputWrapper}>
                            <Text style={appLayoutStyles.modalInputHeaderText}>New Password</Text>
                            <TextInputComponent 
                                name={'newPassword'}
                                value={copyOfCurrentUser?.newPassword}
                                handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                isEditable={!loading}
                                isSecure={true}
                            />
                        </View>                
                    </> 
                    :
                    (updateType === userProfileActions.loginPinChange || updateType === userProfileActions.transactionPinChange) ? <>
                        {
                            !previousPinStatusChecked ? 
                                <LoadingIndicator 
                                    loadingContent={'Please wait...'}
                                /> 
                            : 
                            <>
                                {
                                    userHasPreviousPin && 
                                    <View style={profileUpdateStyles.inputWrapper}>
                                        <Text style={appLayoutStyles.modalInputHeaderText}>Previous Pin</Text>
                                        <TextInputComponent 
                                            name={'previousPin'}
                                            value={copyOfCurrentUser?.previousPin}
                                            handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                            isEditable={!loading}
                                            isNumericInput={true}
                                        />
                                    </View>
                                }

                                <View style={profileUpdateStyles.inputWrapper}>
                                    <Text style={appLayoutStyles.modalInputHeaderText}>New Pin</Text>
                                    <TextInputComponent 
                                        name={updateType === userProfileActions.loginPinChange ? 'loginPin' : 'transactionPin'}
                                        value={copyOfCurrentUser[`${updateType === userProfileActions.loginPinChange ? 'loginPin' : 'transactionPin'}`]}
                                        handleInputChange={(name, value) => handleUpdateUserDetail(name, value)}
                                        isEditable={!loading}
                                        isNumericInput={true}
                                    />
                                </View>
                            </>
                        }
                    </>
                    :
                    updateType === userProfileActions.viewBanks ? <>
                        {
                            !banksLoaded ? <LoadingIndicator loadingContent={'Fetching banks...'} />
                            :
                            banks?.length < 1 ? <>
                                <Text style={{...profileUpdateStyles.poppinsText, ...profileUpdateStyles.noBankText }}>You have not added any banks</Text> 
                                <TouchableOpacity
                                    style={{...profileUpdateStyles.addBankBtn}}
                                    onPress={() => setSheetModalIsOpen(true)}
                                >
                                    <Text style={{...profileUpdateStyles.poppinsText, ...profileUpdateStyles.proceedBtnText}}>
                                        Add
                                    </Text>
                                </TouchableOpacity>
                            </>
                            :
                            <>
                                {
                                    showBankEditView ? <>
                                        <View style={profileUpdateStyles.inputWrapper}>
                                            <Text style={appLayoutStyles.modalInputHeaderText}>Bank Name</Text>
                                            <TextInputComponent 
                                                name={bankBeingEdited?.name}
                                                value={bankBeingEdited?.name}
                                                handleInputChange={(name, value) => handleUpdateBankDetail(name, value)}
                                                isEditable={!loading}
                                            />
                                        </View>
                                        <View style={profileUpdateStyles.inputWrapper}>
                                            <Text style={appLayoutStyles.modalInputHeaderText}>Bank Number</Text>
                                            <TextInputComponent 
                                                name={bankBeingEdited?.accountNumber}
                                                value={bankBeingEdited?.accountNumber}
                                                handleInputChange={(name, value) => handleUpdateBankDetail(name, value)}
                                                isEditable={!loading}
                                                isNumericInput={true}
                                            />
                                        </View>
                                        <View style={profileUpdateStyles.inputWrapper}>
                                            <Text style={appLayoutStyles.modalInputHeaderText}>Account Type</Text>
                                            <CustomDropdownItem
                                                hasDropdownItems={true}
                                                dropdownItems={validFunolaBankAccountTypes}
                                                extractKey={'type'}
                                                content={bankBeingEdited?.type}
                                                handleItemSelect={(selectedVal) => handleUpdateBankDetail('type', selectedVal.type)}
                                                contentHasLoaded={true}
                                                style={appLayoutStyles.modalSelectItem}
                                                placeholderText={'Select account type'}
                                                dropdownIconStyle={appLayoutStyles.modalSelectDropIcon}
                                            />
                                        </View>
                                    </> 
                                    :
                                    <>
                                    {
                                        React.Children.toArray(banks.map(item => {
                                            return <BankItem
                                                item={item} 
                                                handlePress={
                                                    () => {
                                                        setShowBankEditView(true);
                                                        setBankBeignEdited(item);
                                                    }
                                                }
                                            />
                                        }))
                                    }
                                    </>
                                }
                            </>
                        }
                    </>
                    : 
                    <></>
                }

                
                {
                    (showBankEditView || updateType !== userProfileActions.viewBanks) &&
                    <CustomButton
                        buttonText={
                            loading ? 'Please wait...'
                            :
                            'Update'
                        }
                        btnStyle={
                            loading ?
                                Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn, profileUpdateStyles.actionBtn)
                            :
                            {...appLayoutStyles.modalBtnStyle, ...profileUpdateStyles.actionBtn}
                        }
                        textContentStyle={
                            appLayoutStyles.modalBtnTextStyle
                        }
                        handleBtnPress={() => handleProfileUpdate()}
                        disabled={
                            loading ? 
                                true 
                            : 
                            (updateType === userProfileActions.loginPinChange || updateType === userProfileActions.transactionPinChange) && !previousPinStatusChecked ?
                                true
                            :
                            false
                        }
                    />
                }

                {
                    showBankEditView &&
                    <CustomButton
                        buttonText={
                            loading ? 'Please wait...'
                            :
                            'Delete'
                        }
                        btnStyle={
                            loading ?
                                Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn, profileUpdateStyles.redBtn)
                            :
                            {
                                ...appLayoutStyles.modalBtnStyle, 
                                ...profileUpdateStyles.redBtn 
                            }
                        }
                        textContentStyle={
                            appLayoutStyles.modalBtnTextStyle
                        }
                        handleBtnPress={() => handleDeleteBank()}
                        disabled={
                            loading ? 
                                true 
                            :
                            false
                        }
                    />
                }
            </View>

            {
                showLogoutInfoModal && <>
                    <Modal
                        transparent={true}
                    >
                        <View style={profileUpdateStyles.confirmModalWrap}>
                            <View style={profileUpdateStyles.confirmModal}>
                                <TouchableOpacity
                                    onPress={
                                        // loading && logoutActionConfirmed ? () => {} 
                                        // :
                                        () => {
                                            setShowLogoutInfoModal(false);
                                            setLoading(false);
                                        }
                                    }
                                >
                                    <Ionicons 
                                        name="close" 
                                        size={24} 
                                        color="black" 
                                        style={{ textAlign: 'right' }}
                                    />
                                </TouchableOpacity>
                                <Text style={profileUpdateStyles.modalTitle}>Please note</Text>
                                <Text style={{...profileUpdateStyles.poppinsText, ...profileUpdateStyles.modalText}}>This action will log you out and require you to re-login</Text>

                                <View style={profileUpdateStyles.confirmModalActions}>
                                    <TouchableOpacity 
                                        style={profileUpdateStyles.cancelBtn}
                                        onPress={
                                            loading && logoutActionConfirmed ? () => {} 
                                            :
                                            () => {
                                                setShowLogoutInfoModal(false);
                                                setLoading(false);
                                            }
                                        }
                                    >
                                        <Text style={{...profileUpdateStyles.poppinsText, ...profileUpdateStyles.cancelBtnText}}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={profileUpdateStyles.proceedBtn}
                                        onPress={
                                            loading && logoutActionConfirmed ? () => {} 
                                            :
                                            () => {
                                                setLogoutActionConfirmed(true);
                                                handleProfileUpdate(true);
                                            }
                                        }
                                    >
                                        <Text style={{...profileUpdateStyles.poppinsText, ...profileUpdateStyles.proceedBtnText}}>
                                            {
                                                loading && logoutActionConfirmed ?
                                                    <LoadingIndicator removeTextContent={true} spinnerColor={colors.white} />
                                                :
                                                'Proceed'
                                            }
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </>
            }

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
                                    loading ? 'Please wait...'
                                    :
                                    'Add'
                                }
                                btnStyle={
                                    loading ?
                                        Object.assign({}, appLayoutStyles.modalBtnStyle, appLayoutStyles.disabledModalBtn)
                                    :
                                    appLayoutStyles.modalBtnStyle
                                }
                                textContentStyle={
                                    appLayoutStyles.modalBtnTextStyle
                                }
                                handleBtnPress={handleAddNewBank}
                                disabled={loading ? true : false}
                            />
                        </BottomSheetView>
                    </BottomSheet>
                </ModalOverlay>
            }
        </SafeAreaView>
    </>
}