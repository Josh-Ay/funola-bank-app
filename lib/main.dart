import 'package:flutter/material.dart';
import 'package:funola_bank_app/helper/init_controllers.dart';
import 'package:funola_bank_app/helper/locator.dart';
import 'package:funola_bank_app/screens/authentication/login_screen.dart';
import 'package:funola_bank_app/screens/authentication/registration_screen.dart';
import 'package:funola_bank_app/screens/home_screen.dart';
import 'package:funola_bank_app/screens/landing_screen.dart';
import 'package:funola_bank_app/widgets/overlay_loader.dart';
import 'package:get/get.dart' show GetMaterialApp;
import 'package:loader_overlay/loader_overlay.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  setup();
  await initControllers();

  runApp(const FunolaApp());
}

class FunolaApp extends StatelessWidget {
  const FunolaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GlobalLoaderOverlay(
      useDefaultLoading: false,
      overlayWidgetBuilder: (_) {
        return const CustomOverlayLoader();
      },
      child: GetMaterialApp(
        debugShowCheckedModeBanner: false,
        initialRoute: HomeScreen.id,
        routes: {
          LandingScreen.id: (context) => const LandingScreen(),
          RegistrationScreen.id: (context) => RegistrationScreen(),
          LoginScreen.id: (context) => LoginScreen(),
          HomeScreen.id: (context) => const HomeScreen(),
        },
      ),
    );
  }
}
