import { html } from "uhtml";

import { components } from "../components.js";
import { constants } from "../constants.js";
import { utilities } from "../utilities.js";

export const page = {
	setup: () => {
		pageData.parse = (input) => {
			pageData.formGroups = [];
			pageData.selectedOptions = [];

			if (input.length > 0) {
				const inputWords = input
					.trim()
					.split(" ")
					.map((inputWord) => utilities.englishToGreek(inputWord.trim()));

				for (let i = 0; i < inputWords.length; i++) {
					const inputWord = inputWords[i];
					const simplifiedInputWord = utilities.simplifyGreek(inputWord);

					let matchedForms = constants.vocabularyFormsMap[simplifiedInputWord];

					if (matchedForms === undefined) {
						matchedForms = [
							{
								text: inputWord,
							},
						];
					}

					// If multiple forms were matched, try to find exact matches
					// Don't try to find an exact match for inputWords that are simplified
					else if (
						matchedForms.length > 1 &&
						inputWord !== simplifiedInputWord
					) {
						const exactlyMatchedForms = [];

						const formattedInputWord = utilities.isolateGreek(
							utilities.oxiaToTonos(inputWord),
						);

						for (let j = 0; j < matchedForms.length; j++) {
							if (formattedInputWord === matchedForms[j].text) {
								exactlyMatchedForms.push(matchedForms[j]);
							}
						}

						if (exactlyMatchedForms.length > 0) {
							matchedForms = exactlyMatchedForms;
						}
					}

					pageData.formGroups.push(matchedForms);

					pageData.selectedOptions.push({
						formIndex: 0,
						useIndex: 0,
					});
				}
			}

			update();
		};

		pageData.updateProperties = (event) => {
			const propertyIndices = [...event.target.selectedOptions].map(
				(option) => option.index,
			);

			pageData.showDescriptions = propertyIndices.includes(0);
			pageData.showGlosses = propertyIndices.includes(1);
			pageData.showLexicalForms = propertyIndices.includes(2);
			pageData.showPrincipalParts = propertyIndices.includes(3);
			pageData.showFrequencies = propertyIndices.includes(4);

			for (let i = 0; i < pageData.selectedOptions.length; i++) {
				pageData.selectedOptions[i].useIndex = 0;
			}

			update();
		};

		pageData.swapForm = (formGroupIndex) => {
			pageData.selectedOptions[formGroupIndex].formIndex += 1;

			if (
				pageData.selectedOptions[formGroupIndex].formIndex >
				pageData.formGroups[formGroupIndex].length - 1
			) {
				pageData.selectedOptions[formGroupIndex].formIndex = 0;
			}

			pageData.selectedOptions[formGroupIndex].useIndex = 0;

			update();
		};

		pageData.swapUse = (formGroupIndex) => {
			pageData.selectedOptions[formGroupIndex].useIndex += 1;

			if (
				pageData.selectedOptions[formGroupIndex].useIndex >
				pageData.formGroups[formGroupIndex][
					pageData.selectedOptions[formGroupIndex].formIndex
				].uses.length -
					1
			) {
				pageData.selectedOptions[formGroupIndex].useIndex = 0;
			}

			update();
		};

		pageData.formGroups = [];

		pageData.showDescriptions = true;
		pageData.showGlosses = true;
		pageData.showLexicalForms = true;
		pageData.showPrincipalParts = true;
		pageData.showFrequencies = true;

		pageData.selectedOptions = [];
	},

	content:
		() => html`<div class = "page-container flex-column-top grow full-width full-height medium-gap medium-padding">
			<div id = "parser-input" class = "medium-width medium-gap">
				<textarea class = "small-padding medium-font" placeholder = "Enter Greek..." oninput = "pageData.parse (this.value)" />
				
				${components.wordPropertySelector(pageData.updateProperties, pageData.showDescriptions, pageData.showGlosses, pageData.showLexicalForms, pageData.showPrincipalParts, pageData.showFrequencies)}
			</div>
			
			<div class = "large-width flex-top flex-wrap medium-gap">
				${pageData.formGroups.map((formGroup, formGroupIndex) => {
					const form =
						formGroup[pageData.selectedOptions[formGroupIndex].formIndex];

					return html`<div class = "parsed-word flex-column-top x-small-gap">
							${
								formGroup.length > 1
									? html`<p class = "x-large-font parser-swappable-option" onclick = ${() => pageData.swapForm(formGroupIndex)}>${form.text}</p>`
									: html`<p class = "x-large-font">${form.text}</p>`
							}
							
							${
								form.word !== undefined &&
								(
									pageData.showDescriptions ||
										pageData.showGlosses ||
										pageData.showLexicalForms ||
										pageData.showPrincipalParts ||
										pageData.showFrequencies
								)
									? html`<div class = "flex-column small-gap">
									${
										form.uses === undefined || !pageData.showDescriptions
											? null
											: form.uses.length > 1
												? html`<p class = "small-font grayA parser-swappable-option" onclick = ${() => pageData.swapUse(formGroupIndex)}>${form.uses[pageData.selectedOptions[formGroupIndex].useIndex].shortDescription}</p>`
												: html`<p class = "small-font grayA">${form.uses[0].shortDescription}</p>`
									}
									
									${
										pageData.showGlosses
											? html`<div class = "flex-column">
											${form.word.glosses.map(
												(gloss) =>
													html`<p class = "small-font grayA">${gloss}</p>`,
											)}
										</div>`
											: null
									}
									
									${
										pageData.showLexicalForms
											? html`<a class = "small-font grayA" href = ${`#/word/${form.word.number}`}>${form.word.lexicalForm}</a>`
											: null
									}
									
									${
										pageData.showPrincipalParts &&
										form.word.principalParts !== undefined
											? html`<p class = "small-font grayA">${form.word.principalParts.map(
													(part, j) =>
														html`<span class = "small-font grayA" title = ${constants.principalParts[j]}>${part}</span>${j === 5 ? "" : ", "}`,
												)}</p>`
											: null
									}
									
									${
										pageData.showFrequencies && form.frequency !== undefined
											? html`<div class = "flex-column">
											<p class = "small-font grayA" title = "Word">x${form.word.frequency.toLocaleString()}</p>
											<p class = "small-font grayA" title = "Form">x${form.frequency.toLocaleString()}</p>
											<p class = "small-font grayA" title = "Use">x${form.uses[pageData.selectedOptions[formGroupIndex].useIndex].frequency.toLocaleString()}</p>
										</div>`
											: null
									}
								</div>`
									: null
							}
						</div>`;
				})}
			</div>
		</div>`,
};
