const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

/**
 * Searches a CSV file for rows matching a specific query.
 * @param {string} filePath - The path to the CSV file.
 * @param {string} column - The column to search in.
 * @param {string} query - The value to search for.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of matching rows.
 */
function searchCsv(filePath, column, query) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row[column] && row[column].toString().includes(query)) {
          results.push(row);
        }
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Example usage
const csvFilePath = process.argv[3] || path.join(__dirname, "data.csv");
const searchQuery = process.argv[2];
const column = process.argv[4] || "keywords"; // Default to 'keywords' column

searchCsv(csvFilePath, column, searchQuery)
  .then((matches) => {
    console.log("Search Results:", matches);
  })
  .catch((error) => {
    console.error("Error searching CSV:", error);
  });
