/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 699:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(699);
const fs = __nccwpck_require__(147);

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

})();

module.exports = __webpack_exports__;
/******/ })()
;