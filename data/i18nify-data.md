# Country Attribute Source Data Repository

This repository is dedicated to maintaining version-based Country Attribute Data for SDKs. Our main objectives include:

- Continuous maintenance of country attribute data in JSON format, organized by version.
- Implementation of GitHub Actions to validate the JSON schema upon new Pull Requests for each module.
- Establishment of standardized APIs to access country attribute data across different programming languages, leveraging defined JSON schemas.
- Uploading each versioned Country Attribute Data Module to a CDN, enabling users to easily pull the data on demand without bundling data into SDKs and keeping lightweight SDKs.
- Automating the ingestion of data from various sources and ensuring the ingested data is legitimate by enabling strict Pull Request review policies on the repository.

## Folder Structure

The sample folder structure for the `i18nify-data` is as follows:
```
i18nify-data/
│
├── country/
│  └── version_1
│   └── Description.txt
│   └── data.json
│   └── schema.json
├── currency/
│  └── version_1
│   └── Description.txt
│   └── data.json
│   └── schema.json
├── ...
```

Each Country Attribute Folder (`country`, `currency`, etc.) maintains version based two JSON file (`data.json, schema.json`) that has attributes mapped to a country code along with a `Description.txt` file that gives a brief about the changes that was made in the newer version.


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

### Contribution Guidelines:

Thank you for contributing to the Country Attribute Source Data Repository. Before making any changes to the data or schema, please adhere to the following guidelines:

1) **Versioning Policy:**
   * When updating the schema of any country attribute, increment the version from 1.0 to 2.0.
   * When updating the data of any country attribute or adding new country information without altering the schema, increment the version from 1.0 to 1.1.
   * If both the schema and data need updates, use the version change pattern followed for schema changes (1.0 to 2.0).
2) **Description File:**
    * Provide a brief description of the changes made in the description.txt file for every version.
3) **Schema Updates:**
    * When adding a new field to the schema and making it required, add the field name to the array containing all required fields in `scheme.json`.
4) **Data and Schema Validation:**
    * Ensure that the data in the newer version aligns with the schema of the corresponding version.

Please adhere to these guidelines to maintain consistency and integrity within the repository. Your contributions are greatly appreciated!
## License

This project is licensed under the [MIT License](LICENSE).

Thank you for your interest in our Country Attribute Source Data Repository! 🌍📊
