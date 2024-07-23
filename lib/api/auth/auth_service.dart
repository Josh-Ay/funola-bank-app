import 'dart:developer' show log;
import 'package:dio/dio.dart';
import 'package:funola_bank_app/api/models/response_model.dart';

class AuthService {
  final Dio client;
  final String apiBaseUrl;

  static const authBasePath = 'auth';

  AuthService({
    required this.client,
    required this.apiBaseUrl,
  });

  Future<ResponseModel> sendVerificationCode(
    String number,
    String email,
  ) async {
    try {
      Response response = await client.post(
        '$apiBaseUrl/$authBasePath/code',
        data: {
          'number': number,
          'email': email,
        },
      );

      // log('hhh -> ${response.data}');

      return ResponseModel.fromJson(
        response.data,
        'Success',
        isSuccess: true,
      );
    } on DioException catch (e) {
      String errorMessage = e.response != null ? e.response!.data : e.message;
      log('Error sending verification code: $errorMessage');

      final responseData = ResponseModel.fromJson(
        {
          "statusCode": e.response?.statusCode ?? 500,
        },
        errorMessage,
      );
      return responseData;
    }
  }

  Future<ResponseModel> loginUser(
    String email,
    String password,
  ) async {
    try {
      Response response = await client.post(
        '$apiBaseUrl/$authBasePath/login',
        data: {
          'email': email,
          'password': password,
        },
      );

      // log('hhh -> ${response.data}');

      return ResponseModel.fromJson(
        {
          "statusCode": response.statusCode,
          "data": response.data,
        },
        response.data,
        isSuccess: true,
      );
    } on DioException catch (e) {
      String errorMessage = e.response != null ? e.response!.data : e.message;
      log('Error logging in: $errorMessage');

      final responseData = ResponseModel.fromJson(
        {
          "statusCode": e.response?.statusCode ?? 500,
        },
        errorMessage,
      );
      return responseData;
    }
  }
}
