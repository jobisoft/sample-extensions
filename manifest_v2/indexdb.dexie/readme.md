## IndexDB using Dexie

A simple example to show how to use the [Dexie library](https://dexie.org/) to access an IndexDB.
The used database is compatible to the database created in the following MDN example:
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

The database will be created on add-on installation and can be inspected through the "storage" tab of
the add-on inspector. It will remain empty until the "Access DB!" action button is clicked. Later clicks
will only read the DB.
