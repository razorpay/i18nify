# i18nify-go
_A one-stop solution built in golang to provide internationalization support._

# Go SDK:

Convert json to json schema
1. quicktype data/<attribute>_v1.json -l schema -o data/schema/<attribute>_schema.json


2. quicktype -s schema data/schema/<attribute>_schema.json -o generator/go/<attribute>.go
3. mkdir -p packages/i18nify-go/modules/<attribute> && cp -R generator/go/<attribute>.go packages/i18nify-go/modules/<attribute>
