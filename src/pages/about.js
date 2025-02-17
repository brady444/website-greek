import { html } from "uhtml";

import { constants } from "../constants.js";

export const page = {
	content:
		() => html`<div class = "page-container flex-column-top grow full-width full-height xx-large-gap medium-padding">
			<div class = "medium-width flex-column-top xx-large-gap">
				<p class = "small-font">Contact: <a class = "grayA" href = "mailto:contact@biblicalgreek.app">contact@biblicalgreek.app</a></p>
				
				<div class = "flex-column medium-gap">
					<p class = "medium-font">Dictionary of Greek Words</p>
					
					<p class = "small-font grayA">Taken from Strong's Exhaustive Concordance by James Strong, S.T.D., LL.D. 1890</p>
					
					<p class = "small-font">JSON Version</p>
					
					<div class = "flex-column small-gap">
						<p class = "small-font grayA">Copyright 2009, Open Scriptures. CC-BY-SA (<a class = "underlined grayA" href = "https://creativecommons.org/licenses/by-sa/3.0/legalcode">v3</a>, <a class = "underlined grayA" href = "https://creativecommons.org/licenses/by-sa/4.0/legalcode">v4</a>). Derived from XML.</p>
						
						<a class = "small-font underlined grayA" href = "https://openscriptures.org">https://openscriptures.org</a>
						
						<a class = "small-font underlined grayA" href = "https://github.com/openscriptures/strongs/blob/master/greek/strongs-greek-dictionary.js">https://github.com/openscriptures/strongs/blob/master/greek/strongs-greek-dictionary.js</a>
						
						<p class = "small-font grayA">Modified to use ES6 module format.</p>
					</div>
					
					<p class = "small-font">XML e-text Version</p>
					
					<p class = "small-font grayA">The XML version of this work was prepared in 2006 by Ulrik Petersen (<a class = "underlined grayA" href = "http://ulrikp.org">http://ulrikp.org</a>)</p>
				</div>
				
				<div class = "flex-column small-gap">
					<p class = "medium-font">TBESG - Translators Brief lexicon of Extended Strongs for Greek</p>
					
					<p class = "small-font grayA">STEP Bible</p>
					
					<a class = "underlined small-font grayA" href = "https://www.stepbible.org">www.STEPBible.org</a>
					
					<a class = "underlined grayA" href = "https://creativecommons.org/licenses/by/4.0/legalcode">CC-BY 4.0</a>
					
					<a class = "small-font underlined grayA" href = "https://github.com/STEPBible/STEPBible-Data">https://github.com/STEPBible/STEPBible-Data</a>
					
					<p class = "small-font grayA">Lexicons for the tagged texts used by STEPBible, based on BHS for OT and LSJ for NT, backwardly compatible for any tagging based on Strong numbers. </p>
					
					<p class = "small-font grayA">Extended Strongs for Greek is backwardly compatible with original Strong and NASB, and extended to include all NT variants and LXX + variants.</p>
					
					<p class = "small-font grayA">The Brief lexicon is based on the Abbott-Smith definitions, and edited to conform with the extended Strongs. For a few words where Abbott-Smith lacks a definition, one is supplied  from MiddleLiddel (MD) or STEPBible scholars</p>
					
					<p class = "small-font grayA">The Full lexicon is edited from the Full LSJ by Tyndale House scholars, formatted to make it easy to read, with expansion of abbreviations and revealing examples from Greek literature on hover over dates of the earliest source (added by Tyndale House)</p>
					
					<p class = "small-font grayA">Data created by <a class = "underlined grayA" href = "https://www.stepbible.org">www.STEPBible.org</a> based on work at Tyndale House Cambridge (<a class = "underlined grayA" href = "https://creativecommons.org/licenses/by/4.0/legalcode">CC BY 4.0</a>)</p>
				</div>
				
				<div class = "flex-column small-gap">
					<p class = "medium-font">The SBLGNT</p>
					
					<p class = "small-font grayA">The SBLGNT, jointly published by both the Society of Biblical Literature and Logos Bible Software.</p>
					
					<a class = "small-font underlined grayA" href = "https://sblgnt.com">https://sblgnt.com</a>
					
					<p class = "small-font grayA">Licensed under the Creative Commons Attribution 4.0 International Public License: <a class = "underlined grayA" href = "https://sblgnt.com/license">https://sblgnt.com/license</a>
				</div>
				
				<div class = "flex-column small-gap">
					<p class = "medium-font">MorphGNT: SBLGNT Edition</p>
					
					<p class = "small-font grayA">Tauber, J. K., ed. (2017) MorphGNT: SBLGNT Edition. Version 6.12 [Data set]. <a class = "underlined grayA" href = "https://github.com/morphgnt/sblgnt">https://github.com/morphgnt/sblgnt</a> DOI: 10.5281/zenodo.376200</p>
					
					<a class = "underlined small-font grayA" href = "https://jktauber.com">https://jktauber.com</a>
					
					<p class = "small-font grayA">Project to merge the MorphGNT analysis with the SBLGNT text.</p>
					
					<p class = "small-font grayA">The SBLGNT text itself is subject to the SBLGNT EULA and the morphological parsing and lemmatization is made available under a CC-BY-SA License (<a class = "underlined grayA" href = "https://creativecommons.org/licenses/by-sa/3.0/legalcode">v3</a>, <a class = "underlined grayA" href = "https://creativecommons.org/licenses/by-sa/4.0/legalcode">v4</a>).</p>
				</div>
				
				<div class = "flex-column small-gap">
					<p class = "medium-font">greek-lemma-mappings</p>
					
					<p class = "small-font grayA">J. K. Tauber</p>
					
					<a class = "underlined small-font grayA" href = "https://jktauber.com">https://jktauber.com</a>
					
					<a class = "underlined grayA" href = "https://creativecommons.org/licenses/by-sa/4.0/legalcode">CC-BY-SA 4.0</a>
					
					<a class = "underlined small-font grayA" href = "https://github.com/jtauber/greek-lemma-mappings">https://github.com/jtauber/greek-lemma-mappings</a>
					
					<p class = "small-font grayA">Mappings between the headwords of various NT Greek lexicons, the lemmas of MorphGNT and Nestle 1904, and Strongs and GK numbers</p>
				</div>
				
				${
					constants.errors.length > 0
						? html`<div class = "medium-width flex-column-top large-gap">
						<p class = "small-font">This website uses an automated parser to generate its data. The data may contain inaccuracies or errors. Some errors are caught during the parsing process. These errors are listed below. There may be more errors that are not listed. These errors may also be outdated or inaccurate.</p>
						
						<div class = "flex-column medium-width x-large-gap">
							<div class = "flex-column-left full-width small-gap">
								${constants.errors.map(
									(error) =>
										html`<pre class = "text-left small-font grayA">${error}</pre>`,
								)}
							</div>
						</div>
					</div>`
						: null
				}
		</div>`,
};
