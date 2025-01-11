## Working with an IndexDB

A simple example to show how to work with an IndexDB. For larger projects it might
be better to use established libraries instead:
 * https://github.com/dexie/
 * https://pouchdb.com/
 * https://github.com/WebReflection/sqlite-worker

This example is using a Promise-based approach, derived from
https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

The database will be created on add-on installation and can be inspected through the "storage" tab of
the add-on inspector. It will remain empty until the "Access DB!" action button is clicked. Later clicks
will only read the DB.
