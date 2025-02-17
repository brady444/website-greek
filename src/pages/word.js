import { html } from "uhtml";

import { constants } from "../constants.js";

export const page = {
	setup: (path) => {
		pageData.word = constants.vocabularyNumberMap[path[1]];

		if (pageData.word === undefined) {
			navigate("dictionary");

			return false;
		}
	},

	content:
		() => html`<div class = "page-container flex-top grow full-width full-height xx-large-gap medium-padding">
			<div class = "word-container flex-column-left medium-gap">
				<p class = "xx-large-font">${pageData.word.lexicalForm}</p>
				
				<p class = "small-font">${pageData.word.number}</p>
				
				<p class = "small-font">${pageData.word.transliteration}</p>
				
				${
					pageData.word.principalParts
						? html`<p class = "small-font">${pageData.word.principalParts.map(
								(part, i) =>
									html`<span class = "small-font" title = ${constants.principalParts[i]}>${part}</span>${i === 5 ? "" : ", "}`,
							)}</p>`
						: null
				}
				
				<div class = "flex-column-left x-small-gap">
					${pageData.word.glosses.map(
						(gloss) => html`<p class = "small-font text-left">${gloss}</p>`,
					)}
				</div>
				
				${
					pageData.word.strongsDefinition
						? html`<div class = "flex-column-left x-small-gap">
						${pageData.word.strongsDefinition.map(
							(line) => html`<p class = "small-font text-left">${line}</p>`,
						)}
						
						${
							pageData.word.strongsKjvDefinition
								? html`<p class = "small-font">${pageData.word.strongsKjvDefinition}</p>`
								: null
						}
						
						<p class = "small-font grayA">Strong's</p>
					</div>`
						: null
				}
				
				<div class = "flex-column-left x-small-gap">
					<p class = "small-font">x${pageData.word.frequency}</p>
					
					<p class = "small-font grayA">Frequency</p>
				</div>
			</div>
			
			${
				pageData.word.forms.length > 0
					? html`<div class = "word-container flex-column-left large-gap">
					${pageData.word.forms.map(
						(form) => html`<div class = "flex-column-left x-small-gap">
							<p class = "small-font">${form.text}</p>
							
							${form.uses.map(
								(use) =>
									html`<p class = "small-font grayA">${use.description}</p>`,
							)}
						</div>`,
					)}
				</div>`
					: null
			}
		</div>`,
};
