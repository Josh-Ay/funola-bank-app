import 'package:get/get.dart';

class UserController extends GetxController {
  RxMap currentUser = {}.obs;
  RxBool userDataLoaded = false.obs;
  RxBool userDataLoading = true.obs;
  RxList notifications = [].obs;
  RxList otherUsers = [].obs;
}
