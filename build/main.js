import fs from "node:fs";
import path from "node:path";

import constants from "./constants";

// Run the parser
import parser from "./parser";

export default async () => {
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
};

// TODO
// const outputFiles = fs.readdirSync(constants.outputPath);
//
// for (let i = 0; i < outputFiles.length; i++) {
// 	if (outputFiles[i].endsWith(".js")) {
// 		const outputFilePath = path.join(constants.outputPath, outputFiles[i]);
//
// 		console.log(`Removing tabs from ${outputFiles[i]}`);
//
// 		await Bun.write(
// 			outputFilePath,
// 			fs.readFileSync(outputFilePath, "utf8").replaceAll("\t", ""),
// 		);
//
// 		console.log(
// 			`${outputFiles[i]} size: ${Math.round((fs.statSync(outputFilePath).size / 1_000_000) * 1000) / 1000} MB`,
// 		);
// 	}
// }
