import fs from "fs";
const file = process.argv[2];
fs.writeFileSync(file, fs.readFileSync(file, "utf8").split("motion-card").join("motion-card"));
