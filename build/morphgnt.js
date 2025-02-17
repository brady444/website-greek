import fs from "node:fs";
import path from "node:path";

import { constants } from "./constants.js";
import { utilities } from "./utilities.js";

console.time("morphgnt");

const data = {
	// Map of lexicalForm -> word
	vocabulary: {},
	newTestament: [],
	errors: new Set(),
};

const addError = (error) => data.errors.add(error);

const getFormUse = (formText, partOfSpeech, parsingCode) => {
	const use = {
		frequency: 1,
	};

	switch (partOfSpeech) {
		case "A-": {
			use.partOfSpeech = "adjective";

			break;
		}

		case "C-": {
			use.partOfSpeech = "conjunction";

			break;
		}

		case "D-": {
			use.partOfSpeech = "adverb";

			break;
		}

		case "I-": {
			use.partOfSpeech = "interjection";

			break;
		}

		case "N-": {
			use.partOfSpeech = "noun";

			break;
		}

		case "P-": {
			use.partOfSpeech = "preposition";

			break;
		}

		case "RA": {
			use.partOfSpeech = "definite article";

			break;
		}

		case "RD": {
			use.partOfSpeech = "demonstrative pronoun";

			break;
		}

		case "RI": {
			use.partOfSpeech = "interrogative/indefinite pronoun";

			break;
		}

		case "RP": {
			use.partOfSpeech = "personal pronoun";

			break;
		}

		case "RR": {
			use.partOfSpeech = "relative pronoun";

			break;
		}

		case "V-": {
			use.partOfSpeech = "verb";

			break;
		}

		case "X-": {
			use.partOfSpeech = "particle";

			break;
		}

		default: {
			addError(
				`Form "${formText}" has an invalid partOfSpeech "${partOfSpeech}`,
			);
		}
	}

	switch (parsingCode[0]) {
		case "-": {
			break;
		}

		case "1": {
			use.person = "1st";

			break;
		}

		case "2": {
			use.person = "2nd";

			break;
		}

		case "3": {
			use.person = "3rd";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid person "${parsingCode[0]}`);
		}
	}

	switch (parsingCode[1]) {
		case "-": {
			break;
		}

		case "P": {
			use.tense = "present";

			break;
		}

		case "I": {
			use.tense = "imperfect";

			break;
		}

		case "F": {
			use.tense = "future";

			break;
		}

		case "A": {
			use.tense = "aorist";

			break;
		}

		case "X": {
			use.tense = "perfect";

			break;
		}

		case "Y": {
			use.tense = "pluperfect";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid tense "${parsingCode[1]}`);
		}
	}

	switch (parsingCode[2]) {
		case "-": {
			break;
		}

		case "A": {
			use.voice = "active";

			break;
		}

		case "M": {
			use.voice = "middle";

			break;
		}

		case "P": {
			use.voice = "passive";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid voice "${parsingCode[2]}`);
		}
	}

	switch (parsingCode[3]) {
		case "-": {
			break;
		}

		case "I": {
			use.mood = "indicative";

			break;
		}

		case "D": {
			use.mood = "imperative";

			break;
		}

		case "S": {
			use.mood = "subjunctive";

			break;
		}

		case "O": {
			use.mood = "optative";

			break;
		}

		case "N": {
			use.mood = "infinitive";

			break;
		}

		case "P": {
			use.mood = "participle";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid mood "${parsingCode[3]}`);
		}
	}

	switch (parsingCode[4]) {
		case "-": {
			break;
		}

		case "N": {
			use.case = "nominative";

			break;
		}

		case "G": {
			use.case = "genitive";

			break;
		}

		case "D": {
			use.case = "dative";

			break;
		}

		case "A": {
			use.case = "accusative";

			break;
		}

		case "V": {
			use.case = "vocative";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid case "${parsingCode[4]}`);
		}
	}

	switch (parsingCode[5]) {
		case "-": {
			break;
		}

		case "S": {
			use.number = "singular";

			break;
		}

		case "P": {
			use.number = "plural";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid number "${parsingCode[5]}`);
		}
	}

	switch (parsingCode[6]) {
		case "-": {
			break;
		}

		case "M": {
			use.gender = "masculine";

			break;
		}

		case "F": {
			use.gender = "feminine";

			break;
		}

		case "N": {
			use.gender = "neuter";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid gender "${parsingCode[6]}`);
		}
	}

	switch (parsingCode[7]) {
		case "-": {
			break;
		}

		case "C": {
			use.degree = "comparative";

			break;
		}

		case "S": {
			use.degree = "superlative";

			break;
		}

		default: {
			addError(`Form "${formText}" has an invalid degree "${parsingCode[7]}`);
		}
	}

	return use;
};

