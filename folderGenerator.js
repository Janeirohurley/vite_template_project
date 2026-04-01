import fs from "fs";
import path from "path";
import prompts from "prompts";

const directoriesToCreate = [
  "api",
  "components",
  "constants",
  "hooks",
  "pages",
  "store",
  "types",
  "layout",
  "common",
];

function createIndexFile(dirPath) {
  const indexPath = path.join(dirPath, "index.ts");
  const content = `// Auto-generated module index\n`;

  try {
    fs.writeFileSync(indexPath, content, { flag: "wx" });
    console.log(`  -> Created index.ts in ${dirPath}`);
  } catch {
    // Ignore when the file already exists.
  }
}

async function generateFolders() {
  const response = await prompts({
    type: "text",
    name: "parentName",
    message: "Module name (for example: auth, billing, dashboard)?",
    validate: (value) =>
      value.trim().length > 0 ? true : "The module name cannot be empty.",
  });

  const moduleName = response.parentName?.trim();

  if (!moduleName) {
    console.log("Operation cancelled.");
    return;
  }

  const baseDir = path.join("src", "modules", moduleName);
  let createdCount = 0;
  let fileCount = 0;

  if (!fs.existsSync(baseDir)) {
    console.log(`\nCreating parent folder "${baseDir}"...`);
    fs.mkdirSync(baseDir, { recursive: true });
    createdCount++;
  } else {
    console.log(`\n"${baseDir}" already exists. Checking missing folders and files...`);
  }

  createIndexFile(baseDir);
  fileCount++;

  directoriesToCreate.forEach((subDir) => {
    const fullDirPath = path.join(baseDir, subDir);

    if (!fs.existsSync(fullDirPath)) {
      fs.mkdirSync(fullDirPath, { recursive: true });
      console.log(`- Created: ${fullDirPath}`);
      createdCount++;
    }

    createIndexFile(fullDirPath);
    fileCount++;
  });

  console.log(`\nModule structure for "${moduleName}" is ready in "src/modules/".`);
  console.log(`Total: ${createdCount} folders and ${fileCount} index.ts files created or confirmed.`);
}

generateFolders().catch(console.error);
