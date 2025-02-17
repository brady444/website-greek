import fs from "node:fs";

import { constants } from "./constants.js";
import { utilities } from "./utilities.js";

console.time("step");

const data = {
	// Map of extended Strong's number -> word
	vocabulary: {},
	errors: new Set(),
};

const addError = (error) => data.errors.add(error);

const stepBibleLexicon = utilities.oxiaToTonos(
	fs.readFileSync(constants.stepBibleLexiconPath, "utf8"),
);

// The data starts at line 90, and we exclude the last newline
const lines = stepBibleLexicon.split("\n").slice(90, -1);

for (let i = 0; i < lines.length; i++) {
	const columns = lines[i].split("\t");

	const extendedStrongsNumber = `G${Number.parseInt(columns[0].slice(1))}`;
	// const disambiguatedStrongsNumber = columns [1];
	// const unifiedStrongsNumber = columns [2];
	let lexicalForm = columns[3];
	const transliteration = `/${columns[4]}/`;
	// const morph = columns [5];
	const gloss = columns[6];
	// const definition = columns [7];

	// Stop at G6000
	if (extendedStrongsNumber === "G6000") {
		break;
	}

	// TODO what does the equal sign mean? Some words are different on each side of the equal sign
	const lexicalFormEqualSignParts = lexicalForm.split("=");

	if (
		lexicalFormEqualSignParts.length === 2 &&
		lexicalFormEqualSignParts[0] === lexicalFormEqualSignParts[1]
	) {
		lexicalForm = lexicalFormEqualSignParts[0];
	}

	if (data.vocabulary[extendedStrongsNumber] === undefined) {
		data.vocabulary[extendedStrongsNumber] = {
			number: extendedStrongsNumber,
			lexicalForm: lexicalForm,
			transliteration: transliteration,
			glosses: new Set(),
		};
	}

	data.vocabulary[extendedStrongsNumber].glosses.add(gloss);
}

const words = Object.values(data.vocabulary);

for (let i = 0; i < words.length; i++) {
	const word = words[i];

	// Convert word.glosses from a Set to an array
	word.glosses = [...word.glosses];

	if (word.glosses.length === 0) {
		addError(`Word ${word.number} has no glosses`);
	}
}

console.timeEnd("step");

export { data };