const propertyKeys = Object.keys(constants.formUseProperties);
const propertyValues = Object.values(constants.formUseProperties);

const sortFormUses = (a, b) => {
	for (let i = 0; i < propertyKeys.length; i++) {
		const aIndex = propertyValues[i].indexOf(a[propertyKeys[i]]);
		const bIndex = propertyValues[i].indexOf(b[propertyKeys[i]]);

		if (aIndex !== -1 && bIndex === -1) {
			return -1;
		}

		if (aIndex === -1 && bIndex !== -1) {
			return 1;
		}

		if (aIndex < bIndex) {
			return -1;
		}

		if (aIndex > bIndex) {
			return 1;
		}
	}

	return 0;
};

const approximatePrincipalPart = (formText, use) => {
	const endingCategories =
		constants.personalEndings[
			use.tense === "present" || use.tense === "future"
				? "primary"
				: "secondary"
		][use.person][use.voice];

	for (let i = 0; i < endingCategories.length; i++) {
		const endingGroup = endingCategories[i];

		for (let j = 0; j < endingGroup.endings.length; j++) {
			if (formText.endsWith(endingGroup.endings[j])) {
				return `[${formText.slice(0, -endingGroup.endings[j].length)}${endingGroup.firstSingular}]`;
			}
		}
	}

	return `[${formText}]`;
};

const getPrincipalParts = (word) => {
	// Return undefined if the word is never used as a verb
	if (
		!word.forms.some((form) =>
			form.uses.some((use) => use.partOfSpeech === "verb"),
		)
	) {
		return undefined;
	}

	const principalParts = [
		{
			text: "-",
		},

		{
			text: "-",
		},

		{
			text: "-",
		},

		{
			text: "-",
		},

		{
			text: "-",
		},

		{
			text: "-",
		},
	];

	for (let j = 0; j < word.forms.length; j++) {
		const form = word.forms[j];

		for (let k = 0; k < form.uses.length; k++) {
			const use = form.uses[k];

			if (use.partOfSpeech !== "verb") {
				continue;
			}

			if (use.mood !== "indicative") {
				continue;
			}

			// Assign partIndex based on tense and voice of the current use

			let partIndex;

			// Present
			if (use.tense === "present") {
				partIndex = 0;
			}

			// Future Active/Middle
			else if (use.tense === "future" && use.voice !== "passive") {
				partIndex = 1;
			}

			// Aorist Active/Middle
			else if (use.tense === "aorist" && use.voice !== "passive") {
				partIndex = 2;
			}

			// Perfect Active
			else if (use.tense === "perfect" && use.voice === "active") {
				partIndex = 3;
			}

			// Perfect Middle/Passive
			else if (use.tense === "perfect" && use.voice !== "active") {
				partIndex = 4;
			}

			// Aorist Passive
			else if (use.tense === "aorist" && use.voice === "passive") {
				partIndex = 5;
			}

			// If this use doesn't match any parts
			else {
				continue;
			}

			const currentPart = principalParts[partIndex];

			const isPartSet = currentPart.text !== "-";
			const isPartApproximated = currentPart.text[0] === "[";

			// Don't overwrite non-approximated parts
			if (isPartSet && !isPartApproximated) {
				continue;
			}

			// If this use is 1st person singular, set the part without approximating
			if (use.person === "1st" && use.number === "singular") {
				principalParts[partIndex] = {
					text: form.text,
					voice: use.voice,
				};

				continue;
			}

			// Don't overwrite the part if the current use has a lower voice
			if (
				(currentPart.voice === "active" && use.voice !== "active") ||
				(currentPart.voice === "middle" && use.voice === "passive")
			) {
				continue;
			}

			// Approximate the part
			const approximatedPart = approximatePrincipalPart(form.text, use);

			// If this is present tense, and the form is different from the lexical form
			if (partIndex === 0 && approximatedPart !== `[${word.lexicalForm}]`) {
				addError(
					`Lexical form "${word.lexicalForm}" has an approximated present principal part "${approximatedPart}" that is different from its lexical form`,
				);
			}

			// If the approximatedPrincipalPart is the same as form.text (meaning its ending is probably missing from constants.personalEndings)
			if (approximatedPart === `[${form.text}]`) {
				addError(
					`Lexical form "${word.lexicalForm}" has an approximated principal part that is the same as a non-first person singular form, part: "${approximatedPart}"`,
				);
			}

			// If the principal part was already approximated and the new approximation differs
			if (isPartApproximated && currentPart.text !== approximatedPart) {
				addError(
					`Lexical form "${word.lexicalForm}" has multiple approximations for the same principal part, index: ${partIndex}, parts: "${currentPart.text}, ${approximatedPart}"`,
				);
			}

			principalParts[partIndex] = {
				text: approximatedPart,
				voice: use.voice,
			};
		}
	}

	return principalParts.map((part) => part.text);
};

