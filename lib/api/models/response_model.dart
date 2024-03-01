class ResponseModel {
  int responseCode;
  String responseMessage;
  dynamic responseData;
  bool responseIsSuccessful;

  ResponseModel({
    required this.responseCode,
    required this.responseMessage,
    this.responseData,
    required this.responseIsSuccessful,
  });

  factory ResponseModel.fromJson(Map<String, dynamic> json, String message,
      {bool isSuccess = false}) {
    return ResponseModel(
      responseCode: json['statusCode'],
      responseData: json['data'],
      responseMessage: message,
      responseIsSuccessful: isSuccess,
    );
  }
}
