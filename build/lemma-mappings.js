import fs from "node:fs";

import yaml from "js-yaml";

import { constants } from "./constants.js";
import { utilities } from "./utilities.js";

console.time("lemma-mappings");

const data = {
	// Map of lexicalForm -> word
	lexicalFormVocabularyMap: {},
};

// Map of Strong's number -> array of lexical forms
const strongsNumberMap = yaml.load(
	utilities.oxiaToTonos(fs.readFileSync(constants.strongsMappingPath, "utf8")),
);

for (const number in strongsNumberMap) {
	const lexicalForms = strongsNumberMap[number];

	for (let j = 0; j < lexicalForms.length; j++) {
		const lexicalForm = lexicalForms[j];

		if (data.lexicalFormVocabularyMap[lexicalForm] === undefined) {
			data.lexicalFormVocabularyMap[lexicalForm] = { numbers: [] };
		}

		data.lexicalFormVocabularyMap[lexicalForm].numbers.push(`G${number}`);
	}
}

console.timeEnd("lemma-mappings");

export { data };
