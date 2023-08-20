# NodeDB

NodeDB is a simple key-value store for Node.js, built on top of SQLite.

## Installation

You can install NodeDB using npm:

```sh
npm install @ajayos/nodedb
```

## Setup

1. Install NodeDB using npm:

```sh
npm install @ajayos/nodedb
```

2. Import and create an instance of the DB class with a custom database file path:

```javascript
const DB = require('@ajayos/nodedb');
const customDBPath = '/path/to/custom/database/file.db';
const nodedb = new DB(customDBPath);
```

3. Use the available functions to interact with the database, as demonstrated in the examples below.

## Project Description

NodeDB provides an efficient way to manage key-value data in your Node.js applications by leveraging the power of SQLite. It offers a lightweight and embedded database solution suitable for small to medium-sized projects. Whether you need to store user profiles, configuration settings, or any other structured data, NodeDB simplifies the process by providing easy-to-use functions for storing, retrieving, and deleting data.

## Functions and Usage

### `setDB(tableName, rowName, data)`

Inserts or updates a row in the specified table with the specified key and data.

#### Example Usage:

```javascript
await nodedb.setDB('users', 'ajay', { name: 'Ajay o s', age: 20 });
```

### `getDB(tableName, rowName)`

Retrieves a row from the specified table with the specified key, or all rows if no key is specified.

#### Example Usage:

```javascript
const ajay = await nodedb.getDB('users', 'ajay');
console.log(ajay); // { name: 'Ajay o s', age: 20 }
```

#### Example Usage (All Rows):

```javascript
const allUsers = await nodedb.getDB('users');
console.log(allUsers); // [ { rowName: 'ajay', data: { name: 'Ajay o s', age: 20 } }, ... ]
```

### `deleteDB(tableName, rowName)`

Deletes a row from the specified table with the specified key, or the entire table if no key is specified.

#### Example Usage:

```javascript
await nodedb.deleteDB('users', 'ajay');
```

#### Example Usage (Delete Table):

```javascript
await nodedb.deleteDB('users');
```

### `setDATA(tableName, rowName, data: any)`

Similar to `setDB`, but stores data without JSON stringifying it.

#### Example Usage:

```javascript
await nodedb.setDATA('metadata', 'version', 1.2);
```

### `getDATA(tableName, rowName)`

Similar to `getDB`, but retrieves data without JSON parsing it.

#### Example Usage:

```javascript
const version = await nodedb.getDATA('metadata', 'version');
console.log(version); // 1.2
```

#### Example Usage (All Rows):

```javascript
const allVersions = await nodedb.getDATA('metadata');
console.log(allVersions); // [ { rowName: 'version', data: 1.2 }, ... ]
```

### `deleteDATA(tableName, rowName)`

Similar to `deleteDB`, but deletes data without JSON parsing it.

#### Example Usage:

```javascript
await nodedb.deleteDATA('metadata', 'version');
```

#### Example Usage (Delete Table):

```javascript
await nodedb.deleteDATA('metadata');
```

Example
Here's a complete example of how to use NodeDB to interact with a database:

```javascript
Copy code
const DB = require('@ajayos/nodedb');

// Define a custom database file path
const customDBPath = 'mydatabase.sql';

// Create an instance of the DB class
const nodedb = new DB(customDBPath);

async function main() {
  // Set data using setDB
  await nodedb.setDB('users', 'ajay', { name: 'Ajay o s', age: 20 });

  // Get data using getDB
  const ajay = await nodedb.getDB('users', 'ajay');
  console.log('Retrieved Data:', ajay);

  // Delete a specific row using deleteDB
  await nodedb.deleteDB('users', 'ajay');
}

// Run the main function
main().catch((error) => {
  console.error('An error occurred:', error);
});

## Note

For functions like `deleteDB` and `deleteDATA`, if you provide only the `tableName`, the entire table will be deleted. To delete a specific row, provide both `tableName` and `rowName`.

## License

NodeDB is licensed under the Apache License 2.0. See the [LICENSE](/LICENSE) file for details.

## Repository

You can find the repository for NodeDB on GitHub at [https://github.com/Ajayos/nodedb](https://github.com/Ajayos/nodedb)
