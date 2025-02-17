import { html } from "uhtml";

import { components } from "../components.js";
import { constants } from "../constants.js";
import { utilities } from "../utilities.js";

export const page = {
	setup: (path) => {
		// Set up book and chapter indices

		pageData.updatePath = () => {
			utilities.setPath(
				`${path[0]}/${constants.newTestamentBooks[pageData.bookIndex].replaceAll(" ", "-")}/${pageData.chapterIndex + 1}`,
			);
		};

		pageData.updateBook = (bookIndex) => {
			pageData.bookIndex = bookIndex;
			pageData.chapterIndex = 0;

			pageData.updatePath();

			update();
		};

		pageData.updateChapter = (chapterIndex) => {
			pageData.chapterIndex = chapterIndex;

			pageData.updatePath();

			update();
		};

		pageData.bookIndex = Math.max(
			0,
			constants.newTestamentBooks.indexOf(path[1]?.replaceAll("-", " ")),
		);

		const chapter = Number.parseInt(path[2]);

		pageData.chapterIndex = Number.isNaN(chapter) ? 0 : chapter - 1;

		if (
			pageData.chapterIndex < 0 ||
			pageData.chapterIndex >
				constants.newTestament[pageData.bookIndex].length - 1
		) {
			pageData.chapterIndex = 0;
		}

		pageData.updatePath();

		// Set up word properties

		pageData.updateProperties = (event) => {
			const propertyIndices = [...event.target.selectedOptions].map(
				(option) => option.index,
			);

			pageData.showDescriptions = propertyIndices.includes(0);
			pageData.showGlosses = propertyIndices.includes(1);
			pageData.showLexicalForms = propertyIndices.includes(2);
			pageData.showPrincipalParts = propertyIndices.includes(3);
			pageData.showFrequencies = propertyIndices.includes(4);

			update();
		};

		pageData.showDescriptions = true;
		pageData.showGlosses = true;
		pageData.showLexicalForms = false;
		pageData.showPrincipalParts = false;
		pageData.showFrequencies = false;
	},

	content: () => {
		const chapterOptions = [];

		for (
			let i = 0;
			i < constants.newTestamentChapterCounts[pageData.bookIndex];
			i++
		) {
			chapterOptions.push(
				html`<option class = "medium-font" selected = ${pageData.chapterIndex === i}>${i + 1}</option>`,
			);
		}

		const verses = [];

		for (
			let i = 0;
			i <
			constants.newTestament[pageData.bookIndex][pageData.chapterIndex].length;
			i++
		) {
			const verse =
				constants.newTestament[pageData.bookIndex][pageData.chapterIndex][i];

			if (verse === null) {
				continue;
			}

			verses.push(html`<div class = "full-width flex-top-left flex-wrap small-gap">
					<p class = "small-font grayA">${i + 1}</p>
					
					${verse.map(
						(
							word,
						) => html`<div class = "parsed-word flex-column-top x-small-gap">
							<p class = "x-large-font">${word.text}</p>
							
							${
								word.word !== undefined &&
								(
									pageData.showDescriptions ||
										pageData.showGlosses ||
										pageData.showLexicalForms ||
										pageData.showPrincipalParts ||
										pageData.showFrequencies
								)
									? html`${
											pageData.showDescriptions && word.use !== undefined
												? html`<p class = "small-font grayA">${word.use.shortDescription}</p>`
												: null
										}
								
								${
									pageData.showGlosses
										? html`<div class = "flex-column">
										${word.word.glosses.map(
											(gloss) =>
												html`<p class = "small-font grayA">${gloss}</p>`,
										)}
									</div>`
										: null
								}
								
								${
									pageData.showLexicalForms
										? html`<a class = "small-font grayA" href = ${`#/word/${word.word.number}`}>${word.word.lexicalForm}</a>`
										: null
								}
								
								${
									pageData.showPrincipalParts &&
									word.word.principalParts !== undefined
										? html`<p class = "small-font grayA">${word.word.principalParts.map(
												(part, j) =>
													html`<span class = "small-font grayA" title = ${constants.principalParts[j]}>${part}</span>${j === 5 ? "" : ", "}`,
											)}</p>`
										: null
								}
								
								${
									pageData.showFrequencies
										? html`<div class = "flex-column">
										<p class = "small-font grayA" title = "Word">x${word.word.frequency.toLocaleString()}</p>
										<p class = "small-font grayA" title = "Form">x${word.form.frequency.toLocaleString()}</p>
										<p class = "small-font grayA" title = "Use">x${word.use.frequency.toLocaleString()}</p>
									</div>`
										: null
								}
							</div>`
									: null
							}`,
					)}
				</div>`);
		}

		return html`<div class = "page-container flex-column-top grow full-width full-height medium-gap medium-padding">
				<div id = "reader-input" class = "medium-width flex-top medium-gap">
					<select class = "full-width small-padding medium-font" oninput = "pageData.updateBook (this.selectedIndex)">
						${constants.newTestamentBooks.map(
							(book, i) =>
								html`<option class = "medium-font" selected = ${i === pageData.bookIndex}>${book}</option>`,
						)}
					</select>
					
					<select class = "full-width small-padding medium-font" oninput = "pageData.updateChapter (this.selectedIndex)">
						${chapterOptions}
					</select>
					
					${components.wordPropertySelector(pageData.updateProperties, pageData.showDescriptions, pageData.showGlosses, pageData.showLexicalForms, pageData.showPrincipalParts, pageData.showFrequencies)}
				</div>
				
				<div class = "large-width flex-top flex-wrap medium-gap">
					${verses}
				</div>
			</div>`;
	},
};
