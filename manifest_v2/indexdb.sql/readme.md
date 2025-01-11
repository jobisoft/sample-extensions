## Working with an IndexDB using the SQLiteWorker library

A simple example to show how to use the [SQLiteWorker library](https://github.com/WebReflection/sqlite-worker)
to access an IndexDB.

The database will be created on add-on installation and can be inspected through
the "storage" tab of the add-on inspector. It will remain empty until the "Access DB!"
action button is clicked. Later clicks will only read the DB.

**Note:** The data is not stored in an actual SQLite database. The library allows
to interact with an IndexDB through SQL syntax:

```javascript
const db = await init({ name: 'MySQLDatabase' })
const table = db.raw`customers`;

await db.query`CREATE TABLE IF NOT EXISTS ${table} (ssn TEXT PRIMARY KEY, name TEXT, age INTEGER, email TEXT)`;
const { total } = await db.get`SELECT COUNT(ssn) as total FROM ${table}`;
if (total < 1) {
    console.log('Inserting some value');
    for (let { ssn, name, age, email } of defaultCustomerData) {
        await db.query`INSERT INTO ${table} (ssn,name,age,email) VALUES (${ssn},${name},${age},${email})`;
    }
}

console.log(await db.all`SELECT * FROM ${table}`);
```

**Note:** The database is not stored in a human readable format and even though
the example stores the same date as the other two IndexDB examples, the actual
IndexDB is not compatible.
