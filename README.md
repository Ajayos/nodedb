# NodeDB

NodeDB is a simple key-value store for Node.js, built on top of SQLite.

## Installation

You can install NodeDB using npm:

```sh
npm install @ajayos/nodedb
```

## Usage

To use NodeDB in your Node.js project, simply import it:

```sh
import { setDB, getDB, deleteDB } from '@ajayos/nodedb';
```
Then you can use the following functions:

`setDB(tableName: string, rowName: string, data: any): Promise<any>`

Inserts or updates a row in the specified table with the specified key and data.

`getDB(tableName: string, rowName?: string): Promise<any>`

Retrieves a row from the specified table with the specified key, or all rows if no key is specified.

`deleteDB(tableName: string, rowName?: string): Promise<boolean>`

Deletes a row from the specified table with the specified key, or the entire table if no key is specified.

## Example

```javascript
const { setDB, getDB, deleteDB } = require('@ajayos/nodedb');

async function DB() {
    await setDB('users', 'ajay', { name: 'Ajay o s', age: 20 });
    await setDB('users', 'keerthana', { name: 'keerthana', age: 20 });

    const ajay = await getDB('users', 'ajay');
    console.log(ajay); // { name: 'Ajay o s', age: 20 }

    const allUsers = await getDB('users');
    console.log(allUsers); // [ { rowName: 'ajay', data: { name: 'Ajay o s', age: 20 } }, { rowName: 'keerthana', data: { name: 'keerthana', age: 20 } } ]

    await deleteDB('users', 'ajay');

    const deleted = await getDB('users', 'ajay');
    console.log(deleted); // undefined
}
DB();
```

## License

NodeDB is licensed under the Apache License 2.0. See the [LICENSE](/LICENSE) file for details.

## Repository

You can find the repository for NodeDB on GitHub at [https://github.com/Ajayos/nodedb](https://github.com/Ajayos/nodedb)