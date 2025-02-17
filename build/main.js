import fs from "node:fs";
import path from "node:path";

import { constants } from "./constants.js";

// Run the parser
import { data } from "./parser.js";

// Generate data.js

const dataPath = path.join(constants.generatedPath, "data.json");

console.info(`Writing ${dataPath}`);

await Bun.write(dataPath, JSON.stringify(data, null, "\t"));

// Generate pages.js

const pagesPath = path.join(constants.generatedPath, "pages.js");

let pagesText = "const pages = {};";

const pageFiles = fs.readdirSync(constants.pagesPath, { recursive: true });

for (let i = 0; i < pageFiles.length; i++) {
	const page = pageFiles[i].split(".")[0];

	pagesText += `import { page as ${page} } from "../pages/${page}.js";`;
	pagesText += `pages.${page} = ${page};`;
}

pagesText += "export { pages };";

console.info(`Writing ${pagesPath}`);

await Bun.write(pagesPath, pagesText);
