// The active locale
// const defaultLocale = "en";
const supportedLocales = ["en", "nl", "fr"];

let locale = "en";
let translations = {};


function findSupported(navLang) {
	console.log("FIND SUPPORTED");
	for (let i = 0; supportedLocales[i]; i++)
		if (!navLang.search(supportedLocales[i]))
		{
			console.log("NAVLANG:", navLang)
			console.log("FOUND:", supportedLocales[i])
			return (supportedLocales[i]);
		}
	console.log("Not FOUND");
	return ("en");
}

// When the page content is ready...
document.addEventListener("click", () => {
	// localStorage.setItem("lang", "fr");
	localStorage.removeItem("lang");
	console.log("DOMContentLoaded localization");
	console.log("Local Storage:", localStorage);
	let newLocale;
	//Change locale value for localStorage or the navigator language
	if (localStorage.getItem("lang"))
		newLocale = localStorage.getItem("lang");
	else
		newLocale = findSupported(navigator.language);
//Change html tag "lang" value for the locale if it's different
	if (document.querySelector("[lang]").getAttribute("lang") != newLocale)
		document.querySelector("[lang]").setAttribute("lang", newLocale);
	console.log("Locale:", newLocale);
	setLocale(newLocale);
	document.querySelector("[data-i18n-switcher]").value = newLocale;
	// bindLocaleSwitcher(newLocale);
	// navLang.innerHTML = locale;
	// console.log(defaultLocale.value);
	// console.log(defaultLocale.innerHTML);
	// setLocale(locale);  // Initialize default locale
});

document.addEventListener("change", (event) => {
	event.preventDefault();
	console.log("on change localization");
	if (event.target.matches("#changeLang")) {
		// setLocale(locale);  // Initialize default locale
		bindLocaleSwitcher(locale);
	}
});

function bindLocaleSwitcher(initialValue) {
	const switcher = document.querySelector("[data-i18n-switcher]");
	setLocale(switcher.value);
	// localStorage.setItem("lang", initialValue);
}

async function setLocale(newLocale) {
	console.log("setLocale->locale:", locale);
	console.log("setLocale->newLocale:", newLocale);
	if (newLocale === locale) return;  // Don't reload if locale is the same
	try {
		console.log("newLocale:", newLocale)
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
		console.log(response.json);
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
