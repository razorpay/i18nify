# i18nify

i18nify is a comprehensive internationalization (i18n) library for all things global. 
Currently, it provides functionalities for handling countries, currencies, phone numbers, and subdivisions, 
making it easier to localize applications for different regions and languages.

## DeepWiki Link: [Link](https://deepwiki.com/razorpay/i18nify)

## Usage

To get started with i18nify, please refer to the language-specific README files:

- [Go](./packages/i18nify-go/readme.md)
- [JavaScript](./packages/i18nify-js/README.md)
- [React](./packages/i18nify-react/README.md)

## Dataset

If you are just looking for the dataset, go to [i18nify-data](i18nify-data) and download the respective data.

## Contributing

Contributions to i18nify are welcome! If you encounter any issues, have feature requests, or would like to contribute code, please refer to the respective contribution guidelines.

- [i18nify-data](i18nify-data/contribution-guidelines.md)

## US Regional Configuration
This branch includes US-specific settings optimized for the American market:
- **Currency**: USD with full support for cents and dollar formatting
- **Compliance**: CCPA, COPPA regulations implemented
- **Banking**: ACH, Wire transfers, routing number validation
- **Timezone**: America/New_York with daylight saving awareness
- **Phone**: +1 (XXX) XXX-XXXX format with area code validation

### 🚀 POC: Advanced Regional Conflict Resolution
This branch demonstrates cutting-edge regional conflict resolution capabilities:

**Smart Features:**
- 🎯 Automatic conflict detection across regional deployments
- 🤖 Auto-resolution for simple conflicts with fallback to manual guidance
- 🔄 Merge queue integration for seamless CI/CD workflows  
- 📋 Developer-friendly resolution guidance with copy-paste commands
- 🌍 Multi-regional banking integration (US focus with global compatibility)

**US-Specific POC Enhancements:**
- Universal currency support (USD primary, with SGD/EUR compatibility)
- Intelligent compliance framework (CCPA/COPPA with GDPR awareness)  
- Advanced banking integration (ACH/Wire with international swift support)
- Smart conflict resolution for US regulatory requirements

This implementation showcases how regional branches can maintain local compliance
while participating in a global, automated conflict resolution system.
