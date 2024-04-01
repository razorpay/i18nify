# Country Attribute Data

**Note**: The word Attribute in this repository refers to any specific data related to countries. 

Example: CountryLanguages, CountryTeleInformation, CountryInformation, CountryCurrency, etc.

This repository acts as a Power Source of all geographical data, to any SDK that deals with country level data. The main features are:
- We maintain the country attribute data in JSON format, well organized by version
- We validate the Json Schema and Data for every pull request using of Github actions validation check.
- We provide standardised API's to access country attribute data across different programming languages, leveraging defined JSON schemas.
- We automate the data updation, ingestion from various sources and ensuring the ingested data is legitimate by enabling strict Pull Request review policies on the repository.

## Folder Structure

The sample folder structure for the `i18nify-data` is as follows:
```
i18nify-data/
│
├── country/
│   └── Description.md
│   └── data.json
│   └── schema.json
├── currency/
│   └── Description.md
│   └── data.json
│   └── schema.json
├── ...
```

Each Country Attribute Folder (`country`, `currency`, etc.) maintains version based two JSON file (`data.json, schema.json`) that has attributes mapped to a country code along with a `Description.md` file that gives a brief about the Source and the descriptions of various fields..


**Sample Json files:**

**_Scheme.Json_:**
```
{
  "type": "object",
  "properties": {
    "country_information": {
      "type": "object",
      "patternProperties": {
        "^[A-Z]{2}$": {
          "type": "object",
          "properties": {
            "country_name": { "type": "string" },
            "country_code_3": { "type": "string" },
            "numeric_code": { "type": "string" },
            "sovereignty": { "type": "string" }
          },
          "required": ["country_name", "country_code_3", "numeric_code", "sovereignty"]
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["country_information"]
}
```

**_Data.Json:_**
```
{
  "country_information": {
    "AF": {
      "country_name": "Afghanistan",
      "country_code_3": "AFG",
      "numeric_code": "004",
      "sovereignty": "UN member state"
    },
    "AX": {
      "country_name": "Åland Islands",
      "country_code_3": "ALA",
      "numeric_code": "248",
      "sovereignty": "Finland"
    }
}
```

<br>
We validate data files to ensure they conform to the schema specified in the schema file for individual information. This ensures data integrity and consistency, maintaining high-quality country attribute data throughout the repository.

## Contributing

We welcome contributions from the community! If you have any suggestions, improvements, or would like to report issues, please feel free to submit a Pull Request or open an issue.


For making a Contribution, Please go through the [Contribution Guidelines](contribution-guidelines.md)

## License

This project is licensed under the [MIT License](LICENSE).

Thank you for your interest in our Country Attribute Source Data Repository! 🌍📊
