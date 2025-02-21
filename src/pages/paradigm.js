import { html } from "uhtml";

import { constants } from "../constants.js";
import { utilities } from "../utilities.js";

export const page = {
	setup: (path) => {
		pageData.updateParadigm = (paradigmName) => {
			if (paradigmName !== undefined) {
				pageData.currentParadigmName = paradigmName;

				utilities.setPath(
					`${path[0]}/${pageData.currentParadigmName.replaceAll(" ", "_")}`,
				);
			}

			const paradigm =
				constants.paradigms[pageData.currentCategory][
					pageData.currentParadigmName
				];

			pageData.paradigm = {
				elementFontClass: paradigm.elementFontClass,
				rowLabels: paradigm.rowLabels,
				columnLabels: paradigm.columnLabels,
				elements: [],
			};

			for (let i = 0; i < paradigm.elements.length; i++) {
				pageData.paradigm.elements.push({
					text: paradigm.elements[i].text,
					underlined: paradigm.elements[i].underlined,
					// TODO remove after no paradigms use answered elements
					answered: paradigm.elements[i].answered,
				});
			}

			if (pageData.practiceMode) {
				// TODO uncomment after no paradigms use answered elements
				// PageData.remainingElements = pageData.paradigm.elements.slice (0);

				// TODO remove after no paradigms use answered elements
				pageData.remainingElements = [];

				for (let i = 0; i < pageData.paradigm.elements.length; i++) {
					if (!pageData.paradigm.elements[i].answered) {
						pageData.remainingElements.push(pageData.paradigm.elements[i]);
					}
				}
				// END TODO

				pageData.currentElement = utilities.randomElement(
					pageData.remainingElements,
				);
			} else {
				for (let i = 0; i < pageData.paradigm.elements.length; i++) {
					pageData.paradigm.elements[i].answered = true;
				}
			}

			update();
		};

		pageData.updateCategory = (category) => {
			pageData.currentCategory = category;

			pageData.updateParadigm(
				Object.keys(constants.paradigms[pageData.currentCategory])[0],
			);
		};

		pageData.togglePracticeMode = () => {
			pageData.practiceMode = !pageData.practiceMode;

			pageData.updateParadigm();
		};

		pageData.paradigmElementOnClick = (element) => {
			// If answer is correct
			if (
				pageData.currentElement.text === element.text &&
				pageData.currentElement.underlined === element.underlined
			) {
				element.answered = true;

				// Remove element from pageData.remainingElements
				pageData.remainingElements.splice(
					pageData.remainingElements.indexOf(element),
					1,
				);

				// Set incorrect to false for all remainingElements
				for (let i = 0; i < pageData.remainingElements.length; i++) {
					pageData.remainingElements[i].incorrect = false;
				}

				// If paradigm is complete
				if (pageData.remainingElements.length === 0) {
					pageData.updateParadigm();
				} else {
					pageData.currentElement = utilities.randomElement(
						pageData.remainingElements,
					);
				}
			} else {
				element.incorrect = true;
			}

			update();
		};

		pageData.practiceMode = false;

		const pathParadigm = path[1]?.replaceAll("_", " ");

		for (const category in constants.paradigms) {
			for (const paradigm in constants.paradigms[category]) {
				if (paradigm === pathParadigm) {
					pageData.currentCategory = category;
					pageData.updateParadigm(paradigm);

					return;
				}
			}
		}

		// If we didn't find a matching paradigm, use a default category and paradigm
		pageData.updateCategory(Object.keys(constants.paradigms)[0]);

		return false;
	},

	content:
		() => html`<div class = "page-container flex-column-top grow full-width full-height medium-gap medium-padding">
			<div class = "flex medium-gap">
				<select class = "small-padding medium-font" oninput = "pageData.updateCategory (this.value)">
					${Object.keys(constants.paradigms).map((category) => html`<option class = "medium-font" selected = ${pageData.currentCategory === category}>${category}</option>`)}
				</select>
				
				<select class = "small-padding medium-font" oninput = "pageData.updateParadigm (this.value)">
					${Object.keys(constants.paradigms[pageData.currentCategory]).map((paradigmName) => html`<option class = "medium-font" selected = ${pageData.currentParadigmName === paradigmName}>${paradigmName}</option>`)}
				</select>
				
				<button class = "full-height small-padding medium-font" onmousedown = ${pageData.togglePracticeMode}>${pageData.practiceMode ? "View" : "Practice"}</button>
			</div>
			
			<div class = "paradigm small-gap medium-padding" style = ${`grid-template-columns: repeat(${pageData.paradigm.columnLabels?.length ?? 2}, 1fr)`}>
				${pageData.paradigm.columnLabels?.map(
					(label) => html`<pre class = "medium-font">${label}</pre>`,
				)}
				
				${pageData.paradigm.rowLabels.map(
					(label) =>
						html`<pre class = "paradigm-row-label medium-font">${label}</pre>`,
				)}
				
				${pageData.paradigm.elements.map(
					(element) =>
						html`<button class = ${`paradigm-element flex ${pageData.paradigm.elementFontClass ?? "x-large-font"}${element.underlined ? " underlined" : ""}${element.answered ? " answered" : ""}`} disabled = ${element.incorrect} onmousedown = ${pageData.practiceMode ? () => pageData.paradigmElementOnClick(element) : null}>${element.answered ? element.text : null}</button>`,
				)}
			</div>
			
			${
				pageData.practiceMode
					? html`<p class = "x-large-font">Where does "<span class = ${pageData.currentElement.underlined ? "underlined" : null}>${pageData.currentElement.text}</span>" go?</p>`
					: null
			}
		</div>`,
};
