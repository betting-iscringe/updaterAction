const core = require("@actions/core");
const fs = require("fs");

const baseDir = process.env.GITHUB_WORKSPACE;
const createIndex = () => {
  const indexDir = `${baseDir}/index.json`;

  const configs = require(indexDir);
  const defaultInput = core.getInput("default", { required: true });

  if (configs.defaults.length === 1 && configs.defaults[0] === defaultInput) {
    return false;
  }
  // write new index.json if event names list dont match
  configs.defaults = [defaultInput];
  const indexContent = JSON.stringify(configs, null, 2);
  fs.writeFileSync(indexDir, indexContent);
  core.info(`Updated: ${indexDir}`);
  return true;
};
const didUpdate = createIndex();
if (didUpdate) {
  core.setOutput("hasUpdates", true);
}
