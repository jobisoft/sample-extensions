## i18n

This extension uses the `i18n` API to localize an extension. It allows to include
multiple `messages.json` files with translations of extension strings in the
`_locales` folder:

```
extension-root/
├── manifest.json
└── _locales/
    ├── en/
    │   └── messages.json
    ├── de/
    │   └── messages.json
    └── fr/
        └── messages.json
```

The English version of the `messages.json` file could look as follows:

```JSON
{
  "extensionName": {
    "message": "My awesome Extension"
  },
  "extensionDescription": {
    "message": "This awesome Extension makes time fly!"
  },
  "title": {
    "message": "This is a title"
  },
  "goodDay": {
    "message": "Have a good day!"
  },
  "textPrompt": {
    "message": "Enter some text"
  }
}
```

The manifest needs to define a "default" locale, if the application locale of the user is not available. Using english here is the best option (using the name of the folder):

```JSON
{
  "manifest_version": 3,
  "version": "1.0",
  "author": "Thunderbird Team",
  "name": "__MSG_extensionName__",
  "description": "__MSG_extensionDescription__",
  "browser_specific_settings": {
    "gecko": {
      "id": "i18n@mv3.sample.extensions.thunderbird.net",
      "strict_min_version": "128.0"
    }
  },
  "default_locale": "en"
}
```

Notice the `__MSG_*__` placeholders in the `name` and `description` fields, which reference
the `extensionName` and `extensionDescription` strings defined in the mentioned `messages.json` files.

Furthermore, all WebExtension scripts can now request strings in the user's locale:

```JavaScript
let textPrompt = browser.i18n.getMessage("goodDay");
```

The `i18n.mjs` module from the [`webext-support` repository](https://github.com/thunderbird/webext-support/tree/master/modules/i18n) is used by this example to localize an HTML file, where the localization keys are referenced
in the markup.

## Differences from the version for Manifest V2

The `browser_action` manifest entry had to be changed into an `action` manifest key.
