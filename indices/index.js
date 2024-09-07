const core = require("@actions/core");
const fs = require("fs");

const folders = ["divegrass", "etc", "hfz", "vtrp"];
const baseDir = process.env.GITHUB_WORKSPACE;
const createIndex = (folderName) => {
  const folderDir = `${baseDir}/${folderName}`;
  let files = fs
    .readdirSync(folderDir)
    .filter((fileName) => fileName !== "index.json")
    .sort((a, b) => {
      // sort by descending creation date
      let aStat = fs.statSync(`${folderDir}/${a}`),
        bStat = fs.statSync(`${folderDir}/${b}`);
      return (
        new Date(aStat.birthtime).getTime() -
        new Date(bStat.birthtime).getTime()
      );
    })
    .map((fileName) => fileName.slice(0, -5));
  let { names: eventNames } = require(`${folderDir}/index.json`);
  let fileSet = new Set(files);
  let eventSet = new Set(eventNames);
  eventSet.forEach((file) => !fileSet.has(file) && eventSet.delete(file)); // remove nonexistent files from index.json
  fileSet.forEach((file) => eventSet.has(file) && fileSet.delete(file)); // keep missing filenames in eventSet
  const newEventNames = [...eventSet, ...fileSet];
  const newEventSet = new Set(newEventNames);

  if (
    eventNames.length !== newEventNames.length ||
    !eventNames.every((value) => newEventSet.has(value))
  ) {
    // write new index.json if event names list dont match
    const indexContent = JSON.stringify({ names: newEventNames }, null, 2);
    fs.writeFileSync(`${folderDir}/index.json`, indexContent);
    core.info(`Updated: ${folderName}/index.json`);
    return true;
  }
  return false;
};

let foldersUpdated = [];
folders.forEach((folderName) => {
  const didUpdate = createIndex(folderName);
  if (didUpdate) foldersUpdated.push(folderName);
});
if (foldersUpdated.length !== 0) {
  core.setOutput("hasUpdates", true);
  core.setOutput("folders", foldersUpdated.toString());
}
