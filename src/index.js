const fs = require("fs");
const path = require("path");
const os = require("os");
const chokidar = require("chokidar");
const pathToIndex = process.argv[2] || process.cwd();
const nodeloggerg = require("nodeloggerg");

const logger = new nodeloggerg({ startWebServer: true });

const stopwords = new Set(require("stopwords-en")); // npm install stopwords-en, an array of english stopwords
const outputFile = process.argv[3] || "file-index.csv";

function escapeCSV(value) {
  if (typeof value !== "string") return "";
  return `"${value.replace(/"/g, '""')}"`;
}

function extractKeywords(text) {
  return [
    ...new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 2 && !stopwords.has(word))
    ),
  ].join(" ");
}

function processFile(fullPath, entry, stat, csvRows) {
  if (path.parse(fullPath).base === outputFile) {
    return;
  }

  let content = "";
  try {
    content = fs.readFileSync(fullPath, "utf8");
  } catch {
    // Ignore binary or unreadable files
  }

  const ext = path.extname(entry) || "";
  const keywords = content ? extractKeywords(content) : "";
  csvRows.push([
    escapeCSV(entry),
    escapeCSV(ext),
    escapeCSV(fullPath),
    stat.birthtime.toISOString(),
    stat.mtime.toISOString(),
    escapeCSV(keywords),
  ]);
}

function indexDirectory(dirPath, csvRows) {
  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      indexDirectory(fullPath, csvRows);
    } else {
      processFile(fullPath, entry, stat, csvRows);
    }
  }
}

function index(dirPath) {
  const csvRows = [
    [
      "File Name",
      "File Extention",
      "File Path",
      "Date Created",
      "Date Modified",
      "Keywords",
    ],
  ];

  indexDirectory(dirPath, csvRows);
  const csvContent = csvRows.map((row) => row.join(",")).join(os.EOL);
  fs.writeFileSync(outputFile, csvContent);
  fs.appendFileSync(outputFile, "\n");
  logger.info(`Index written to ${outputFile}`);
}

index(pathToIndex);

const watcher = chokidar.watch(pathToIndex, { ignoreInitial: true });
watcher.on("add", () => index(pathToIndex));
watcher.on("change", () => index(pathToIndex));

module.exports = Object.assign(index, {
  indexDirectory,
  processFile,
  extractKeywords,
  escapeCSV,
});
module.exports.default = Object.assign(index, {
  indexDirectory,
  processFile,
  extractKeywords,
  escapeCSV,
});
