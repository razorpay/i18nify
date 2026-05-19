# Country Subdivisions

| Field         | Value                                                                                                                                                                                                                                                                                                                                                                                                                                               |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Version       | 1.0.0                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Description   | Country subdivision data including states, cities, and zipcodes for India, Malaysia, Singapore & United States                                                                                                                                                                                                                                                                                                                                      |
| Author        | [Chaitanya-019](https://github.com/Chaitanya-019)                                                                                                                                                                                                                                                                                                                                                                                                   |
| Source        | GeoNames                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Schema        | Defined in `proto/country_subdivisions.proto`                                                                                                                                                                                                                                                                                                                                                                                                       |

## Structure

```
country/subdivisions/
├── IN.json                           # India data
├── MY.json                           # Malaysia data
├── SG.json                           # Singapore data
├── US.json                           # United States data
├── proto/
│   └── country_subdivisions.proto    # Schema definition
└── README.md
```

## Data Attributes

| Attribute | Description |
|-----------|-------------|
| `country_name` | Name of the Country |
| `states` | Map of state codes to state data |
| `states/{code}/name` | Name of the state |
| `states/{code}/cities` | Map of city names to city data |
| `states/{code}/cities/{name}/name` | Name of the city |
| `states/{code}/cities/{name}/timezone` | Timezone of the city |
| `states/{code}/cities/{name}/zipcodes` | List of available zipcodes in the city |
| `states/{code}/cities/{name}/region_name` | District/region in which the city is situated |

## Generated Packages

Go package is auto-generated at: `i18nify-data/go/country/subdivisions/`

```go
import subdivisions "github.com/razorpay/i18nify/i18nify-data/go/country/subdivisions"

data, err := subdivisions.GetCountrySubdivisions("IN")
```
