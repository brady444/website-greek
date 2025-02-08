import path from "node:path";

export default {
	generatedPath: path.join(import.meta.dir, "../src/generated"),
	pagesPath: path.join(import.meta.dir, "../src/pages"),

	morphGntPath: path.join(import.meta.dir, "data/morphgnt"),
	stepBibleLexiconPath: path.join(
		import.meta.dir,
		"data/TBESG - Translators Brief lexicon of Extended Strongs for Greek - STEPBible.org CC BY.txt",
	),
	strongsMappingPath: path.join(import.meta.dir, "data/strongs_mapping.yaml"),

	invalidCharacterRegex: /.*[\w[\]\\{}|;:,<.>/?@$%^_=+"'~`*()-].*/giu,

	// Verb personal endings, used for approximating principal parts
	personalEndings: {
		primary: {
			"1st": {
				active: [
					// Default
					{
						firstSingular: "ω",
						endings: ["ομεν"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶ",
						endings: ["ῶμεν"],
					},

					// Epsilon Contract
					{
						firstSingular: "ῶ",
						endings: ["οῦμεν"],
					},

					// Omicron Contract
					{
						firstSingular: "ῶ",
						endings: ["οῦμεν"],
					},
				],

				middle: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["ομεθα"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ώμεθα"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ούμεθα"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ούμεθα"],
					},
				],

				passive: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["ομεθα"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ώμεθα"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ούμεθα"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ούμεθα"],
					},
				],
			},

			"2nd": {
				active: [
					// Default
					{
						firstSingular: "ω",
						endings: ["εις", "ετε"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶ",
						endings: ["ᾷς", "ᾶτε"],
					},

					// Epsilon Contract
					{
						firstSingular: "ῶ",
						endings: ["εῖς", "εῖτε"],
					},

					// Omicron Contract
					{
						firstSingular: "ῶ",
						endings: ["οῖς", "οῦτε"],
					},
				],

				middle: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["ῃ", "εσθε"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ᾷ", "ᾶσθε"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ῇ", "εῖσθε"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["οῖ", "οῦσθε"],
					},
				],

				passive: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["ῃ", "εσθε"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ᾷ", "ᾶσθε"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["ῇ", "εῖσθε"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["οῖ", "οῦσθε"],
					},
				],
			},

			"3rd": {
				active: [
					// Default
					{
						firstSingular: "ω",
						endings: ["ει", "ουσι(ν)"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶ",
						endings: ["ᾷ", "ῶσι(ν)"],
					},

					// Epsilon Contract
					{
						firstSingular: "ῶ",
						endings: ["εῖ", "οῦσι(ν)"],
					},

					// Omicron Contract
					{
						firstSingular: "ῶ",
						endings: ["οῖ", "οῦσι(ν)"],
					},
				],

				middle: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["εται", "ονται"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ᾶται", "ῶνται"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["εῖται", "οῦνται"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["οῦται", "οῦνται"],
					},
				],

				passive: [
					// Default
					{
						firstSingular: "ομαι",
						endings: ["εται", "ονται"],
					},

					// Alpha Contract
					{
						firstSingular: "ῶμαι",
						endings: ["ᾶται", "ῶνται"],
					},

					// Epsilon Contract
					{
						firstSingular: "οῦμαι",
						endings: ["εῖται", "οῦνται"],
					},

					// Omicron Contract
					{
						firstSingular: "οῦμαι",
						endings: ["οῦται", "οῦνται"],
					},
				],
			},
		},

		secondary: {
			"1st": {
				active: [
					// 1st Aorist
					{
						firstSingular: "α",
						endings: ["αμεν"],
					},

					// Default
					{
						firstSingular: "ον",
						endings: ["ομεν"],
					},

					// Alpha Contract
					{
						firstSingular: "ων",
						endings: ["ῶμεν"],
					},

					// Epsilon Contract
					{
						firstSingular: "ουν",
						endings: ["οῦμεν"],
					},

					// Omicron Contract
					{
						firstSingular: "ουν",
						endings: ["οῦμεν"],
					},
				],

				middle: [
					// 1st Aorist
					{
						firstSingular: "άμην",
						endings: ["άμεθα"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ομεθα"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ώμεθα"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["ούμεθα"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["ούμεθα"],
					},
				],

				passive: [
					// 1st Aorist
					{
						firstSingular: "ην",
						endings: ["ημεν"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ομεθα"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ώμεθα"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["ούμεθα"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["ούμεθα"],
					},
				],
			},

			"2nd": {
				active: [
					// 1st Aorist
					{
						firstSingular: "α",
						endings: ["ας", "ατε"],
					},

					// Default
					{
						firstSingular: "ον",
						endings: ["ες", "ετε"],
					},

					// Alpha Contract
					{
						firstSingular: "ων",
						endings: ["ας", "ᾶτε"],
					},

					// Epsilon Contract
					{
						firstSingular: "ουν",
						endings: ["εις", "εῖτε"],
					},

					// Omicron Contract
					{
						firstSingular: "ουν",
						endings: ["ους", "οῦτε"],
					},
				],

				middle: [
					// 1st Aorist
					{
						firstSingular: "άμην",
						endings: ["ω", "ασθε"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ου", "εσθε"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ῶ", "ᾶσθε"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦ", "εῖσθε"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦ", "οῦσθε"],
					},
				],

				passive: [
					// 1st Aorist
					{
						firstSingular: "ην",
						endings: ["ης", "ητε"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ου", "εσθε"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ῶ", "ᾶσθε"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦ", "εῖσθε"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦ", "οῦσθε"],
					},
				],
			},

			"3rd": {
				active: [
					// 1st Aorist Singular
					{
						// TODO This doesn't work for liquids. But we can't do ε(ν) -> α because it conflicts with the Default endings below
						firstSingular: "σα",
						endings: ["σε(ν)"],
					},

					// 1st Aorist Plural
					{
						firstSingular: "α",
						endings: ["αν"],
					},

					// Default
					{
						firstSingular: "ον",
						endings: ["ε(ν)", "ον"],
					},

					// Alpha Contract
					{
						firstSingular: "ων",
						endings: ["α", "ων"],
					},

					// Epsilon Contract
					{
						firstSingular: "ουν",
						endings: ["ει", "ουν"],
					},

					// Omicron Contract
					{
						firstSingular: "ουν",
						endings: ["ου", "ουν"],
					},
				],

				middle: [
					// 1st Aorist
					{
						firstSingular: "άμην",
						endings: ["ατο", "αντο"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ετο", "οντο"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ᾶτο", "ῶντο"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["εῖτο", "οῦντο"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦτο", "οῦντο"],
					},
				],

				passive: [
					// 1st Aorist
					{
						firstSingular: "ην",
						endings: ["η", "ησαν"],
					},

					// Default
					{
						firstSingular: "ομην",
						endings: ["ετο", "οντο"],
					},

					// Alpha Contract
					{
						firstSingular: "ώμην",
						endings: ["ᾶτο", "ῶντο"],
					},

					// Epsilon Contract
					{
						firstSingular: "ούμην",
						endings: ["εῖτο", "οῦντο"],
					},

					// Omicron Contract
					{
						firstSingular: "ούμην",
						endings: ["οῦτο", "οῦντο"],
					},
				],
			},
		},
	},

	// Used for sorting forms
	formUseProperties: {
		mood: [
			"indicative",
			"imperative",
			"subjunctive",
			"optative",
			"infinitive",
			"participle",
		],

		tense: [
			"present",
			"imperfect",
			"future",
			"aorist",
			"perfect",
			"pluperfect",
		],

		voice: ["active", "middle", "passive"],

		number: ["singular", "plural"],

		person: ["1st", "2nd", "3rd"],

		case: ["nominative", "genitive", "dative", "accusative", "vocative"],

		gender: ["masculine", "feminine", "neuter"],

		declension: ["1st", "2nd", "3rd"],

		degree: ["comparative", "superlative"],

		partOfSpeech: [
			"noun",
			"adjective",
			"verb",
			"adverb",
			"conjunction",
			"personal pronoun",
			"preposition",
			"particle",
			"demonstrative pronoun",
			"interrogative/indefinite pronoun",
			"definite article",
			"relative pronoun",
		],
	},
};
