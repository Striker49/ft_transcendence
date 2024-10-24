import Abstract from "./Abstract.js";

export default class extends Abstract {
	constructor() {
		super();
		this.setTitle("Fetch Test");
	}

	async getHtml() {
		// GET Test
		return `
			<form action="" id="form" class="text-center mt-3">
				<input type="submit">
			</form>
		`;

		// POST Test
		// return `
		// 	<form action="" id="form" class="text-center mt-3">
		// 		<div class="mb-3">
		// 			<label for="email" class="form-label">Email address</label>
		// 			<input type="email" name="email" id="email" class="form-control">
		// 		</div>
		// 		<div class="mb-3">
		// 			<label for="password" class="form-label">Password</label>
		// 			<input type="password" name="password" id="password" class="form-control">
		// 		</div>
		// 		<input type="submit">
		// 	</form>
		// `;
	}
}

const submitForm = async form => {

	// For POST Request
	const formData = {
		// email: "a@test.com",
		email_or_username: "oli",
		password: "ziggy"
		// profile: 
		// {
		// first_name: "tester1",
		// last_name:  "test",
		// // bio: "test",
		// lang: "fr",
		// avatar_path: "here/or/here"
		// }
	};

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization":"Token 7e7be82c86ed476c5489fb4c5bb466665de02e8d"
	});

	const url = 'https://localhost/api/profiles/';

	const options = {
		method: "GET",
		// body: JSON.stringify(formData),
		headers: headers
	};

	try {
		const response = await fetch(url, options);
		if (!response.ok) {
			const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		const data = await response.json();
		console.log(data);
		console.log(data.username)
	} catch (error) {
		console.error(error.message);
	}

};

document.addEventListener("submit", e => {
	if (e.target.matches("#form")) {
		e.preventDefault();
		submitForm(e.target);
	} 
});
