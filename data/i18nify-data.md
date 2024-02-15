# Country Attribute Source Data Repository

Welcome to the Country Attribute Source Data Repository! This repository is dedicated to maintaining version-based Country Attribute Data for SDKs. Our main objectives include:

- Maintaining version-based Country Attribute Data in JSON format.
- Validating the JSON data schema of each module using GitHub Actions on new Pull Requests.
- Standardizing the APIs for accessing the Country Attribute Data across languages by defining the JSON schema.
- Uploading each versioned Country Attribute Data Module to a CDN, enabling users to easily pull the data on demand without bundling data into SDKs and keeping lightweight SDKs.
- Automating the ingestion of data from various sources and ensuring the ingested data is legitimate by enabling strict Pull Request review policies on the repository.

## Folder Structure

The sample folder structure for the `i18nify-data` is as follows:
```
i18nify-data/
│
├── country/
│  └── version_1
│   └── data.json
│   └── schema.json
├── currency/
│  └── version_1
│   └── data.json
│   └── schema.json
├── ...
```

Each Country Attribute Folder (`country`, `currency`, etc.) maintains version based two JSON file (`data.json, schema.json`) that has attributes mapped to a country code.

## Contributing

We welcome contributions from the community! If you have any suggestions, improvements, or would like to report issues, please feel free to submit a Pull Request or open an issue.

## License

This project is licensed under the [MIT License](LICENSE).

Thank you for your interest in our Country Attribute Source Data Repository! 🌍📊
