declare module "desktop-indexer" {
  export interface IndexOptions {
    recursive?: boolean;
    includeHidden?: boolean;
    fileTypes?: string[];
  }

  export interface FileInfo {
    path: string;
    name: string;
    size: number;
    lastModified: Date;
  }

  export function indexDirectory(
    directoryPath: string,
    options?: IndexOptions
  ): Promise<FileInfo[]>;

  export function searchIndex(
    query: string,
    options?: { caseSensitive?: boolean }
  ): Promise<FileInfo[]>;

  export function clearIndex(): void;
}
