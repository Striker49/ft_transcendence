const headers = new Headers({
	"Content-Type": "application/json"
});

export const login = async form => {
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
			// const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log(json);
		localStorage.setItem("authToken", json.token);

		// Update Login Section
		const modalElement = document.querySelector("#loginModal");
		const modalInstance = bootstrap.Modal.getInstance(modalElement);
		modalInstance.hide();

		document.querySelector("#login").innerHTML = updateContent();
	} catch (error) {
		console.error(error.message);
	}
};

export const logout = () => {
	if (localStorage.getItem("authToken")) {
		localStorage.removeItem("authToken");
		document.querySelector("#login").innerHTML = updateContent();
	}
};

const updateContent = () => {
	if (localStorage.getItem("authToken")) {
		return `
			<button type="button" id="logout-btn" class="btn btn-dark position-absolute top-0 end-0 me-3 mt-3">Logout</button>
		`;
	} else {
		return `
			<button type="button" class="btn btn-dark position-absolute top-0 end-0 me-3 mt-3" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
			<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="login" aria-hidden="true">
				<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h2 class="modal-title fs-5" id="login">Login</h1>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="login-form" action="" method="post">
							<div class="mb-3">
								<label for="login-user" class="form-label">Email address</label>
								<input type="email" name="username" id="login-user" class="form-control" required>
							</div>
							<div class="mb-3">
								<label for="login-pass" class="form-label">Password</label>
								<input type="password" name="password" id="login-pass" class="form-control" required>
							</div>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
						<button type="submit" class="btn btn-primary" form="login-form">Login</button>
					</div>
				</div>
				</div>
			</div>
		`;
	}
};

const html = () => {
	return `
		<section id="login">${updateContent()}</section>
	`;
};

export default html();