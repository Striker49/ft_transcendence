const headers = new Headers({
	"Content-Type": "application/json"
});

export const submitLoginForm = async form => {
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
			const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log(json);
	} catch (error) {
		console.error(error.message);
	}
};

export default `
	<!-- Login Btn -->
	<button type="button" class="btn btn-dark position-absolute top-0 end-0 me-3 mt-3" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
	<!-- Login -->
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
						<label for="username" class="form-label">Email address</label>
						<input type="email" name="username" id="username" class="form-control" required>
					</div>
					<div class="mb-3">
						<label for="password" class="form-label">Password</label>
						<input type="password" name="password" id="password" class="form-control" required>
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