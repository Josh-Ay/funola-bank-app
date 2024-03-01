import 'package:get/get.dart';
import 'dart:developer' show log;

const kRCountryStateKey = 'country';
const kRCountryFlagStateKey = 'countryFlag';
const kRCountrySearchValue = 'countrySearchValue';
const kRPhoneExtensionStateKey = 'phoneNumberExtension';
const kRPhoneNumberStateKey = 'phoneNumber';
const kREmailStateKey = 'email';
const kRFirstNameStateKey = 'firstName';
const kRLastNameStateKey = 'lastName';
const kRPasswordStateKey = 'password';
const kRDateOfBirthStateKey = 'dateOfBirth';
const kRGenderStateKey = 'gender';
const kRTitleStateKey = 'title';

Map<String, String> validStringStateUpdateOptions = {
  kRCountryStateKey: kRCountryStateKey,
  kRCountryFlagStateKey: kRCountryFlagStateKey,
  kRCountrySearchValue: kRCountrySearchValue,
  kRPhoneExtensionStateKey: kRPhoneExtensionStateKey,
  kRPhoneNumberStateKey: kRPhoneNumberStateKey,
  kREmailStateKey: kREmailStateKey,
  kRFirstNameStateKey: kRFirstNameStateKey,
  kRLastNameStateKey: kRLastNameStateKey,
  kRPasswordStateKey: kRPasswordStateKey,
  kRDateOfBirthStateKey: kRDateOfBirthStateKey,
  kRGenderStateKey: kRGenderStateKey,
  kRTitleStateKey: kRTitleStateKey,
};

class RegistrationController extends GetxController {
  RxString country = "".obs;
  RxString countryFlag = "".obs;
  RxString countrySearchValue = "".obs;
  RxString phoneNumberExtension = "".obs;
  RxString phoneNumber = "".obs;
  RxString email = "".obs;
  RxString firstName = "".obs;
  RxString lastName = "".obs;
  RxString password = "".obs;
  RxString dateOfBirth = "".obs;
  RxString gender = "".obs;
  RxString title = "".obs;

  void updateStringStateVal(String newValue, String stateToUpdate) {
    if (!validStringStateUpdateOptions.containsKey(stateToUpdate)) return;

    switch (stateToUpdate) {
      case kRCountryStateKey:
        country.value = newValue;
        break;
      case kRCountryFlagStateKey:
        countryFlag.value = newValue;
        break;
      case kRCountrySearchValue:
        countrySearchValue.value = newValue;
        break;
      case kRPhoneExtensionStateKey:
        phoneNumberExtension.value = newValue;
        break;
      case kRPhoneNumberStateKey:
        phoneNumber.value = newValue;
        break;
      case kREmailStateKey:
        email.value = newValue;
        break;
      case kRFirstNameStateKey:
        firstName.value = newValue;
        break;
      case kRLastNameStateKey:
        lastName.value = newValue;
        break;
      case kRPasswordStateKey:
        password.value = newValue;
        break;
      case kRDateOfBirthStateKey:
        dateOfBirth.value = newValue;
        break;
      case kRGenderStateKey:
        gender.value = newValue;
        break;
      case kRTitleStateKey:
        title.value = newValue;
        break;
      default:
        log('Action for $stateToUpdate not defined yet');
        break;
    }
  }
}
