// ========== Form validation ==========
import { translatePage } from "../localization.js"

export const addSpan = () => {

	const span = document.createElement("span");

	span.classList.add("form-error", "my-0", "mt-2", "fst-italic", "lh-1", "d-block");
	span.style.fontSize = "12px";
	return span;
};

export const clearSpan = span => {
	if (span) {		
		span.textContent = "";
		span.removeAttribute("data-i18n-key");
	}
};

export const printError = (span, langKey, msg) => {
	if (span) {
		span.textContent = msg;
		span.setAttribute("data-i18n-key", langKey);
		translatePage();
	} else {
		console.log(msg);
	}
};

const validateField = (field, isValid) => {

	const span = field.nextElementSibling;

	if (field.value === "" || field.value == null || isWhiteSpace(field.value)) {
		printError(span, "fieldRequired", "This field is required");
		return false;
	}
	clearSpan(span);
	return isValid;
};

const validateUsername = (username, isValid) => {

	const span = username.nextElementSibling;

	if (username.value === "" || username.value == null || isWhiteSpace(username.value)) {
		printError(span, "usernameRequired", "Username is required");
		return false;
	}
	clearSpan(span);
	return isValid;
};

const validatePassword = (password, isValid) => {

	const span = password.nextElementSibling;
	const min = 6;
	const max = 20;

	if (password.value.length < min || password.value.length > max) {
		printError(span, "passwordLength", `Password must be between ${min} and ${max} characters`);
		return false;
	} else if (password.value === "password" || password.value === "motdepasse" || password.value === "wachtwoord") {
		printError(span, "passwordNotOriginal", "Password cannot be password");
		return false;
	} else if (isWhiteSpace(password.value)) {
		printError(span, "passwordNotValid", "Please enter a valid password");
		return false;
	}
	clearSpan(span);
	return isValid;
};

const validateEmail = (email, isValid) => {

	const regex = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,}$/;
	const span = email.nextElementSibling;

	if (!email.value.match(regex)) {
		printError(span, "validEmail", "Please enter a valid email address");
		return false;
	}
	clearSpan(span);
	return isValid;
};

export const validateForm = form => {

	const inputs = form.elements;
	let isValid = true;
	
	for (let i = 0; i < inputs.length; ++i) {
		if (inputs[i].name === "email" || inputs[i].type === "email") {
			isValid = validateEmail(inputs[i], isValid);
		} else if (inputs[i].name === "password" || inputs[i].type === "password") {
			isValid = validatePassword(inputs[i], isValid);
		} else if (inputs[i].name === "username") {
			isValid = validateUsername(inputs[i], isValid);
		} else if (inputs[i].name === "first_name" || inputs[i].name === "last_name") {
			isValid = validateField(inputs[i], isValid);
		}
	}
	return isValid;
};

// White-space
export const isWhiteSpace = str => {
	
	const regex = /[^\s]/g; // Searches for anything other than a whitespace

	if (str.search(regex) === -1) {
		// No match was found and so, there's only whitespace characters.
		return true;
	}
	return false;
};