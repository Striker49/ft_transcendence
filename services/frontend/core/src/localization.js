const supportedLocales = ["en", "nl", "fr"];

let locale = "en";
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
	return (0);
}

function findSupported(navLang) {
	console.debug("FIND IF SUPPORTED LANGUAGE");
	let found = 0;
	//Will check if nav languages are supported from top to bottom
	for (let j = 0; navLang[j]; j++)
	{
		found = cycleSupportedLang(navLang[j]);
		if (found)
			return (found);
	}
	console.debug("NO LANGUAGE SUPPORTED");
	return (locale);
}

export function setLanguage() {
	let newLocale;

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

}

// When the page content is ready...
document.addEventListener("DOMContentLoaded", (event) => {
	// Redirect to another page if /game was reloaded
	if (window.location.pathname === "/game") {
		window.location.href = "/select";
	}
	setLanguage();
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

		if (document.querySelector("[lang]").getAttribute("lang") != newLocale)
			document.querySelector("[lang]").setAttribute("lang", newLocale);
		
		const newTranslations = await fetchTranslationsFor(newLocale);
		
		// Update the locale and translations
		locale = newLocale;
		localStorage.setItem("lang", locale);
		console.debug("newtranslations:", newTranslations);
		translations = newTranslations;
		//Puts the last language translated's JSON in localStorage
		localStorage.setItem("translations", JSON.stringify(translations));
		// Ensure the page is fully loaded before translating
		translatePage();
		console.info("Content has been translated to:", locale);
	} catch (error) {
		console.error(`Error setting locale: ${error}`);
	}
}

export async function fetchTranslationsFor(newLocale) {
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
	console.debug("TranslatePage() is called");
	document.querySelectorAll("[data-i18n-key]").forEach((element) => {
		translateElement(element);
	});
	document.querySelectorAll("[data-i18n-phkey]").forEach((element, index) => {
		translatePH(element, index);
	});
}

// Replace the inner text of the given HTML element with the translation
// corresponding to the element's data-i18n-key
function translateElement(element) {
	//Checks if we have loaded translations already
	if (JSON.stringify(translations) === '{}')
		return;
	if (element.getAttribute("data-skip-i18n") && localStorage.getItem("UID"))
		return;
	const key = element.getAttribute("data-i18n-key");
	const translation = translations[key];
	// Only update the element if the translation exists
	if (translation) {
		element.innerText = translation;
	} else {
		console.warn(`Translation key "${key}" not found.`);
	}
}

function translatePH(element, index) {
	//Checks if we have loaded translations already
	if (JSON.stringify(translations) === '{}')
		return;
	// if (element.getAttribute("placeholder") && localStorage.getItem("UID"))
	// 	return;
	const key = element.getAttribute("data-i18n-phkey");
	const translation = translations[key];
	// Only update the element if the translation exists
	// console.log("translationPH: ", translation);
	if (translation) {
		element.placeholder = translation + " " + (index + 2);
	} else {
		console.warn(`Translation key "${key}" not found.`);
	}
}

export function getTranslatedWord(wordKey) {
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
