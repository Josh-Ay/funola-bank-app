import 'dart:developer' show log;
import 'package:flutter/material.dart';
import 'package:funola_bank_app/api/models/response_model.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/controllers/registration_controller.dart';
import 'package:funola_bank_app/controllers/country_controller.dart';
import 'package:funola_bank_app/helper/helpers.dart';
import 'package:funola_bank_app/helper/locator.dart';
import 'package:funola_bank_app/models/country_model.dart';
import 'package:funola_bank_app/repositories/auth_repository.dart';
import 'package:funola_bank_app/widgets/custom_button.dart';
import 'package:funola_bank_app/widgets/custom_input_widget.dart';
import 'package:funola_bank_app/widgets/dropdown_with_input_widget.dart';
import 'package:funola_bank_app/widgets/loader_with_text.dart';
import 'package:funola_bank_app/widgets/page_title_widget.dart';
import 'package:get/get.dart';
import 'package:loader_overlay/loader_overlay.dart';
import 'package:url_launcher/url_launcher.dart' show launchUrl;

class RegistrationScreen extends StatelessWidget {
  static String id = 'registration_screen';

  RegistrationScreen({super.key});

  final CountryController countryController = Get.find();
  final RegistrationController registrationController = Get.find();

  final authRepository = getItLocator.get<AuthRepository>();

  final _formKey = GlobalKey<FormState>();

  Future<void> handleOpenPrivacyPolicy() async {
    Uri url = Uri.parse(kAppPolicyLink);

    if (!await launchUrl(url)) {
      log('Could not launch $url');
    }
  }

  Future _handleSendVerificationCode(BuildContext contextPassed) async {
    final bool emailEnteredIsValid = validateEmailAddress(
      registrationController.email.value,
    );

    if (emailEnteredIsValid == false) {
      showToastMessage(message: "Please enter a valid email address");
      return;
    }

    contextPassed.loaderOverlay.show();

    ResponseModel verificationResponse =
        await authRepository.sendVerificationCode(
      registrationController.phoneNumber.value,
      registrationController.email.value,
    );

    // ignore: use_build_context_synchronously
    contextPassed.loaderOverlay.hide();

    if (!verificationResponse.responseIsSuccessful) {
      showToastMessage(
        message: verificationResponse.responseMessage,
        backgroundColor: kRed,
      );

      return;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPaleBlue,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Padding(
            padding: const EdgeInsets.symmetric(
              vertical: 12.0,
              horizontal: 20.0,
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Column(
                    children: [
                      const PageTitleInfo(
                        title: 'Registration',
                        subtitle:
                            'Enter your mobile number and email, we will send you OTP to verify',
                      ),
                      Obx(() {
                        if (countryController.countriesLoading.value == true) {
                          return const LoaderWithText(
                            loaderText: 'Please wait...',
                          );
                        }

                        return Column(
                          children: [
                            DropdownWithInputWidget(
                              dropdownItems: countryController.countries.value,
                              dropdownValue:
                                  registrationController.countryFlag.value,
                              dropdownValueIsImageStr: true,
                              inputLabel: 'Enter your location',
                              inputTextValue:
                                  registrationController.country.value,
                              inputIsReadOnly: true,
                              dropDownHintText: 'Search country',
                              handleSelectItemFromDropdown:
                                  (var selectedCountry) {
                                try {
                                  CountryModel country = CountryModel.fromJson(
                                    selectedCountry,
                                  );

                                  registrationController.updateStringStateVal(
                                    country.name['common'],
                                    kRCountryStateKey,
                                  );
                                  registrationController.updateStringStateVal(
                                    country.flags['png'],
                                    kRCountryFlagStateKey,
                                  );
                                  registrationController.updateStringStateVal(
                                    '${country.idd['root']}${country.idd['suffixes'] != null && country.idd['suffixes'][0] != null ? country.idd['suffixes'][0] : ''}',
                                    kRPhoneExtensionStateKey,
                                  );
                                } catch (e) {
                                  log('Error parsing country selected');
                                }
                              },
                              dropdownValueIsRequired: true,
                            ),
                            const SizedBox(
                              height: 20.0,
                            ),
                            DropdownWithInputWidget(
                              dropdownItems: const [],
                              dropdownValue: registrationController
                                  .phoneNumberExtension.value,
                              inputLabel: 'Enter your phone',
                              inputTextValue:
                                  registrationController.phoneNumber.value,
                              inputIsReadOnly: registrationController
                                      .phoneNumberExtension.value.isEmpty
                                  ? true
                                  : false,
                              handleUpdateInputValue: (String val) {
                                registrationController.updateStringStateVal(
                                  val,
                                  kRPhoneNumberStateKey,
                                );
                              },
                              dropdownValueIsRequired: true,
                              maxInputLength: 11,
                              isPhoneInput: true,
                              hasNextFocusableInput: true,
                            ),
                            const SizedBox(
                              height: 20.0,
                            ),
                            CustomInputWidget(
                              inputLabel: 'Enter your email',
                              inputTextValue:
                                  registrationController.email.value,
                              handleUpdateInputValue: (String val) {
                                registrationController.updateStringStateVal(
                                  val,
                                  kREmailStateKey,
                                );
                              },
                              isEmailInput: true,
                              showLabelText: true,
                              inputValueIsRequired: true,
                            ),
                          ],
                        );
                      })
                    ],
                  ),
                  const SizedBox(
                    height: 50.0,
                  ),
                  Obx(() {
                    if (countryController.countriesLoading.value == true) {
                      return const SizedBox.shrink();
                    }

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        CustomButton(
                          text: 'Start Using',
                          backgroundColor: kBlue,
                          handlePress: () {
                            _formKey.currentState!.save();

                            if (_formKey.currentState!.validate()) {
                              _handleSendVerificationCode(context);
                            }
                          },
                          textColor: Colors.white,
                        ),
                        const SizedBox(
                          height: 18.0,
                        ),
                        Center(
                          child: Text(
                            'By clicking start, you agree to our',
                            style: kPoppinsFont.copyWith(
                              fontSize: 11.0,
                            ),
                          ),
                        ),
                        CustomButton(
                          text: 'Privacy Policy and terms',
                          textColor: kBlue,
                          backgroundColor: kPaleBlue,
                          elevation: 0.0,
                          focusElevation: 0.0,
                          highlightElevation: 0.0,
                          handlePress: handleOpenPrivacyPolicy,
                          fontSize: 11.0,
                          fontWeight: FontWeight.w400,
                          textDecoration: TextDecoration.underline,
                          padding: const EdgeInsets.all(0.0),
                        ),
                      ],
                    );
                  }),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
