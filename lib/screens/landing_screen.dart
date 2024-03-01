import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/colors.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:funola_bank_app/screens/authentication/login_screen.dart';
import 'package:funola_bank_app/screens/authentication/registration_screen.dart';
import 'package:funola_bank_app/widgets/custom_button.dart';
import 'package:get/get.dart';

class LandingScreen extends StatelessWidget {
  static String id = 'landing_screen';

  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: kPaleBlue,
      body: Padding(
        padding: const EdgeInsets.only(
          left: 20.0,
          right: 20.0,
          top: 20.0,
          bottom: 12.0,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: SizedBox(
                child: Column(
                  children: [
                    Image.asset(
                      'assets/images/welcome-illustration.png',
                    ),
                    Text(
                      "Let's get started",
                      style: kPoppinsFont.copyWith(
                        fontWeight: FontWeight.w600,
                        fontSize: 26.0,
                      ),
                    ),
                    const SizedBox(
                      height: 10.0,
                    ),
                    FractionallySizedBox(
                      widthFactor: 0.7,
                      child: Text(
                        "Never a better time than now to start thinking on how you manage all your finances with ease.",
                        style: kPoppinsFont.copyWith(
                          fontWeight: FontWeight.w500,
                          color: kGrey,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                CustomButton(
                  text: 'Create Account',
                  textColor: Colors.white,
                  backgroundColor: kBlue,
                  handlePress: () {
                    Get.toNamed(RegistrationScreen.id);
                  },
                ),
                const SizedBox(
                  height: 5.0,
                ),
                CustomButton(
                  text: 'Login to Account',
                  textColor: kBlue,
                  backgroundColor: kPaleBlue,
                  handlePress: () {
                    Get.toNamed(LoginScreen.id);
                  },
                  elevation: 0.0,
                  focusElevation: 0.0,
                  highlightElevation: 0.0,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
