# i18nify-data Contribution Guidelines

First off, thank you for contributing to i18nify-data! 🎉

Read this before adding or modifying anything in this data. These guidelines exist to help create and maintain packages better. Feel free to propose changes to this document.

## Before Contributing

Before contributing a new data or the modifications to the existing data, make sure the data source is either standard or the most reliable data source for the specific data.

## Contribution Guidelines:

Please follow the below guidelines for any contribution to the i18nify-data:

* Make sure the Data source is the most reliable source for the specific information like `ISO3166` for country information.
* For any updation of data, or addition of new data make a new version folder based on the [versioning guidelines](versioning-policy.md) and add the data along with scheme.
* For each version add a `Description.txt` file which gives a breief about the updatation and make sure to include the Data Source.
* Make sure to include both the scheme and Data files in each version.
* Make Sure to cross-check the `Data.json` follows the schema from the `schema.json` file.
* We run a validation script to validate the data with the schema for every PR.
