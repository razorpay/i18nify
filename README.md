# i18nify

_A comprehensive JavaScript toolkit designed to streamline internationalization in your applications._

Embark on a journey into the world of **i18nify**—a magical toolkit for JavaScript that transforms your app into a global linguist! 🪄✨ Imagine having specialized modules for handling phone numbers, currencies, dates, and more—like enchanted tools ensuring your app speaks fluently in any language, anywhere it goes. It's your passport to making your app a true global citizen!

**Let's get started!**

### Core Package: i18nify-js

[i18nify-js docs](https://github.com/razorpay/i18nify/blob/master/packages/i18nify-js/README.md)

Unleash the power of **i18nify-js**, the heart of all things i18nify. Its README provides detailed instructions on installation, usage, and documentation on APIs, empowering you to harness the full potential of internationalization in your projects.

### Framework Wrappers:

1. **i18nify-react**
   [i18nify-react docs](https://github.com/razorpay/i18nify/blob/master/packages/i18nify-react/README.md)

   Built as a wrapper over i18nify-js, **i18nify-react** simplifies the integration with React. Explore its README for seamless installation, API documentation, and additional features tailored for the React library.

### Go SDK:

Convert json to json schema

1. quicktype data/<attribute>\_v1.json -l schema -o data/schema/<attribute>\_schema.json
2. quicktype -s schema data/schema/<attribute>\_schema.json -o generator/go/<attribute>.go
3. mkdir -p packages/i18nify-go/modules/<attribute> && cp -R generator/go/<attribute>.go packages/i18nify-go/modules/<attribute>
