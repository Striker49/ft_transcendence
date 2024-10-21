// The active locale
const defaultLocale = "en";
const supportedLocales = ["en", "nl", "fr"];

let locale = "en";
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
	console.log("enters event");
	setLocale(defaultLocale);  // Initialize default locale
	bindLocaleSwitcher(defaultLocale);
});

document.addEventListener("change", (event) => {
	event.preventDefault();
	console.log("on change localization");
	if (event.target.matches("#changeLang")) {
		setLocale(locale);  // Initialize default locale
		bindLocaleSwitcher(locale);

	}
});

function bindLocaleSwitcher(initialValue) {
	const switcher = document.querySelector("[data-i18n-switcher]");
	setLocale(switcher.value);
}

async function setLocale(newLocale) {
	if (newLocale === locale) return;  // Don't reload if locale is the same
	console.log("locale:", locale);
	console.log("newLocale:", newLocale);
	try {
		const newTranslations = await fetchTranslationsFor(newLocale);

		// Update the locale and translations
		locale = newLocale;
		console.log("translations:", translations);
		console.log("newtranslations:", newTranslations);
		translations = newTranslations;
		// Ensure the page is fully loaded before translating
		translatePage();
		console.log("Content has been translated");
	} catch (error) {
		console.error(`Error setting locale: ${error}`);
	}
}

async function fetchTranslationsFor(newLocale) {
	try {
		const response = await fetch(`/src/lang/${newLocale}.json`);
		if (!response.ok) {
			throw new Error(`Failed to load translations for locale: ${newLocale}`);
		}
		return await response.json();
	} catch (error) {
		console.error(error);
		return {};  // Return an empty object in case of an error
	}
}

function translatePage() {
	document.querySelectorAll("[data-i18n-key]").forEach((element) => {
		translateElement(element);
	});
}

// Replace the inner text of the given HTML element with the translation
// corresponding to the element's data-i18n-key
function translateElement(element) {
	const key = element.getAttribute("data-i18n-key");
	const translation = translations[key];

	// Only update the element if the translation exists
	if (translation) {
		element.innerText = translation;
	} else {
		console.warn(`Translation key "${key}" not found.`);
	}
}
