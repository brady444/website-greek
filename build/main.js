import fs from "node:fs";
import path from "node:path";

import constants from "./constants";

// Run the parser
import parser from "./parser";

// Generate data.js

const dataPath = path.join(constants.generatedPath, "data.json");

console.log(`Writing ${dataPath}`);

await Bun.write(dataPath, JSON.stringify(parser.data, null, "\t"));

// Generate pages.js

const pagesPath = path.join(constants.generatedPath, "pages.js");

let pagesText = "const pages = {};";

const pageFiles = fs.readdirSync(constants.pagesPath, { recursive: true });

for (let i = 0; i < pageFiles.length; i++) {
	const page = pageFiles[i].split(".")[0];

	pagesText += `import ${page} from "../pages/${page}";`;
	pagesText += `pages.${page} = ${page};`;
}

pagesText += "export default pages;";

console.log(`Writing ${pagesPath}`);

await Bun.write(pagesPath, pagesText);
