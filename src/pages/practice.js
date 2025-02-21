import { html } from "uhtml";

import { constants } from "../constants.js";
import { utilities } from "../utilities.js";

export const page = {
	setup: () => {
		// Functions for all modes

		pageData.updateCurrentVocabulary = () => {
			pageData.currentVocabulary = [];

			for (let i = 0; i < pageData.currentSet.vocabulary.length; i++) {
				pageData.currentVocabulary.push(pageData.currentSet.vocabulary[i]);
			}

			if (pageData.currentVocabulary.length === 0) {
				pageData.noTerms = true;

				update();

				return;
			}

			pageData.noTerms = false;

			pageData.currentMode.setup();
		};

		pageData.updateMode = (modeName) => {
			pageData.currentModeName = modeName;

			pageData.currentMode = pageData.modes[modeName];

			pageData.updateCurrentVocabulary();
		};

		pageData.updateSet = (setName) => {
			pageData.currentSet = pageData.sets[setName];

			pageData.updateCurrentVocabulary();
		};

		// Modes
		pageData.modes = {
			Vocabulary: {
				body: () =>
					pageData.noTerms
						? null
						: html`<div class = "large-width flex">
						<div class = "full-width flex-column medium-gap">
							<p class = "xxx-large-font">${pageData.modes.Vocabulary.currentWord.lexicalForm}</p>
							
							<div class = "flex flex-wrap small-gap">
								${pageData.modes.Vocabulary.currentChoices.map(
									(choice) =>
										html`<button class = ${"small-padding medium-font text-left"} disabled = ${choice.incorrect} onmousedown = ${() => pageData.modes.Vocabulary.selectChoice(choice)}>${choice.word.glossesString}</button>`,
								)}
							</div>
						</div>
					</div>`,

				updateCurrentWord: () => {
					if (pageData.noTerms) {
						return;
					}

					if (pageData.remainingTerms.length === 0) {
						pageData.modes.Vocabulary.updateRemainingTerms();

						return;
					}

					const termIndex = utilities.randomInteger(
						0,
						pageData.remainingTerms.length - 1,
					);

					pageData.modes.Vocabulary.currentWord =
						pageData.remainingTerms[termIndex];

					pageData.remainingTerms.splice(termIndex, 1);

					// Shuffle pageData.currentVocabulary
					pageData.currentVocabulary.sort(() => Math.random() - 0.5);

					let choicesIncludesCurrentWord = false;

					// Add the first few elements of pageData.currentVocabulary to pageData.currentChoices
					pageData.modes.Vocabulary.currentChoices = pageData.currentVocabulary
						.slice(0, constants.practiceVocabularyChoiceCount)
						.map((word) => {
							if (word === pageData.modes.Vocabulary.currentWord) {
								choicesIncludesCurrentWord = true;
							}

							return {
								word: word,
							};
						});

					// If pageData.currentWord is not already in pageData.currentChoices
					if (!choicesIncludesCurrentWord) {
						// Replace a random element in pageData.currentChoices with pageData.currentWord
						pageData.modes.Vocabulary.currentChoices.splice(
							utilities.randomInteger(
								0,
								constants.practiceVocabularyChoiceCount - 1,
							),
							1,
							{
								word: pageData.modes.Vocabulary.currentWord,
							},
						);
					}

					update();
				},

				updateRemainingTerms: () => {
					pageData.remainingTerms = pageData.currentVocabulary.slice(0);

					pageData.modes.Vocabulary.updateCurrentWord();
				},

				selectChoice: (choice) => {
					if (
						choice.word.glossesString ===
						pageData.modes.Vocabulary.currentWord.glossesString
					) {
						pageData.modes.Vocabulary.updateCurrentWord();
					} else {
						choice.incorrect = true;

						update();
					}
				},
			},

			Parsing: {
				body: () =>
					pageData.noTerms
						? null
						: html`<div class = "medium-width flex-column medium-gap">
						<p class = "xxx-large-font">${pageData.modes.Parsing.currentForm.text}</p>
						
						<div class = "x-small-width flex-column medium-gap">
							${pageData.modes.Parsing.choiceSelectors.map(
								(
									choiceSelector,
								) => html`<select class = ${`choice-selector full-width small-padding medium-font${choiceSelector.chosen ? "" : " gray7"}${choiceSelector.incorrect ? " red-bg" : ""}`} oninput = ${(event) => pageData.modes.Parsing.updateChoiceSelector(choiceSelector, event.target)}>
									<option class = "medium-font gray7" value = "">${choiceSelector.useProperty.formattedName}</option>
									
									${choiceSelector.useProperty.values.map(
										(value) =>
											html`<option class = "medium-font" value = ${choiceSelector.useProperty.name === "lexicalForm" ? value : value.toLowerCase()}>${value}</option>`,
									)}
								</select>`,
							)}
						</div>
						
						<div class = "flex medium-gap">
							<button class = "small-padding medium-font" onmousedown = ${pageData.modes.Parsing.nextForm}>Skip</button>
							
							<button class = "small-padding medium-font" onmousedown = ${pageData.modes.Parsing.submit}>Submit</button>
						</div>
					</div>`,

				updateCurrentForm: () => {
					if (pageData.noTerms) {
						return;
					}

					if (pageData.remainingTerms.length === 0) {
						pageData.modes.Parsing.updateRemainingTerms();

						return;
					}

					const termIndex = utilities.randomInteger(
						0,
						pageData.remainingTerms.length - 1,
					);

					pageData.modes.Parsing.currentForm =
						pageData.remainingTerms[termIndex];

					pageData.remainingTerms.splice(termIndex, 1);

					pageData.modes.Parsing.choiceSelectors = [];

					const currentUseProperties = new Set();

					for (let i = 0; i < constants.formUseProperties.length; i++) {
						for (
							let j = 0;
							j < pageData.modes.Parsing.currentForm.uses.length;
							j++
						) {
							if (
								pageData.modes.Parsing.currentForm.uses[j][
									constants.formUseProperties[i].name
								] !== undefined
							) {
								currentUseProperties.add(constants.formUseProperties[i]);

								break;
							}
						}
					}

					for (const useProperty of currentUseProperties) {
						const choiceSelector = {
							useProperty: useProperty,
							correctChoices: new Set(),
						};

						for (
							let i = 0;
							i < pageData.modes.Parsing.currentForm.uses.length;
							i++
						) {
							if (
								pageData.modes.Parsing.currentForm.uses[i][useProperty.name] !==
								undefined
							) {
								choiceSelector.correctChoices.add(
									pageData.modes.Parsing.currentForm.uses[i][useProperty.name],
								);
							}
						}

						pageData.modes.Parsing.choiceSelectors.push(choiceSelector);
					}

					pageData.modes.Parsing.choiceSelectors.push({
						useProperty: {
							name: "lexicalForm",
							formattedName: "Lexical Form",
							values:
								pageData.modes.Parsing.forms[
									pageData.modes.Parsing.currentForm.lexicalForm
								],
						},

						correctChoices: new Set([
							pageData.modes.Parsing.currentForm.lexicalForm,
						]),
					});

					update();
				},

				updateRemainingTerms: () => {
					pageData.remainingTerms = [];

					for (let i = 0; i < pageData.currentVocabulary.length; i++) {
						for (
							let j = 0;
							j < pageData.currentVocabulary[i].forms.length;
							j++
						) {
							pageData.remainingTerms.push(
								pageData.currentVocabulary[i].forms[j],
							);
						}
					}

					pageData.modes.Parsing.updateCurrentForm();
				},

				updateChoiceSelector: (choiceSelector, choiceSelectorElement) => {
					pageData.modes.Parsing.selectedChoices[
						choiceSelector.useProperty.name
					] = choiceSelectorElement.value;

					choiceSelector.chosen = choiceSelectorElement.selectedIndex !== 0;

					update();
				},

				nextForm: () => {
					pageData.modes.Parsing.updateCurrentForm();

					pageData.modes.Parsing.selectedChoices = {};

					const choiceSelectorElements =
						document.getElementsByClassName("choice-selector");

					for (let i = 0; i < choiceSelectorElements.length; i++) {
						choiceSelectorElements[i].value = "";
					}
				},

				submit: () => {
					let allChoicesCorrect = true;

					for (
						let i = 0;
						i < pageData.modes.Parsing.choiceSelectors.length;
						i++
					) {
						if (
							pageData.modes.Parsing.choiceSelectors[i].correctChoices.has(
								pageData.modes.Parsing.selectedChoices[
									pageData.modes.Parsing.choiceSelectors[i].useProperty.name
								],
							)
						) {
							pageData.modes.Parsing.choiceSelectors[i].incorrect = false;
						} else {
							pageData.modes.Parsing.choiceSelectors[i].incorrect = true;

							allChoicesCorrect = false;
						}
					}

					if (allChoicesCorrect) {
						pageData.modes.Parsing.nextForm();
					} else {
						update();
					}
				},

				selectedChoices: {},

				forms: {},
			},
		};

		// Sets
		pageData.sets = {
			All: {
				vocabulary: constants.vocabulary.slice(0),
			},

			"Frequency ≥ 50": {
				vocabulary: constants.vocabulary
					.slice(0)
					.filter((word) => word.frequency >= 50),
			},

			"Verbs with frequency ≥ 50": {
				vocabulary: constants.vocabulary
					.slice(0)
					.filter(
						(word) =>
							word.frequency >= 50 &&
							word.forms.find(
								(form) =>
									form.uses.find((use) => use.partOfSpeech === "verb") !==
									undefined,
							) !== undefined,
					),
			},

			Prepositions: {
				vocabulary: constants.vocabulary
					.slice(0)
					.filter(
						(word) =>
							word.forms.find(
								(form) =>
									form.uses.find(
										(use) => use.partOfSpeech === "preposition",
									) !== undefined,
							) !== undefined,
					),
			},

			"Adverbs, Conjunctions, Particles, and Interjections": {
				vocabulary: constants.vocabulary
					.slice(0)
					.filter(
						(word) =>
							word.forms.find(
								(form) =>
									form.uses.find(
										(use) =>
											use.partOfSpeech === "adverb" ||
											use.partOfSpeech === "conjunction" ||
											use.partOfSpeech === "particle" ||
											use.partOfSpeech === "interjection",
									) !== undefined,
							) !== undefined,
					),
			},

			Verbs: {
				vocabulary: constants.vocabulary
					.slice(0)
					.filter(
						(word) =>
							word.forms.find(
								(form) =>
									form.uses.find((use) => use.partOfSpeech === "verb") !==
									undefined,
							) !== undefined,
					),
			},

			"Present Indicative Verbs": {
				vocabulary: [],
			},

			"Future Indicative Verbs": {
				vocabulary: [],
			},
		};

		pageData.setNames = Object.keys(pageData.sets);

		// Setup for modes

		pageData.modes.Vocabulary.setup =
			pageData.modes.Vocabulary.updateRemainingTerms;
		pageData.modes.Parsing.setup = pageData.modes.Parsing.updateRemainingTerms;

		pageData.modeNames = Object.keys(pageData.modes);

		pageData.currentModeName = pageData.modeNames[0];
		pageData.currentMode = pageData.modes[pageData.currentModeName];

		// Parsing: map lexicalForms to a list of form texts used by the word
		for (let i = 0; i < constants.vocabulary.length; i++) {
			const formTexts = [];

			let formTextsIncludesLexicalForm = false;

			for (let j = 0; j < constants.vocabulary[i].forms.length; j++) {
				// Add a lexicalForm reference to each form
				constants.vocabulary[i].forms[j].lexicalForm =
					constants.vocabulary[i].lexicalForm;

				// Add the text of each form to formTexts
				formTexts.push(constants.vocabulary[i].forms[j].text);

				if (
					constants.vocabulary[i].forms[j].text ===
					constants.vocabulary[i].forms[j].lexicalForm
				) {
					formTextsIncludesLexicalForm = true;
				}
			}

			if (!formTextsIncludesLexicalForm) {
				formTexts.push(constants.vocabulary[i].lexicalForm);
			}

			// Sort formTexts
			formTexts.sort();

			// Map this lexicalForm to formTexts
			pageData.modes.Parsing.forms[constants.vocabulary[i].lexicalForm] =
				formTexts;
		}

		// Setup for sets

		pageData.currentSet = pageData.sets.All;

		// Populate sets
		for (let i = 0; i < constants.vocabulary.length; i++) {
			// Present Indicative Verbs set
			if (
				constants.vocabulary[i].forms.find(
					(form) =>
						form.uses.find(
							(use) => use.tense === "present" && use.mood === "indicative",
						) !== undefined,
				) !== undefined
			) {
				const word = {
					lexicalForm: constants.vocabulary[i].lexicalForm,
					glossesString: constants.vocabulary[i].glossesString,
					forms: constants.vocabulary[i].forms.filter(
						(form) =>
							form.uses.find(
								(use) => use.tense === "present" && use.mood === "indicative",
							) !== undefined,
					),
				};

				for (let j = 0; j < word.forms.length; j++) {
					word.forms[j] = {
						text: word.forms[j].text,
						uses: word.forms[j].uses.filter(
							(use) => use.tense === "present" && use.mood === "indicative",
						),
						lexicalForm: constants.vocabulary[i].lexicalForm,
					};
				}

				pageData.sets["Present Indicative Verbs"].vocabulary.push(word);
			}

			// Future Indicative Verbs set
			if (
				constants.vocabulary[i].forms.find(
					(form) =>
						form.uses.find(
							(use) => use.tense === "future" && use.mood === "indicative",
						) !== undefined,
				) !== undefined
			) {
				const word = {
					lexicalForm: constants.vocabulary[i].lexicalForm,
					glossesString: constants.vocabulary[i].glossesString,
					forms: constants.vocabulary[i].forms.filter(
						(form) =>
							form.uses.find(
								(use) => use.tense === "future" && use.mood === "indicative",
							) !== undefined,
					),
				};

				for (let j = 0; j < word.forms.length; j++) {
					word.forms[j] = {
						text: word.forms[j].text,
						uses: word.forms[j].uses.filter(
							(use) => use.tense === "future" && use.mood === "indicative",
						),
						lexicalForm: constants.vocabulary[i].lexicalForm,
					};
				}

				pageData.sets["Future Indicative Verbs"].vocabulary.push(word);
			}
		}

		// Setup for all modes

		pageData.noTerms = false;

		pageData.updateCurrentVocabulary();
	},

	content:
		() => html`<div class = "page-container center-container grid-top full-width full-height medium-padding medium-gap xx-large-gap">
			<div class = "small-width flex-column medium-gap" }>
				<div class = "full-width flex-top medium-gap">
					<div class = "full-height flex-column-top grow small-gap">
						<p class = "medium-font">Practice</p>
						
						<select class = "full-width small-padding medium-font" oninput = "pageData.updateMode (this.value)">
							${pageData.modeNames.map(
								(modeName) =>
									html`<option class = "medium-font">${modeName}</option>`,
							)}
						</select>
					</div>
					
					<div class = "full-height flex-column-top grow small-gap">
						<p class = "medium-font">Set</p>
						
						<select class = "full-width small-padding medium-font" oninput = "pageData.updateSet (this.value)">
							${pageData.setNames.map(
								(name) => html`<option class = "medium-font">${name}</option>`,
							)}
						</select>
					</div>
				</div>
				
				${
					pageData.noTerms
						? html`<p class = "small-font">No terms match the current filters</p>`
						: html`<p class = "small-font">Remaining terms: ${(pageData.remainingTerms.length + 1).toLocaleString()}</p>`
				}
			</div>
			
			${pageData.currentMode.body()}
		</div>`,
};