// Map of simplifiedFormText -> list of matching forms, used to check if a certain form already exists
// A simple array of forms is too slow to look through
const existingFormsMap = {};

const files = fs.readdirSync(constants.morphGntPath);

let lines = [];

// Add all the lines from each file to the lines array
for (let i = 0; i < files.length; i++) {
	// Exclude README.md
	if (files[i] === "README.md") {
		continue;
	}

	// Exclude the last line since it's empty
	lines = lines.concat(
		utilities
			.oxiaToTonos(
				fs.readFileSync(path.join(constants.morphGntPath, files[i]), "utf8"),
			)
			.split("\n")
			.slice(0, -1),
	);
}

for (let i = 0; i < lines.length; i++) {
	const columns = lines[i].split(" ");

	const location = columns[0];
	const partOfSpeech = columns[1];
	const parsingCode = columns[2];
	const text = columns[3];
	// const formText = columns [4];
	const normalizedFormText = columns[5];
	const simplifiedFormText = utilities.simplifyGreek(normalizedFormText);
	const lexicalForm = columns[6];

	const book = Number.parseInt(location.slice(0, 2));
	const chapter = Number.parseInt(location.slice(2, 4));
	const verse = Number.parseInt(location.slice(4, 6));

	const bookIndex = book - 1;
	const chapterIndex = chapter - 1;
	const verseIndex = verse - 1;

	// Populate vocabulary

	if (data.vocabulary[lexicalForm] === undefined) {
		data.vocabulary[lexicalForm] = {
			lexicalForm: lexicalForm,
			forms: [],
		};
	}

	const word = data.vocabulary[lexicalForm];

	// Populate word.forms

	let use = getFormUse(normalizedFormText, partOfSpeech, parsingCode);

	let form = {
		text: normalizedFormText,
		lexicalForm: lexicalForm,
		uses: [use],
	};

	let existingForm;

	const matchingForms = existingFormsMap[simplifiedFormText];

	if (matchingForms) {
		for (let j = 0; j < matchingForms.length; j++) {
			if (
				form.text === matchingForms[j].text &&
				form.lexicalForm === matchingForms[j].lexicalForm
			) {
				existingForm = matchingForms[j];

				break;
			}
		}
	}

	// If the form already exists
	if (existingForm) {
		form = existingForm;

		const existingUse = form.uses.find(
			(existingUse) =>
				existingUse.person === use.person &&
				existingUse.tense === use.tense &&
				existingUse.voice === use.voice &&
				existingUse.mood === use.mood &&
				existingUse.case === use.case &&
				existingUse.number === use.number &&
				existingUse.gender === use.gender &&
				existingUse.degree === use.degree &&
				existingUse.partOfSpeech === use.partOfSpeech,
		);

		// If the use already exists
		if (existingUse) {
			use = existingUse;

			use.frequency++;
		}

		// If the use doesn't already exist
		else {
			form.uses.push(use);
		}
	}

	// If the form doesn't already exist
	else {
		if (existingFormsMap[simplifiedFormText] === undefined) {
			existingFormsMap[simplifiedFormText] = [];
		}

		existingFormsMap[simplifiedFormText].push(form);

		word.forms.push(form);
	}

	// Populate newTestament

	if (data.newTestament[bookIndex] === undefined) {
		data.newTestament[bookIndex] = [];
	}

	if (data.newTestament[bookIndex][chapterIndex] === undefined) {
		data.newTestament[bookIndex][chapterIndex] = [];
	}

	if (data.newTestament[bookIndex][chapterIndex][verseIndex] === undefined) {
		data.newTestament[bookIndex][chapterIndex][verseIndex] = [];
	}

	data.newTestament[bookIndex][chapterIndex][verseIndex].push({
		text: text,
		word: word,
		form: form,
		use: use,
	});
}

for (const lexicalForm in data.vocabulary) {
	const word = data.vocabulary[lexicalForm];

	// Sort uses
	for (let j = 0; j < word.forms.length; j++) {
		word.forms[j].uses.sort(sortFormUses);
	}

	// Sort forms
	word.forms.sort((a, b) => sortFormUses(a.uses[0], b.uses[0]));

	// Set principal parts
	word.principalParts = getPrincipalParts(word);
}

console.timeEnd("morphgnt");

export { data };
