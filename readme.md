# File Indexer and Searcher

A Node.js utility for indexing files in a directory, extracting keywords from content, and generating a searchable CSV index.

## Indexer

### Features

- Recursively scans directories and indexes all files
- Extracts keywords from text content (ignoring common stopwords)
- Records file paths, extensions, creation dates, and modification dates
- Watches for file changes and automatically updates the index
- Outputs results to a customizable CSV file

### Installation

```bash
npm install desktop-indexer
```

Required dependencies:

```bash
npm install chokidar nodeloggerg stopwords-en
```

### Usage

#### Basic Usage

```bash
npm run index
```

This will index the directory where the script is located and output the results to `file-index.csv` in the current directory.

#### Custom Directory and Output

```bash
npm run index /path/to/directory output-filename.csv
```

### Parameters

- First argument: Directory path to index (defaults to script directory)
- Second argument: Output CSV filename (defaults to "file-index.csv")

### Output Format

The CSV file contains the following columns:

- File Name
- File Extension
- File Path
- Date Created
- Date Modified
- Keywords (extracted from file content)

### How It Works

1. Recursively traverses the specified directory
2. Reads each file and extracts keywords (filtering out common stopwords)
3. Records file metadata and keywords in a CSV format
4. Watches the directory for changes and updates the index automatically

### Dependencies

- chokidar: File system watcher
- nodeloggerg: Logging utility
- stopwords-en: English stopwords for keyword filtering
- fs, path, os: Node.js built-in modules

## Searcher



## License

MIT
