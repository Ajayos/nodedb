const DB = require("./");

// Define a custom database file path
const customDBPath = "db/mydatabase.sql";

// Create an instance of the DB class
const nodedb = new DB(customDBPath);

async function main() {
  // Set data using setDB
  await nodedb.setDB("users", "ajay", { name: "Ajay o s", age: 20 });

  // Get data using getDB
  const ajay = await nodedb.getDB("users", "ajay");
  console.log("Retrieved Data:", ajay);

  // Get all rows using getDB
  const allUsers = await nodedb.getDB("users");
  console.log("All Users:", allUsers);

  // Delete a specific row using deleteDB
  await nodedb.deleteDB("users", "ajay");

  // Delete an entire table using deleteDB
  await nodedb.deleteDB("users");

  // Set data without JSON stringifying using setDATA
  await nodedb.setDATA("metadata", "version", 1.2);

  // Get data without JSON parsing using getDATA
  const version = await nodedb.getDATA("metadata", "version");
  console.log("Version:", version);

  // Delete a specific row using deleteDATA
  await nodedb.deleteDATA("metadata", "version");

  // Delete an entire table using deleteDATA
  await nodedb.deleteDATA("metadata");
}

// Run the main function
main().catch((error) => {
  console.error("An error occurred:", error);
});
