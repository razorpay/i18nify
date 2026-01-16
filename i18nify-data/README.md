# Country Attribute Data

**Note**: The word Attribute in this repository refers to any specific data related to countries. 

Example: CountryLanguages, CountryTeleInformation, CountryInformation, CountryCurrency, etc.

This repository acts as a Power Source of all geographical data, to any SDK that deals with country level data. The main features are:
- We maintain the country attribute data in JSON format, well organized by version
- We validate the Json Schema and Data for every pull request using of Github actions validation check.
- We provide standardised API's to access country attribute data across different programming languages, leveraging defined JSON schemas.
- We automate the data updation, ingestion from various sources and ensuring the ingested data is legitimate by enabling strict Pull Request review policies on the repository.

## Folder Structure

The folder structure for `i18nify-data` is as follows:

```
i18nify-data/
│
├── country/
│   ├── metadata/
│   │   ├── data.json
│   │   ├── schema.json         # JSON Schema (legacy)
│   │   └── proto/              # Proto schema (new)
│   │       └── country_metadata.proto
│   └── subdivisions/
│       ├── IN.json, MY.json, SG.json, US.json
│       └── proto/
│           └── country_subdivisions.proto
├── currency/
│   ├── data.json
│   └── schema.json
├── bankcodes/
│   ├── IN.json, MY.json, SG.json, US.json
│   └── schema.json
├── go/                         # Generated Go packages
│   ├── country/
│   │   └── subdivisions/
│   └── ...
└── ...
```

## Schema Definition

Packages can define their schema in two ways:

1. **JSON Schema** (`schema.json`) - Traditional JSON Schema for validation
2. **Protocol Buffers** (`proto/*.proto`) - Type definitions that can generate code for multiple languages

Packages with proto files will have Go packages auto-generated in the `go/` directory.

## Data Validation

Data files are validated against their schema on every pull request:
- Packages with `schema.json` are validated using JSON Schema (ajv)
- Packages with proto files are validated at compile time when generating language-specific packages

## Generated Packages

Go packages are auto-generated from proto definitions:

```go
import subdivisions "github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions"

data, err := subdivisions.GetCountrySubdivisions("IN")
```

## Contributing

We welcome contributions from the community! If you have any suggestions, improvements, or would like to report issues, please feel free to submit a Pull Request or open an issue.

For making a Contribution, Please go through the [Contribution Guidelines](contribution-guidelines.md)

## License

This project is licensed under the [MIT License](LICENSE).

Thank you for your interest in our Country Attribute Source Data Repository! 🌍📊
