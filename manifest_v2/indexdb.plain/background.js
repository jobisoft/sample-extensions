// This is a simple example how to work with an IndexDB. It aims to show how things
// work. For larger projects it might be better to use established libraries instead:
// * https://github.com/dexie/
// * https://pouchdb.com/
// * https://github.com/WebReflection/sqlite-worker

// This example is using a Promise-based approach, derived from
// https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database

class PromisifiedIndexDB {
    #db;
    #name;
    #version;

    constructor(name) {
        this.#name = name;
    }

    check() {
        if (!this.#version || !this.#db) {
            throw new Error(`No Database <${this.#name}>!`);
        }
    }

    async open({ version, onUpgradeNeeded }) {
        this.#version = version;

        const setupTask = Promise.withResolvers();
        const upgradeTask = Promise.withResolvers();
        let waitForUpgrade = false;

        const request = window.indexedDB.open(this.#name, this.#version);
        request.onerror = (event) => {
            throw new Error("Why didn't you allow me to use IndexedDB?!", event);
        };
        request.onsuccess = (event) => {
            this.#db = event.target.result;
            this.#db.onerror = (event) => {
                // Generic error handler for all errors targeted at this database's
                // requests!
                console.error(`Database error: ${event.target.error?.message}`);
            };
            setupTask.resolve();
        };
        request.onupgradeneeded = (event) => {
            waitForUpgrade = true;
            onUpgradeNeeded(event.target.result, event).then(() => upgradeTask.resolve());
        };

        await setupTask.promise;
        if (waitForUpgrade) {
            await upgradeTask.promise
        }
    }

    async add(store, data) {
        this.check();
        const task = Promise.withResolvers();

        const objectStore = this.#db
            .transaction(store, "readwrite")
            .objectStore(store);
        objectStore.transaction.oncomplete = (event) => {
            task.resolve();
        }
        objectStore.add(data);

        return task.promise;
    }

    async get(store, key, indexName) {
        this.check();
        let request;
        const task = Promise.withResolvers();
        const objectStore = this.#db
            .transaction(store)
            .objectStore(store);

        if (indexName) {
            const index = objectStore.index(indexName);
            request = index.get(key);
        } else {
            // Use primary index.
            request = objectStore.get(key);
        }
        
        request.onsuccess = (event) => {
            task.resolve(request.result)
        };
        return task.promise;
    }
}

const defaultCustomerData = [
    { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
    { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" },
];

// Create a new PromisifiedIndexDB instance for our database.
const db = new PromisifiedIndexDB("MyTestDatabase");

// Open or create the database with a given version. If the database does not yet
// exist, or the version of the current database is smaller than the requested
// version, the provided onUpgradeNeeded callback will be executed. That callback
// should return a Promise, which fulfills once the transaction has been completed.
// The passed in database object is the actual IDBDatabase object.
await db.open({
    version: 1, onUpgradeNeeded: (database, event) => new Promise(resolve => {
        // What is the current version? This will be needed to determine how the
        // DB needs to be upgraded. In this example we only use version 1, and
        // this is only called to initially setup the DB.
        console.info(`Database version upgrade from <${event.oldVersion}> to <${event.newVersion}>`);

        // Create an objectStore for the "customers" store (similar to a table).
        // We define a primary index "ssn", which has to be provided manually and
        // must be unique. Trying to add an entry with the same ssn will fail.
        // See MDN for more details:
        // https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#structuring_the_database
        const objectStore = database.createObjectStore("customers", {
            keyPath: "ssn"
        });

        // Create an additional index to search customers by name. We may have
        // duplicates so we can't use a unique index.
        objectStore.createIndex("name", "name", { unique: false });

        // Create an additional index to search customers by email. We want to
        // ensure that no two customers have the same email, so use a unique index.
        objectStore.createIndex("email", "email", { unique: true });

        // Wait for the completion of the transaction.
        objectStore.transaction.oncomplete = (event) => {
            resolve();
        }
    })
});

browser.browserAction.onClicked.addListener(async () => {
    const { init } = await browser.storage.local.get({ init: false });
    if (!init) {
        for (const data of defaultCustomerData) {
            await db.add("customers", data);
        }
        await browser.storage.local.set({ init: true });
    }

    console.log("Data for SSN 444-44-4444 is", await db.get("customers", "444-44-4444"));
    console.log("Data for Donna is", await db.get("customers", "Donna", "name"));
    console.log("Data for bill@company.com is", await db.get("customers", "bill@company.com", "email"));
})
