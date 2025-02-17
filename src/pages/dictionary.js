import { html } from "uhtml";

import { constants } from "../constants.js";
import { utilities } from "../utilities.js";

export const page = {
	setup: () => {
		pageData.updateCurrentVocabulary = (vocabulary) => {
			pageData.vocabularySections = [];

			let currentSection = {
				vocabulary: [],
			};

			for (let i = 0; i < vocabulary.length; i++) {
				let letter = vocabulary[i].lexicalForm[0];

				if (letter === "-" || letter === '"') {
					letter = vocabulary[i].lexicalForm[1];
				}

				letter = utilities.simplifyGreek(letter).toUpperCase();

				if (currentSection.letter === undefined) {
					currentSection.letter = letter;
				} else if (currentSection.letter !== letter) {
					pageData.vocabularySections.push(currentSection);

					currentSection = {
						letter: letter,

						vocabulary: [],
					};
				}

				currentSection.vocabulary.push(vocabulary[i]);
			}

			pageData.vocabularySections.push(currentSection);
		};

		pageData.search = (query) => {
			const vocabulary = [];

			const trimmedQuery = query.trim();
			const formattedQuery = trimmedQuery.toLowerCase();
			const parsedQuery = utilities.simplifyGreek(
				utilities.englishToGreek(formattedQuery),
			);

			const number = utilities.getNumber(trimmedQuery);

			for (let i = 0; i < constants.vocabulary.length; i++) {
				const word = constants.vocabulary[i];

				const dictionaryWord = {
					number: word.number,
					lexicalForm: word.lexicalForm,
				};

				if (number) {
					if (word.number.startsWith(number)) {
						dictionaryWord.subtitle = word.number;

						vocabulary.push(dictionaryWord);
					}

					continue;
				}

				if (word.simplifiedLexicalForm.includes(parsedQuery)) {
					vocabulary.push(dictionaryWord);
				} else if (word.simplifiedGlossesString.includes(formattedQuery)) {
					dictionaryWord.subtitle = word.glossesString;

					vocabulary.push(dictionaryWord);
				}
			}

			pageData.updateCurrentVocabulary(vocabulary);

			update();
		};

		pageData.updateCurrentVocabulary(
			constants.vocabulary.map((word) => ({
				number: word.number,
				lexicalForm: word.lexicalForm,
			})),
		);
	},

	content:
		() => html`<div class = "page-container flex-column-top grow full-width full-height">
			<div class = "medium-width flex medium-padding">
				<input id = "search-input" class = "full-width medium-font small-padding" placeholder = "Search by lexical form, number, or gloss..." oninput = "pageData.search (this.value)" />
			</div>
			
			<div class = "full-width flex-top flex-wrap">
				${pageData.vocabularySections.map(
					(
						vocabularySection,
					) => html`<div class = "section-group full-width flex-column large-gap large-padding">
						<p class = "medium-font">${vocabularySection.letter}</p>
						
						<div class = "flex flex-wrap x-large-gap">
							${vocabularySection.vocabulary.map(
								(word) =>
									html`<a class = "small-font grayA" href = ${`#/word/${word.number}`}>${word.lexicalForm + (word.subtitle === undefined ? "" : `: ${word.subtitle}`)}</a>`,
							)}
						</div>
					</div>`,
				)}
			</div>
		</div>`,
};
