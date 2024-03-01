import 'package:flutter/material.dart';
import 'package:funola_bank_app/constants/utils.dart';
import 'package:lottie/lottie.dart' show Lottie;

class CustomOverlayLoader extends StatelessWidget {
  const CustomOverlayLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      width: double.infinity,
      height: double.infinity,
      child: Center(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Lottie.asset('assets/animations/loader-circless.json'),
            Text(
              'Please wait...',
              style: kPoppinsFont.copyWith(
                color: Colors.black,
                letterSpacing: 1.0,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
