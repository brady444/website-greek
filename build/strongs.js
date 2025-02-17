import { utilities } from "./utilities.js";

import strongsGreekDictionary from "./data/strongs-greek-dictionary.js";

console.time("strongs");

const dictionary = JSON.parse(
	utilities.oxiaToTonos(JSON.stringify(strongsGreekDictionary)),
);

const data = {
	vocabulary: [],
	errors: new Set(),
};

const addError = (error) => data.errors.add(error);

// Get a sorted array of keys (G1, G2, etc.)
const vocabularyNumbers = Object.keys(dictionary).sort(
	(a, b) => Number.parseInt(a.slice(1)) - Number.parseInt(b.slice(1)),
);

for (let i = 0; i < vocabularyNumbers.length; i++) {
	const number = vocabularyNumbers[i];

	const word = {
		number: number,
		lexicalForm: dictionary[number].lemma?.trim(),
		transliteration: `/${dictionary[number].translit}/`,
		strongsDefinition: (
			(dictionary[number].derivation ?? "") + dictionary[number].strongs_def
		)
			.split(";")
			.map((line) => line.trim()),
		strongsKjvDefinition: dictionary[number].kjv_def,
		forms: [],
	};

	// Remove -- from the start of kjvDefinitions
	if (word.strongsKjvDefinition?.startsWith("--")) {
		word.strongsKjvDefinition = word.strongsKjvDefinition.slice(2);
	}

	data.vocabulary.push(word);

	if (word.transliteration === undefined) {
		addError(`Word ${word.number} is missing a transliteration`);
	}

	if (word.strongsDefinition === undefined) {
		addError(`Word ${word.number} is missing a Strong's definition`);
	}

	if (word.strongsKjvDefinition === undefined) {
		addError(`Word ${word.number} is missing a Strong's KJV Definition`);
	}
}

// Sort vocabulary

data.vocabulary.sort((a, b) =>
	a.lexicalForm
		.replaceAll(/[-"]/gu, "")
		.localeCompare(b.lexicalForm.replaceAll(/[-"]/gu, "")),
);

console.timeEnd("strongs");

export { data };
