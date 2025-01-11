// This is a simple example how to use the SQLiteWorker library to access an IndexDB.
// The data stored is the same as in the example presented on MDN (see link below),
// but the resulting format of the actual IndexDB is not compatible, the content is
// not human-readable in the storage tab of the add-on inspector.
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

// The SQLiteWorker library makes heavy use of tagged template function parameters,
// more information can be found here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#tagged_templates

// It is not possible to actually use the SQLiteWorker library as a Worker in a
// WebExtension, because the worker script is loaded as a dynamic JavaScript blob
// via createObjectURL(), and the blob worker tries to load the actual scripts via
// the global importScripts() function. However, that blob worker is not within
// the same origin as the rest of the extension, and loading extension scripts
// will fail due to the same-origin policy. The first example usage described in
// the projects documentation therefore does not work for us.
// https://github.com/WebReflection/sqlite-worker/tree/main?tab=readme-ov-file#importing-on-web-pages-via-esm
// import { SQLiteWorker } from './sql/dist/index.js';

// Instead, we need to bootstrap the SQLiteWorker module into the main thread.
import { init } from './sql/dist/index.js';

const defaultCustomerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
];

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

// Dump the raw SQLite database buffer.
const requestDB = window.indexedDB.open("MySQLDatabase", "1");
requestDB.onsuccess = (event) => {
    const rawDB = event.target.result;
    rawDB.onerror = (event) => {
        // Generic error handler for all errors targeted at this database's
        // requests!
        console.error(`Database error: ${event.target.error?.message}`);
    };
    const objectStore = rawDB
        .transaction("sqlite")
        .objectStore("sqlite");
    const requestBuffer = objectStore.get("buffer");
    requestBuffer.onsuccess = (event) => {
        const buffer = requestBuffer.result;
        // buffer is a Uint8Array of a binary string.
        const decoder = new TextDecoder();
        const str = decoder.decode(buffer);
        console.log(str);
    };
}