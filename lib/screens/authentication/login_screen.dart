import 'dart:developer' show log;

import 'package:flutter/material.dart';
import 'package:funola_bank_app/api/models/response_model.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/controllers/registration_controller.dart';
import 'package:funola_bank_app/helper/helpers.dart';
import 'package:funola_bank_app/helper/locator.dart';
import 'package:funola_bank_app/repositories/auth_repository.dart';
import 'package:funola_bank_app/widgets/custom_button.dart';
import 'package:funola_bank_app/widgets/custom_input_widget.dart';
import 'package:funola_bank_app/widgets/page_title_widget.dart';
import 'package:get/get.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:loader_overlay/loader_overlay.dart';

class LoginScreen extends StatelessWidget {
  static String id = 'login_screen';

  LoginScreen({super.key});

  final _formKey = GlobalKey<FormState>();
  final RegistrationController registrationController = Get.find();
  final authRepository = getItLocator.get<AuthRepository>();

  _handleLogin(BuildContext contextPassed) async {
    final bool emailEnteredIsValid =
        validateEmailAddress(registrationController.email.value);
    if (emailEnteredIsValid == false) {
      Fluttertoast.showToast(
        msg: "Please enter a valid email address",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.CENTER,
        timeInSecForIosWeb: 1,
        backgroundColor: Colors.grey[600],
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    contextPassed.loaderOverlay.show();

    ResponseModel authRes = await authRepository.loginExistingUser(
      registrationController.email.value,
      registrationController.password.value,
    );

    contextPassed.loaderOverlay.hide();

    if (authRes.responseIsSuccessful == false) {
      Fluttertoast.showToast(
        msg: authRes.responseMessage,
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.CENTER,
        timeInSecForIosWeb: 2,
        backgroundColor: Colors.grey[600],
        textColor: Colors.white,
        fontSize: 16.0,
      );

      return;
    }

    log(authRes.responseMessage);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPaleBlue,
      body: SafeArea(
        child: SingleChildScrollView(
          child: ConstrainedBox(
            constraints: BoxConstraints(
              minHeight: MediaQuery.of(context).size.height * 0.96,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      mainAxisSize: MainAxisSize.max,
                      children: [
                        const PageTitleInfo(
                          title: 'Login',
                          subtitle: 'Enter your details',
                        ),
                        CustomInputWidget(
                          inputLabel: 'Enter your email',
                          inputTextValue: registrationController.email.value,
                          handleUpdateInputValue: (String val) {
                            registrationController.updateStringStateVal(
                              val,
                              kREmailStateKey,
                            );
                          },
                          isEmailInput: true,
                          showLabelText: true,
                          inputValueIsRequired: true,
                          hasNextInput: true,
                        ),
                        const SizedBox(
                          height: 20.0,
                        ),
                        CustomInputWidget(
                          inputLabel: 'Enter your password',
                          inputTextValue: registrationController.password.value,
                          handleUpdateInputValue: (String val) {
                            registrationController.updateStringStateVal(
                              val,
                              kRPasswordStateKey,
                            );
                          },
                          isSecureInput: true,
                          showLabelText: true,
                          inputValueIsRequired: true,
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(
                  width: double.infinity,
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: CustomButton(
                      text: 'Login',
                      backgroundColor: kBlue,
                      handlePress: () {
                        _formKey.currentState!.save();

                        if (_formKey.currentState!.validate()) {
                          _handleLogin(context);
                        }
                      },
                      textColor: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
