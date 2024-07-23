import 'dart:developer' show log;

import 'package:funola_bank_app/controllers/registration_controller.dart';
import 'package:funola_bank_app/controllers/country_controller.dart';
import 'package:get/get.dart';

Future<void> initControllers() async {
  log('Initializing all controllers...');

  Get.lazyPut(() => CountryController());
  Get.lazyPut(() => RegistrationController());
}
