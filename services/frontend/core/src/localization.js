// The active locale
// const defaultLocale = "en";
const supportedLocales = ["en", "nl", "fr"];

let locale = "en";
let defaultLocale = "en";
let translations = {};


function cycleSupportedLang(language) {
	for (let i = 0; supportedLocales[i]; i++)
	{
		if (!language.split("-")[0].search(supportedLocales[i]))
		{
			console.debug("NAVLANG:", language)
			console.debug("FOUND:", supportedLocales[i])
			return (supportedLocales[i]);
		}
	}
}

function findSupported(navLang) {
	console.debug("FIND IF SUPPORTED LANGUAGE");
	//Will check if nav languages are supported from top to bottom
	for (let j = 0; navLang[j]; j++)
		cycleSupportedLang(navLang[j]);
	console.debug("NO LANGUAGE SUPPORTED");
	return (defaultLocale);
}

// When the page content is ready...
document.addEventListener("DOMContentLoaded", (event) => {

	let newLocale;

	// Redirect to another page if /game was reloaded
	if (window.location.pathname === "/game") {
		window.location.href = "/gameConfig";
	}
	//Change locale value for localStorage if valid or the navigator language
	if (localStorage.getItem("lang") && cycleSupportedLang(localStorage.getItem("lang")) === localStorage.getItem("lang"))
		newLocale = localStorage.getItem("lang");
	else
	{
		newLocale = findSupported(navigator.languages);
		localStorage.setItem("lang", newLocale);
	}

//Change html tag "lang" value for the locale if it's different
	if (document.querySelector("[lang]").getAttribute("lang") != newLocale)
		document.querySelector("[lang]").setAttribute("lang", newLocale);
	console.info("Locale:", newLocale);
	requestAnimationFrame( () => {
		setLocale(newLocale);
	});
});

document.addEventListener("change", (event) => {
	if (event.target.matches("#changeLang")) {
		console.debug("on change localization");
		event.preventDefault();
		// setLocale(locale);  // Initialize default locale
		bindLocaleSwitcher(locale);
	}
});

function bindLocaleSwitcher(initialValue) {
	const switcher = document.querySelector("[data-i18n-switcher]");
	setLocale(switcher.value);
	document.querySelector("[lang]").setAttribute("lang", switcher.value);
	// localStorage.setItem("lang", switcher.value);

}

async function setLocale(newLocale) {
	console.info("old locale:", locale);
	console.info("trying to switch to:", newLocale);
	if (newLocale === locale) return;  // Don't reload if locale is the same
	try {
		const newTranslations = await fetchTranslationsFor(newLocale);
		
		// Update the locale and translations
		locale = newLocale;
		localStorage.setItem("lang", locale);
		console.log("newtranslations:", newTranslations);
		translations = newTranslations;
		// Ensure the page is fully loaded before translating
		translatePage();
		console.info("Content has been translated to:", locale);
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

export function translatePage() {
	console.log("TranslatePage() is called");
	document.querySelectorAll("[data-i18n-key]").forEach((element) => {
		translateElement(element);
	});
}

// Replace the inner text of the given HTML element with the translation
// corresponding to the element's data-i18n-key
function translateElement(element) {
	//Checks if we have loaded translations already if not we're 
	//probably still on the first page
	if (JSON.stringify(translations) === '{}')
		return;
	if (element.getAttribute("data-skip-i18n") && localStorage.getItem("UID"))
		return;
	// console.log(translations);
	const key = element.getAttribute("data-i18n-key");
	const translation = translations[key];
	// Only update the element if the translation exists
	if (translation) {
		element.innerText = translation;
	} else {
		console.warn(`Translation key "${key}" not found.`);
	}
}

export function getTranslatedWord(wordKey) {
	console.log("getTranslatedWord", wordKey);
	const translations = {
		en: { winner: "WINNER"},
		fr: { winner: "GAGNANT"},
		nl: { winner: "WINNAAR"},
	}

	const currentLang = localStorage.getItem("lang") || "en";
	return (translations[currentLang][wordKey] || wordKey);
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const globeIcon = document.getElementById("globeIcon");
        const flagOptions = document.getElementById("flagOptions");

        if (globeIcon && flagOptions) {
            console.info("Language selector elements found.");
            
            globeIcon.addEventListener("click", () => {
                flagOptions.style.display = flagOptions.style.display === "block" ? "none" : "block";
            });

            document.querySelectorAll(".flag").forEach(flag => {
                flag.addEventListener("click", (event) => {
                    const selectedLang = event.target.getAttribute("data-lang");
                    setLocale(selectedLang); 
                    flagOptions.style.display = "none";
                });
            });

            document.addEventListener("click", (event) => {
                if (!document.getElementById("languageDropdown").contains(event.target)) {
                    flagOptions.style.display = "none";
                }
            });
        } else {
            console.error("Error: Language selector elements not found.");
        }
    }, 50);
});
