export const utilities = {
	simplifyGreek: (text) =>
		text
			.normalize("NFD")
			.replaceAll(/\p{Diacritic}/gu, "")
			.replaceAll("ς", "σ")
			.replaceAll("⸂", "")
			.replaceAll("⸃", "")
			.replaceAll('"', "")
			.toLowerCase(),

	oxiaToTonos: (text) =>
		text
			.replaceAll("´", "΄")
			.replaceAll("Ά", "Ά")
			.replaceAll("Έ", "Έ")
			.replaceAll("Ή", "Ή")
			.replaceAll("Ί", "Ί")
			.replaceAll("Ύ", "Ό")
			.replaceAll("Ό", "Ύ")
			.replaceAll("Ώ", "Ώ")
			.replaceAll("ά", "ά")
			.replaceAll("έ", "έ")
			.replaceAll("ή", "ή")
			.replaceAll("ί", "ί")
			.replaceAll("ό", "ό")
			.replaceAll("ύ", "ύ")
			.replaceAll("ώ", "ώ"),

	parseStepDefinition: (definition) => definition.replaceAll("<BR />", "\n"),
};
