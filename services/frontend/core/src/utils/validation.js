// ========== Form validation ==========

const clearSpan = span => {
	if (span) {		
		span.removeAttribute("data-i18n-key");
		span.innerHTML = "";
	}
};

const printError = (span, langKey, msg) => {
	if (span) {
		span.innerHTML = msg;
		span.setAttribute("data-i18n-key", langKey);
	}
	console.log(msg);
};

const validateUsername = username => {

	const span = username.nextElementSibling;

	if (username.value === "" || password.value == null) {
		printError(span, "usernameRequired", "Username is required");
		return false;
	}
	clearSpan(span);
	return true;
};

const validatePassword = password => {

	const span = password.nextElementSibling;

	if (password.value.length < 6 || password.value.length > 20) {
		printError(span, "passwordLength", "Password must be 6 and 20 characters");
		return false;
	} else if (password.value === "password") {
		printError(span, "passwordNotOriginal", "Password cannot be password");
		return false;
	}
	clearSpan(span);
	return true;
};

const validateEmail = email => {

	const regex = /^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]+\.[A-Za-z]{2,}$/;
	const span = email.nextElementSibling;

	if (!email.value.match(regex)) {
		printError(span, "validEmail", "Please enter a valid email address");
		return false;
	}
	clearSpan(span);
	return true;
};

export const validateForm = form => {

	const inputs = form.elements;
	let isValid = true;
	
	for (let i = 0; i < inputs.length; ++i) {
		if (inputs[i].name === "email" || inputs[i].type === "email") {
			isValid = validateEmail(inputs[i]);
		} else if (inputs[i].name === "password" || inputs[i].type === "password") {
			isValid = validatePassword(inputs[i]);
		} else if (inputs[i].name === "username") {
			isValid = validateUsername(inputs[i]);
		}
	}
	return isValid;
};
