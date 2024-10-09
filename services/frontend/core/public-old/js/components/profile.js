const headers = new Headers({
	"Content-Type": "application/json"
});

export const submitRegistrationForm = async form => {
	const formData = {
		"email": form.email.value,
		"username": form.username.value,
		"password": form.password.value,
		"first_name": form.firstname.value,
		"last_name": form.lastname.value,
		"avatar_path": form.avatar.value,
		"bio": form.bio.value,
		"lang": form.lang.value
	};

	const url = "https://localhost/api/users/registration/";

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