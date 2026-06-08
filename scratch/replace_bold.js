import fs from 'fs';
import path from 'path';

const targetDir = "/Users/honda/pm_study/src";

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function replaceBoldInFile(filePath, dryRun = true) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // **text** を <strong>text</strong> に置換する正規表現
  const pattern = /\*\*(.*?)\*\*/g;
  
  let count = 0;
  const newContent = content.replace(pattern, (match, p1) => {
    count++;
    return `<strong>${p1}</strong>`;
  });
  
  if (count > 0) {
    console.log(`${dryRun ? ' [DRY RUN]' : ''} Modified: ${filePath} (${count} replacements)`);
    if (!dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
  return count;
}

function main() {
  console.log("--- Starting Dry Run (JS) ---");
  let totalReplacements = 0;
  let modifiedFiles = 0;
  
  walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('.astro')) {
      const count = replaceBoldInFile(filePath, true);
      if (count > 0) {
        totalReplacements += count;
        modifiedFiles += 1;
      }
    }
  });
  
  console.log(`Total replacements found: ${totalReplacements} across ${modifiedFiles} files.`);
  
  if (totalReplacements > 0) {
    console.log("\n--- Executing Actual Replacement (JS) ---");
    walkDir(targetDir, (filePath) => {
      if (filePath.endsWith('.astro')) {
        replaceBoldInFile(filePath, false);
      }
    });
  }
}

main();
