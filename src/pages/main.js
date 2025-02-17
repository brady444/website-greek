import { html } from "uhtml";

export const page = {
	content:
		() => html`<div class = "page-container flex-column-top grow full-width full-height">
			<div class = "section-group full-width flex large-padding xx-large-gap">
				<a class = "small-font grayA" href = "#/read">Reader</a>
				
				<a class = "small-font grayA" href = "#/dictionary">Dictionary</a>
				
				<a class = "small-font grayA" href = "#/parser">Parser</a>
			</div>
			
			<div class = "section-group full-width flex large-padding xx-large-gap">
				<a class = "small-font grayA" href = "#/practice">Practice</a>
				
				<a class = "small-font grayA" href = "#/paradigm">Paradigms</a>
			</div>
			
			<div class = "section-group full-width flex large-padding">
				<a class = "small-font grayA" href = "#/about">About</a>
			</div>
		</div>`,
};
