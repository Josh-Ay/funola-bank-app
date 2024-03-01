import 'package:funola_bank_app/api/countries/constants/countries.dart';
import 'package:funola_bank_app/models/country_model.dart';
import 'package:funola_bank_app/api/countries/services/country_service.dart';

class CountryRepository {
  final CountryService countryService;

  CountryRepository({
    required this.countryService,
  });

  Future<List<CountryModel>> getCountries() async {
    List countriesResponse = await countryService.getAllCountries(
      kGetAllCountriesPath,
    );

    List<CountryModel> countries = [];

    for (var country in countriesResponse) {
      countries.add(CountryModel.fromJson(
        country,
      ));
    }

    return countries;
  }
}
