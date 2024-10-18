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
		"profile": {
			"first_name": form.firstname.value,
			"last_name": form.lastname.value,
			"avatar_path": avatarPath(form.avatar.value),
			"bio": form.bio.value,
			"lang": form.lang.value
		}
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

const getProfileInfo = async () => {

	const token = localStorage.getItem("transcendenceToken");
	const uid = localStorage.getItem("transcendenceUID");

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});

	const url = "https://localhost/api/profiles/";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: headers
		});
		if (!response.ok) {
			const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		console.log(json);
		return json;
	} catch (error) {
		console.error(error.message);
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
							<input type="email" class="form-control" id="email" required>
						</div>
						<div class="mb-4">
							<label for="username" class="form-label">Username:</label>
							<input type="text" class="form-control" id="username" required>
						</div>
						<div class="mb-4">
							<label for="password" class="form-label">Password:</label>
							<input type="password" class="form-control" id="password" required>
						</div>
						<div class="mb-4">
							<label for="firstname" class="form-label">First name:</label>
							<input type="text" class="form-control" id="firstname">
						</div>
						<div class="mb-4">
							<label for="lastname" class="form-label">Last name:</label>
							<input type="text" class="form-control" id="lastname">
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
								<input type="file" class="form-control" id="avatar">
							</div>
						</div>
						<div class="mb-4">
							<label for="bio" class="form-label">Bio:</label>
							<textarea class="form-control" id="bio"></textarea>
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
							<button type="submit" class="btn btn-secondary">Create profile</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	`;
};

export const updateProfile = () => {
	if (localStorage.getItem("transcendenceToken")) {
		getProfileInfo().then(profile => {
			document.querySelector("#profile").innerHTML = `
				<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5">
					<div class="row p-0">
						<div class="col-md-4">
							<div class="p-4 bg-info rounded-5">
								<p class="text-center my-1"><img src="${profile.avatar_path}" alt="Avatar image" width="128px" height="128px" class="border border-5 border-success"></p>
								<p class="text-center py-3 m-0 fs-2 fw-bold fst-italic border-bottom border-dark">Ziggy al'Thor</p>
								<p class="py-3 m-0 border-bottom border-dark">Name: ${profile.first_name} ${profile.last_name}</p>
								<p class="py-3 m-0 border-bottom border-dark">Email: ziggy@ziggy.com</p>
								<p class="py-3 m-0 border-bottom border-dark">${profile.bio}</p>
								<p class="m-0 mt-3 text-center"><button type="submit" class="btn btn-secondary rounded-5 px-4">Edit profile</button></p>
							</div>
						</div>
						<div class="col-md-8">
							<div class="p-4 bg-info rounded-5">
								<p class="mb-1"><span class="fw-bold">Games won</span><span class="float-end">11/42</span></p>
								<div class="progress mb-4" role="progressbar" aria-label="Basic example" aria-valuenow="11" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-success" style="width: 25%"></div>
								</div>
								<p class="mb-1"><span class="fw-bold">Games lost</span><span class="float-end">2/42</span></p>
								<div class="progress mb-4" role="progressbar" aria-label="Basic example" aria-valuenow="2" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-danger" style="width: 2%"></div>
								</div>
								<p class="mb-1"><span class="fw-bold">Games played</span><span class="float-end">13/42</span></p>
								<div class="progress mb-4" role="progressbar" aria-label="Basic example" aria-valuenow="13" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-secondary" style="width: 26%"></div>
								</div>
								<p class="mb-1"><span class="fw-bold">Perfect games</span><span class="float-end">2/42</span></p>
								<div class="progress mb-4" role="progressbar" aria-label="Basic example" aria-valuenow="2" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-warning" style="width: 2%"></div>
								</div>
								<p class="m-0 text-center fw-bold fs-1 fst-italic">Rank : <span class="text-success" style="font-size: 60px;">1st</span></p>
							</div>
						</div>
					</div>
				</div>
			`;
		});
	} else {
		document.querySelector("#profile").innerHTML = defaultForm();
	}
};

const html = () => {
	return `
		<!-- Profile section -->
		<section id="profile"></section>
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