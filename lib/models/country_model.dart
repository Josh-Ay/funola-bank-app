class CountryModel {
  Map name;
  Map idd;
  Map flags;

  CountryModel({
    required this.name,
    required this.idd,
    required this.flags,
  });

  factory CountryModel.fromJson(Map<String, dynamic> json) {
    return CountryModel(
      name: json['name'],
      idd: json['idd'],
      flags: json['flags'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      "name": name,
      "idd": idd,
      "flags": flags,
    };
  }
}
