const fs = require("fs");
const path = require("path");

const srcPath = path.join(__dirname, "src");
const typesPath = path.join(__dirname, "dist");

// Check if the "types" folder exists, if not, create it
if (!fs.existsSync(typesPath)) {
  fs.mkdirSync(typesPath);
}

// Read the files in the "src" folder
fs.readdir(srcPath, (err, files) => {
  if (err) {
    console.error(err);

    return;
  }

  // Iterate through the files in the "src" folder
  files.forEach((file) => {
    // Check if the file is a .d.ts file
    if (file.endsWith(".d.ts")) {
      // Construct the source and destination file paths
      const srcFile = path.join(srcPath, file);
      const destFile = path.join(typesPath, file);

      // Copy the file
      fs.copyFile(srcFile, destFile, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }
  });
});
