## Working with an IndexDB using the SQLiteWorker library

A simple example to show how to use the [SQLiteWorker library](https://github.com/WebReflection/sqlite-worker)
to access an IndexDB.

The database will be created on add-on installation and can be inspected through
the "storage" tab of the add-on inspector. It will remain empty until the "Access DB!"
action button is clicked. Later clicks will only read the DB.

The library allows to interact with the database through SQL syntax:

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

**Note:** The actual used database *is* an SQLite database stored as a raw SQLite
database file buffer in an `sqlite` objectStore of an IndexDB. All DB operations
are handled in memory and the entire SQLite database file buffer is committed into
the IndexDB.

This example dumps the buffer after each interaction to the console. Technically
it is possible to import an existing SQLite database file.

This approach might cause out-of-memory errors for large databases.