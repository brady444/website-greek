import { html, render } from "uhtml";

import { pages } from "./generated/pages.js";
import { utilities } from "./utilities.js";

let currentPage = "main";

globalThis.update = () =>
	render(
		document.body,
		html`<div id = "container" class = "flex-column">
		<div class = "full-width flex small-padding gray1-bg">
			<a id = "title" class = "medium-font" href = "#">Biblical Greek</a>
		</div>
		
		${pages[currentPage].content()}
	</div>`,
	);

globalThis.navigate = (fullPath) => {
	const path = fullPath
		.split("/")
		.map((section) => decodeURIComponent(section));

	currentPage = pages[path[0]] ? path[0] : "main";

	utilities.setPath(currentPage === "main" ? "" : fullPath);

	globalThis.pageData = {};

	if (pages[currentPage].setup?.(path) === false) {
		return;
	}

	update();
};

window.addEventListener("hashchange", () => {
	navigate(location.hash.slice(2));
});

navigate(location.hash.slice(2));
