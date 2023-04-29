import * as fs from 'fs';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';
import { promisify } from 'util';
// tslint:disable-next-line
import * as nodelog from '@ajayos/nodelog';

const DB_FOLDER = 'DB';
const DB_FILE = 'ajayos.sql';
const DB_PATH = './' + DB_FOLDER + '/' + DB_FILE;

// Check if DB folder exists, create it if it does not
if (!fs.existsSync(path.join('./' + DB_FOLDER ))) {
  fs.mkdirSync(path.join('./' + DB_FOLDER ));
}

// Connect to the SQLite database
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    // Set the password for the database
    db.run(`PRAGMA key='eff7f92d38fafc792db6f88550399b56c521df95f841a265d93383d6b08395bc';`, (err) => {
      if (err) {
        log(err.message, 'error');
      } else {
       log(`Connected to the database.`, 'info');
      }
    });
  }
});

// Promisify the db.run() and db.all() methods for easier use with async/await
const runAsync = promisify(db.run.bind(db));
const allAsync = promisify(db.all.bind(db));
export { runAsync, allAsync, db };
// Create the 'setDB' function
export const setDB = async (tableName: string, rowName: string, data: any): Promise<any> => {
    try {
        // Check if the table exists
        const result = await allAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`);

        if (result.length === 0) {
            // Table does not exist, create it and insert the data
            await runAsync(`CREATE TABLE ${tableName} (row_name TEXT PRIMARY KEY, data TEXT NOT NULL);`);
            await runAsync(`INSERT INTO ${tableName} (row_name, data) VALUES (?, ?);`, [rowName, JSON.stringify(data)]);
        } else {
            // Table exists, check if row exists
            const result = await allAsync(`SELECT row_name FROM ${tableName} WHERE row_name='${rowName}';`);

            if (result.length === 0) {
                // Row does not exist, insert it
                await runAsync(`INSERT INTO ${tableName} (row_name, data) VALUES (?, ?);`, [rowName, JSON.stringify(data)]);
            } else {
                // Row exists, update it
                await runAsync(`INSERT OR REPLACE INTO ${tableName} (row_name, data) VALUES (?, ?);`, [rowName, JSON.stringify(data)]);
            }
        }
        return true;
    } catch (err) {
        console.error(err.message);
        return false;
    }
};

// Create the 'getDB' function
export const getDB = async (tableName: string, rowName?: string): Promise<any> => {
  try {
        // Check if the table exists
        const result = await allAsync(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`);

        if (result.length === 0) {
            // Table does not exist, create it
            await runAsync(`CREATE TABLE ${tableName} (row_name TEXT PRIMARY KEY, data TEXT NOT NULL);`);
            return undefined;
        } else {
            if (rowName) {
                // Row name is specified, check if it exists
                const result = await allAsync(`SELECT data FROM ${tableName} WHERE row_name='${rowName}';`);

                if (result.length === 0) {
                    // Row does not exist, return undefined
                    return undefined;
                } else {
                    // Row exists, return the data
                    return JSON.parse(result[0].data);
                }
            } else {
                // Row name is not specified, return all rows
                const result = await allAsync(`SELECT row_name, data FROM ${tableName};`);
                return result.map((row: any) => {
                    return {
                        rowName: row.row_name,
                        data: JSON.parse(row.data)
                    };
                });
            }
        }

    } catch (err) {
        console.error(err.message);
        return undefined;
    }
};


// Create the 'deleteDB' function
export const deleteDB = async (tableName: string, rowName?: string): Promise<boolean> => {
    try {
        if (rowName) {
            // Row name is specified, check if it exists
            const result = await allAsync(`SELECT row_name FROM ${tableName} WHERE row_name='${rowName}';`);

            if (result.length === 0) {
                // Row does not exist, return false
                return false;
            } else {
                // Row exists, delete it
                await runAsync(`DELETE FROM ${tableName} WHERE row_name='${rowName}';`);
                return true;
            }
        } else {
            // Row name is not specified, delete the table
            await runAsync(`DROP TABLE ${tableName};`);
            return true;
        }
    } catch (err) {
        console.error(err.message);
        return false;
    }
}
