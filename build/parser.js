import lemmaMappings from "./lemma-mappings";
import morphGnt from "./morphgnt";
import step from "./step";
import strongs from "./strongs";
import utilities from "./utilities";

console.time("parser");

// Final data to output to the data file
let outputData = {
	errors: new Set(),
	vocabulary: strongs.data.vocabulary,
	newTestament: morphGnt.data.newTestament,
};

const addError = (error) => outputData.errors.add(error);

// Add errors from sources
outputData.errors = outputData.errors
	.union(morphGnt.data.errors)
	.union(step.data.errors)
	.union(strongs.data.errors);

// Add STEPBible data to vocabulary
for (let i = 0; i < outputData.vocabulary.length; i++) {
	const word = outputData.vocabulary[i];

	outputData.vocabulary[i] = {
		...word,
		// STEPBible data will overwrite any duplicate fields
		...step.data.vocabulary[word.number],
	};
}

// Map of lexical form -> array of matching words
const lexicalFormVocabularyMap = {};
// Map of Strong's number -> word
const strongsNumberVocabularyMap = {};

// Populate lexicalFormMap and strongsNumberMap
for (let i = 0; i < outputData.vocabulary.length; i++) {
	const word = outputData.vocabulary[i];

	if (lexicalFormVocabularyMap[word.lexicalForm] === undefined) {
		lexicalFormVocabularyMap[word.lexicalForm] = [];
	}

	lexicalFormVocabularyMap[word.lexicalForm].push(word);

	// TODO what if multiple words have the same Strong's number?
	strongsNumberVocabularyMap[word.number] = word;
}

for (const lexicalForm in morphGnt.data.vocabulary) {
	const morphGntWord = morphGnt.data.vocabulary[lexicalForm];

	const lemmaMapping =
		lemmaMappings.data.lexicalFormVocabularyMap[morphGntWord.lexicalForm];

	if (lemmaMapping === undefined) {
		addError(`Lexical form "${lexicalForm}" doesn't have a Strong's number`);

		continue;
	}

	// If there are multiple Strong's numbers for this lexical form
	if (lemmaMapping.numbers.length > 1) {
		addError(
			`Lexical form "${lexicalForm}" has multiple Strong's numbers: ${lemmaMapping.numbers.join(", ")}`,
		);
	}

	for (let j = 0; j < lemmaMapping.numbers.length; j++) {
		const number = lemmaMapping.numbers[j];

		// If there are multiple lexical forms for this Strong's number (since forms have already been added)
		if (strongsNumberVocabularyMap[number].forms.length > 0) {
			addError(`Word ${number} has multiple lexical forms`);
		}

		const matchingWords = lexicalFormVocabularyMap[morphGntWord.lexicalForm];

		if (matchingWords !== undefined) {
			for (let k = 0; k < matchingWords.length; k++) {
				// If this word's lexical form appears in outputData.vocabulary with a different Strong's number
				// TODO vice versa?
				if (matchingWords[k].number !== number) {
					addError(
						`Word "${morphGntWord.lexicalForm}"'s Strong's numbers are ${matchingWords
							.map((word) => word.number)
							.join(
								", ",
							)} according to lexicalFormVocabularyMap, but are ${lemmaMapping.numbers.join(
							", ",
						)} according to lemmaMappings`,
					);
				}
			}
		}

		// Assign the forms and principal parts of words based on matching Strong's numbers
		strongsNumberVocabularyMap[number].forms = strongsNumberVocabularyMap[
			number
		].forms.concat(morphGntWord.forms);

		strongsNumberVocabularyMap[number].principalParts =
			morphGntWord.principalParts;

		// TODO Set multiple indices when there are two numbers for a lexical form
		// Set vocabularyIndex so that forms can be mapped to words in the main vocabulary array (used below for the New Testament words)
		morphGntWord.vocabularyIndex = outputData.vocabulary.indexOf(
			strongsNumberVocabularyMap[number],
		);
	}
}

// Set word, form, and use indices for newTestament
for (let i = 0; i < outputData.newTestament.length; i++) {
	const book = outputData.newTestament[i];

	for (let j = 0; j < book.length; j++) {
		const chapter = book[j];

		for (let k = 0; k < chapter.length; k++) {
			const verse = chapter[k];

			if (verse === undefined) {
				continue;
			}

			for (let l = 0; l < verse.length; l++) {
				const word = verse[l];

				word.indices = [
					word.word.vocabularyIndex,
					word.word.forms.indexOf(word.form),
					word.form.uses.indexOf(word.use),
				];
			}
		}
	}
}

for (let i = 0; i < outputData.vocabulary.length; i++) {
	const word = outputData.vocabulary[i];

	if (word.forms.length === 0) {
		addError(`Word ${word.number} has no forms`);
	}

	for (let j = 0; j < word.forms.length; j++) {
		// Remove redundant data
		word.forms[j].lexicalForm = undefined;
	}
}

// Remove redundant data
for (let i = 0; i < outputData.newTestament.length; i++) {
	const book = outputData.newTestament[i];

	for (let j = 0; j < book.length; j++) {
		const chapter = book[j];

		for (let k = 0; k < chapter.length; k++) {
			const verse = chapter[k];

			if (verse === undefined) {
				continue;
			}

			for (let l = 0; l < verse.length; l++) {
				const word = verse[l];

				word.use = undefined;
				word.word = undefined;
				word.form = undefined;
				word.use = undefined;
			}
		}
	}
}

// Change errors to an array
outputData.errors = [...outputData.errors];

// Sort errors
outputData.errors.sort();

outputData = JSON.parse(utilities.oxiaToTonos(JSON.stringify(outputData)));

console.timeEnd("parser");

console.log(`Error count: ${outputData.errors.length.toLocaleString()}`);

const outputDataKeys = Object.keys(outputData);

console.log(
	`Data size: ${(new Blob([JSON.stringify(outputData)]).size / 1_000_000).toLocaleString()}MB (${outputDataKeys
		.map(
			(key) =>
				`${key} ${(
					new Blob([JSON.stringify(outputData[key])]).size / 1_000_000
				).toLocaleString()}MB`,
		)
		.join(", ")})`,
);

export default {
	data: outputData,
};
