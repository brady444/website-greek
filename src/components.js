import { html } from "uhtml";

export const components = {
	wordPropertySelector: (
		oninput,
		showDescriptions,
		showGlosses,
		showLexicalForms,
		showPrincipalParts,
		showFrequencies,
	) => html`<select multiple class = "small-padding medium-font" oninput = ${oninput}>
			<option class = "medium-font" selected = ${showDescriptions}>Description</option>
			<option class = "medium-font" selected = ${showGlosses}>Gloss</option>
			<option class = "medium-font" selected = ${showLexicalForms}>Lexical Form</option>
			<option class = "medium-font" selected = ${showPrincipalParts}>Principal Parts</option>
			<option class = "medium-font" selected = ${showFrequencies}>Frequencies</option>
		</select>`,
};
