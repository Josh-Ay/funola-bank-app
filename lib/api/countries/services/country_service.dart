import 'dart:developer' show log;
import 'package:dio/dio.dart';

class CountryService {
  final Dio client;
  final String apiUrl;

  CountryService({
    required this.client,
    required this.apiUrl,
  });

  Future<List> getAllCountries(String pathname) async {
    List emptyCountries = [];

    try {
      Response response = await client.get('$apiUrl/$pathname');
      log('Gotten all countries from API with response status code: ${response.statusCode}');

      if (response.statusCode != 200) return emptyCountries;
      List<dynamic> countries = response.data;

      try {
        countries.sort(
          (a, b) => a['name']['common'].compareTo(b['name']['common']),
        );
        return countries;
      } catch (e) {
        log('Error sorting countries by name: $e');
        return countries;
      }
    } on DioException catch (e) {
      if (e.response != null) {
        log('Error getting countries: ${e.response!.data}');
      } else {
        log('Error getting countries: ${e.message}');
      }

      return emptyCountries;
    }
  }
}
