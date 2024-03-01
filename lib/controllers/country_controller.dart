import 'dart:developer' show log;
import 'package:funola_bank_app/helper/locator.dart';
import 'package:funola_bank_app/models/country_model.dart';
import 'package:funola_bank_app/repositories/country_repository.dart';
import 'package:get/get.dart';

class CountryController extends GetxController {
  RxBool countriesLoaded = false.obs;
  RxBool countriesLoading = true.obs;
  RxList<CountryModel> countries = <CountryModel>[].obs;
  final countryRepository = getItLocator.get<CountryRepository>();

  @override
  void onInit() {
    log('Fetching all countries...');

    loadCountriesDataFromRepository();

    super.onInit();
  }

  Future<void> loadCountriesDataFromRepository() async {
    List<CountryModel> fetchedCountries =
        await countryRepository.getCountries();

    countries.value = fetchedCountries;
    countriesLoading.value = false;
    countriesLoaded.value = true;

    log('Successfully updated initial loading state for countries');
  }
}
