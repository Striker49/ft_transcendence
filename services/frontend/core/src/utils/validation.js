// ========== Form validation ==========

const clearSpan = span => {
	if (span) {		
		span.innerHTML = "";
		span.removeAttribute("data-i18n-key");
	}
};

const printError = (span, langKey, msg) => {
	if (span) {
		span.innerHTML = msg;
		span.setAttribute("data-i18n-key", langKey);
	} else {
		console.log(msg);
	}
};

const validateUsername = (username, isValid) => {

	const span = username.nextElementSibling;

	if (username.value === "" || password.value == null) {
		printError(span, "usernameRequired", "Username is required");
		return false;
	}
	clearSpan(span);
	return isValid;
};

const validatePassword = (password, isValid) => {

	const span = password.nextElementSibling;
	const min = 1;
	const max = 256;

	if (password.value.length < min || password.value.length > max) {
		printError(span, "passwordLength", `Password must be between ${min} and ${max} characters`);
		return false;
	} else if (password.value === "password" || password.value === "motdepasse" || password.value === "wachtwoord") {
		printError(span, "passwordNotOriginal", "Password cannot be password");
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
		}
	}
	return isValid;
};
