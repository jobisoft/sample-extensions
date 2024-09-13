"use strict";

// Using a closure to not leak anything but the API to the outside world.
(function (exports) {

  // This is the base preference name for all your legacy prefs.
  const MY_EXTENSION_BASE_PREF_NAME = "myaddon.";

  /**
   * This maps preference names to their types. This is needed as the prefs
   * system doesn't actually know what format you've stored your pref in.
   */
  function prefType(name) {
    switch (name) {
      case "bool_pref": {
        return "bool";
      }
      case "integer_pref": {
        return "int";
      }
      case "ascii_string_pref": {
        return "char";
      }
      case "unicode_string_pref": {
        return "string";
      }
    }
    throw new Error(`Unexpected pref type ${name}`);
  }


  // This is the important part. It implements the functions and events defined in schema.json.
  // The variable must have the same name you've been using so far, "PrefMigration" in this case.
  var PrefMigration = class extends ExtensionCommon.ExtensionAPI {
    getAPI(context) {
      return {
        // This key must match the class name.
        PrefMigration: {

          async getPref(name) {
            try {
              switch (prefType(name)) {
                case "bool": {
                  return Services.prefs.getBoolPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
                }
                case "int": {
                  return Services.prefs.getIntPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
                }
                case "char": {
                  return Services.prefs.getCharPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
                }
                case "string": {
                  return Services.prefs.getStringPref(`${MY_EXTENSION_BASE_PREF_NAME}${name}`);
                }
              }
            } catch (ex) {
              return undefined;
            }
            throw new Error("Unexpected pref type");
          },

        },
      };
    }
  };

  // Export the api by assigning it to the exports parameter of the anonymous
  // closure function, which is the global this.
  exports.PrefMigration = PrefMigration;

})(this)