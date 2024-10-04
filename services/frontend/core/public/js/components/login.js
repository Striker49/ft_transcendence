document.querySelector("#login-form").addEventListener("submit", async e => {
    e.preventDefault();

	const formData = {
		username: loginForm.email.value,
		password: loginForm.password.value
	}
	const headers = new Headers();
	headers.append("Content-Type", "application/json");
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
	} catch (error) {
		console.error(error.message);
	}
});
