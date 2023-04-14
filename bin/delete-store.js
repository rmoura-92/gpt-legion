#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const storeId = args[0];
const type = args[1];

deleteDirectory(`.store${storeId ? `/${storeId}` : ''}`);

function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Not found: ${dirPath}`);
    return;
  }

  const dirsToDelete = [];
  const filesToDelete = [];

  fs.readdirSync(dirPath, { withFileTypes: true }).forEach(dirent => {
    const itemPath = path.join(dirPath, dirent.name);
    if (dirent.isDirectory()) {
      dirsToDelete.push(itemPath);
    } else {
      filesToDelete.push(itemPath);
    }
  });

  const itemsToDelete = type === 'all' ? [dirPath, ...filesToDelete] : [...dirsToDelete, ...filesToDelete];

  itemsToDelete.forEach(item => {
    try {
      fs.rmSync(item, { recursive: true, force: true });
      console.log(`Deleted: ${item}`);
    } catch (err) {
      console.log(`Error deleting ${item}: ${err.message}`);
    }
  });
}
