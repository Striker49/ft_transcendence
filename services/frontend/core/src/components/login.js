import { updateProfile } from "./profile.js";
import { validateForm } from "../utils/validation.js";
import { translatePage } from "../localization.js";

const getCustomErrorMessage = statusCode => {
	switch (Number(statusCode)) {
		case 400:
			return "Unable to log in with provided credentials.";
		case 404:
			return "User does not exist.";
	}
};

const headers = new Headers({
	"Content-Type": "application/json"
});

const login = async form => {
	const formData = {
		email_or_username: form.username.value,
		password: form.password.value
	};

	const url = "https://localhost/api/users/login/";

	try {
		const response = await fetch(url, {
			method: "POST",
			body: JSON.stringify(formData),
			headers: headers
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		
		const json = await response.json();
		console.log(json);
		console.log("Response status: ", response.status);

		localStorage.setItem("authToken", json.token);
		localStorage.setItem("UID", json.UID);
		
		// Update Login Section
		const modalElement = document.querySelector("#loginModal");
		const modalInstance = bootstrap.Modal.getInstance(modalElement);
		modalInstance.hide();

		updateLogin();
		if (window.location.pathname === "/profile") {
			updateProfile();
		}

	} catch (error) {
		console.error(error.message);
		if (error.message.includes("Response status:")) {
			// Client-side errors
			const statusCode = error.message.split("Response status: ")[1];
			alert(getCustomErrorMessage(statusCode));
		} else {
			// Server-side errors
			alert("Something wrong with server");
		}
	}
};

const logout = () => {
	if (localStorage.getItem("authToken")) {
		localStorage.clear();
		updateLogin();
		if (window.location.pathname === "/profile") {
			updateProfile();
		}
	}
};

const loginContent = () => {
	if (localStorage.getItem("authToken")) {
		return `
			<button type="button" id="logout-btn" data-i18n-key="logout" class="btn btn-dark position-absolute top-0 end-0 me-3 mt-3">Logout</button>
		`;
	} else {
		return `
			<button type="button" data-i18n-key="login" class="btn btn-dark position-absolute top-0 end-0 me-3 mt-3" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
			<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="login" aria-hidden="true">
				<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h2 data-i18n-key="loggingIn" class="modal-title fs-5" id="login">Login</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="login-form" action="" method="post" novalidate>
							<div class="mb-3">
								<label for="login-user" data-i18n-key="emailorusername" class="form-label">Email or username</label>
								<input type="text" name="username" id="login-user" class="form-control" required>
								<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
							</div>
							<div class="mb-3">
								<label for="login-pass" data-i18n-key="password" class="form-label">Password</label>
								<input type="password" name="password" id="login-pass" class="form-control" required>
								<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<a href="/profile" data-i18n-key="newUser" class="btn btn-secondary" data-bs-dismiss="modal" data-link>New User ?</a>
						<button type="submit" data-i18n-key="login" class="btn btn-primary" form="login-form">Login</button>
					</div>
				</div>
				</div>
			</div>
		`;
	}
};

const updateLogin = () => {
	document.querySelector("#login").innerHTML = loginContent();
	translatePage();
};

const html = () => {
	return `
		<section id="login">${loginContent()}</section>
	`;
};

export default html();

// ============ Events ==============

document.addEventListener("click", e => {
	if (e.target.matches("#logout-btn")) {
		logout();
	}
});

document.addEventListener("submit", e => {
	if (e.target.matches("#login-form")) {
		e.preventDefault();
		if (validateForm(e.target)) {
			login(e.target);
		}
	}
});