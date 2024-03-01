import 'dart:developer' show log;
import 'package:funola_bank_app/api/auth/services/auth_service.dart';
import 'package:funola_bank_app/api/utils.dart';
import 'package:funola_bank_app/repositories/auth_repository.dart';
import 'package:funola_bank_app/repositories/country_repository.dart';
import 'package:funola_bank_app/api/countries/services/country_service.dart';
import 'package:get_it/get_it.dart';
import 'package:funola_bank_app/api/countries/constants/countries.dart';
import 'package:dio/dio.dart';

final getItLocator = GetIt.instance;
final dioClient = Dio(
  BaseOptions(
    connectTimeout: const Duration(seconds: 20),
    receiveTimeout: const Duration(seconds: 45),
    extra: {
      'withCredentials': true,
    },
  ),
);

void setup() {
  log('Setting up get_it...');

  // registering the dio http client
  getItLocator.registerSingleton<Dio>(dioClient);

  // registering country service and repository
  getItLocator.registerSingleton<CountryService>(
    CountryService(
      client: getItLocator<Dio>(),
      apiUrl: kRestCountryAPIDomain,
    ),
  );
  getItLocator.registerSingleton<CountryRepository>(
    CountryRepository(
      countryService: getItLocator<CountryService>(),
    ),
  );

  // registering auth service and repository
  getItLocator.registerSingleton<AuthService>(
    AuthService(
      client: getItLocator<Dio>(),
      apiBaseUrl: kBaseApiUrl,
    ),
  );
  getItLocator.registerSingleton<AuthRepository>(
    AuthRepository(
      authService: getItLocator<AuthService>(),
    ),
  );
}
