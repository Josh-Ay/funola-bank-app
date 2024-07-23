import 'package:get/get.dart';

class WalletController extends GetxController {
  RxList wallets = [].obs;
  RxList recents = [].obs;
  RxBool walletsLoaded = false.obs;
  RxBool walletsLoading = true.obs;
}
