let upload = false; 

const avatarPath = custom => {

	if (!upload) {

		const avatars = document.querySelector("#avatar-section-1");

		for (const avatar of avatars.children) {
			if (avatar.classList.contains("border-warning")) {
				return avatar.getAttribute("src");
			}
		}

	} else if (custom) {
		return custom;
	}
	return "/src/assets/avatar/avatar1.jpg";
};

const submitRegistrationForm = async form => {
	
	const formData = {
		"email": form.email.value,
		"username": form.username.value,
		"password": form.password.value,
		"first_name": form.firstname.value,
		"last_name": form.lastname.value,
		"avatar_path": avatarPath(form.avatar.value),
		"bio": form.bio.value,
		"lang": form.lang.value
	};

	const headers = new Headers({
		"Content-Type": "application/json"
	});

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

const toggleAvatarSection = isCustom => {

	const avatarSection1 = document.querySelector("#avatar-section-1");
	const avatarSection2 = document.querySelector("#avatar-section-2");

	if (isCustom) {
		upload = true;
		avatarSection1.classList.add("d-none");
		avatarSection2.classList.remove("d-none");
	} else {
		upload = false;
		avatarSection1.classList.remove("d-none");
		avatarSection2.classList.add("d-none");
	}
};

const defaultForm = () => {
	return `
		<div class="container bg-secondary rounded-5 mt-5 p-5">
			<div class="row justify-content-center align-items-center text-light bg-dark rounded-5 p-5 h-100 mx-auto">
				<h2 class="text-success text-center fw-bold fs-1">Profile</h2>
				<form id="registration-form" action="" method="post" class="row mt-3 p-0">
					<div class="col border-end border-success pe-4">
						<div class="mb-4">
							<label for="email" class="form-label">Email:</label>
							<input type="email" class="form-control" name="email" id="email" required>
						</div>
						<div class="mb-4">
							<label for="username" class="form-label">Username:</label>
							<input type="text" class="form-control" name="username" id="username" required>
						</div>
						<div class="mb-4">
							<label for="password" class="form-label">Password:</label>
							<input type="password" class="form-control" name="password" id="password" required>
						</div>
						<div class="mb-4">
							<label for="firstname" class="form-label">First name:</label>
							<input type="text" class="form-control" name="firstname" id="firstname">
						</div>
						<div class="mb-4">
							<label for="lastname" class="form-label">Last name:</label>
							<input type="text" class="form-control" name="lastname" id="lastname">
						</div>
					</div>
					<div class="col ps-4">
						<div class="mb-4">
							<p><a href="" class="text-decoration-none text-success" id="default-image">Choose Avatar</a> or <a href="" class="text-decoration-none text-success" id="custom-image">Upload Custom Image</a></p>
							<div id="avatar-section-1">
								<img src="/src/assets/avatar/avatar1.jpg" alt="Avatar image 1" width="64px" height="64px" class="m-2 border border-5 border-warning d-inline-block" style="cursor: pointer;">
								<img src="/src/assets/avatar/avatar2.jpg" alt="Avatar image 2" width="64px" height="64px" class="m-2 border border-5 border-success d-inline-block" style="cursor: pointer;">
								<img src="/src/assets/avatar/avatar3.jpg" alt="Avatar image 3" width="64px" height="64px" class="m-2 border border-5 border-success d-inline-block" style="cursor: pointer;">
								<img src="/src/assets/avatar/avatar4.jpg" alt="Avatar image 4" width="64px" height="64px" class="m-2 border border-5 border-success d-inline-block" style="cursor: pointer;">
								<img src="/src/assets/avatar/avatar5.jpg" alt="Avatar image 5" width="64px" height="64px" class="m-2 border border-5 border-success d-inline-block" style="cursor: pointer;">
								<img src="/src/assets/avatar/avatar6.jpg" alt="Avatar image 6" width="64px" height="64px" class="m-2 border border-5 border-success d-inline-block" style="cursor: pointer;">
							</div>
							<div id="avatar-section-2" class="d-none">
								<input type="file" class="form-control" name="avatar," id="avatar">
							</div>
						</div>
						<div class="mb-4">
							<label for="bio" class="form-label">Bio:</label>
							<textarea class="form-control" name="bio" id="bio"></textarea>
						</div>
						<div class="mb-4">
							<label for="lang" class="form-label">Language:</label>
							<select class="form-select" id="lang">
								<option value="en">English</option>
								<option value="fr">French</option>
								<option value="nl">Dutch</option>
							</select>
						</div>
						<div class="mb-4">
							<button type="submit" class="btn btn-secondary">Submit</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
};

const updateContent = () => {
	if (localStorage.getItem("authToken")) {
		return `
			<div class="container bg-secondary rounded-5 mt-5 p-5" style="width: 960px;">
				<div class="row justify-content-center align-items-center text-light bg-dark rounded-5 p-5 h-100 mx-auto">
					<h2 class="row text-success text-center fw-bold fs-1">Profile</h2>
					<div class="row mt-3 p-0">
						<div class="col border-end border-success pe-4">
							<p>Ziggy Zigg Zigg</p>
							<p>ziggy@ziggy.com</p>
							<p>Username: ziggy</p>
							<p>Password: *****</p>
						</div>
						<div class="col ps-4">
							<p><img src="/src/assets/avatar/avatar1.jpg" alt="Avatar image" width="64px" height="64px" class="border border-5 border-success"></p>
							<p class="text-break">Bio: My awesome bio</p>
							<button type="submit" class="btn btn-secondary">Edit profile</button>
						</div>
					</div>
				</div>
			</div>
		`;
	} else {
		return defaultForm();
	}
};

const html = () => {
	return `
		<!-- Profile section -->
		<section id="profile">${updateContent()}</section>
	`;
};

export default html();

// ============ Events ==============

document.addEventListener("click", e => {

	const element = e.target;

	switch (true) {
		case element.matches("#avatar-section-1 img"):
			const parent = e.target.parentElement;
			for (const child of parent.children) {
				child.classList.add("border-success");
				child.classList.remove("border-warning");
			}
			e.target.classList.add("border-warning");
			e.target.classList.remove("border-success");
			break;

		case element.matches("#custom-image"):
			e.preventDefault();
			toggleAvatarSection(true);
			break;

		case element.matches("#default-image"):
			e.preventDefault();
			toggleAvatarSection(false);
			break;
	}
});

document.addEventListener("submit", e => {
	if (e.target.matches("#registration-form")) {
		e.preventDefault();
		submitRegistrationForm(e.target);
	}
});


// ============ Old Version ==============

// const headers = new Headers({
// 	"Content-Type": "application/json"
// });

// export const submitRegistrationForm = async form => {
// 	const formData = {
// 		"email": form.email.value,
// 		"username": form.username.value,
// 		"password": form.password.value,
// 		"first_name": form.firstname.value,
// 		"last_name": form.lastname.value,
// 		"avatar_path": form.avatar.value,
// 		"bio": form.bio.value,
// 		"lang": form.lang.value
// 	};

// 	const url = "https://localhost/api/users/registration/";

// 	try {
// 		const response = await fetch(url, {
// 			method: "POST",
// 			body: JSON.stringify(formData),
// 			headers: headers
// 		});
// 		if (!response.ok) {
// 			const errorResponse = await response.text();
// 			console.log(errorResponse);
// 			throw new Error(`Response status: ${response.status}`);
// 		}

// 		const json = await response.json();
// 		console.log(json);
// 	} catch (error) {
// 		console.error(error.message);
// 	}
// };