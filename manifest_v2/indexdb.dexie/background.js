// This is a simple example how to use the Dexie library to access an IndexDB. The
// used database is compatible to the database created in the following MDN example:
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

import { Dexie } from './dexie.mjs.js';

const defaultCustomerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
];

const db = new Dexie('MyDexieDatabase');

// Initially setup or upgrade a database, more info can be found at
// https://dexie.org/docs/Version/Version.stores()
db.version(1).stores({
    customers: 'ssn, name, &email'
    // The ++ prefix will auto-increment the value if not provided during put/add.
    // Only fields which should be indexed need to be added here, do not add large
    // data fields.
    // friends: '++id, age'
});

browser.browserAction.onClicked.addListener(async () => {
    const { init } = await browser.storage.local.get({ init: false });
    // Use an outer try .. catch to catch DB errors.
    try {
        if (!init) {
            // Start a Dexie transaction. Not using a transaction will continue
            // before committing/persisting the data.
            await db.transaction('rw', db.customers, async () => {
                await db.customers.bulkAdd(defaultCustomerData);
            })
        }
    
        // Read back.
        console.log("Data for SSN 444-44-4444 is", await db.customers
            .where('ssn')
            .equals("444-44-4444")
            .toArray().then(rv => rv[0]));
        console.log("Data for Donna is", await db.customers
            .where("name")
            .equals("Donna")
            .toArray().then(rv => rv[0]));
        console.log("Data for bill@company.com is", await db.customers
            .where("email")
            .equals("bill@company.com")
            .toArray().then(rv => rv[0]));

        await browser.storage.local.set({ init: true });
    } catch (ex) {
        console.info(ex);
    }
})
