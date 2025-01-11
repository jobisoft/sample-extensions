## Working with an IndexDB using the Dexie library

A simple example to show how to use the [Dexie library](https://dexie.org/) to access an IndexDB.

The database will be created on add-on installation and can be inspected through the "storage" tab of
the add-on inspector. It will remain empty until the "Access DB!" action button is clicked. Later clicks
will only read the DB.

The beauty of the Dexie library is its query support:

```javascript
await db.customers
  .where('ssn')
  .equals("444-44-4444")
  .toArray()
```
