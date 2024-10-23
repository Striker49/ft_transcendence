import { validateForm } from "../utils/validation.js";

let profile;
let upload = false; 

const avatarPath = customURL => {

	if (!upload) {

		const avatars = document.querySelector("#avatar-section-1");

		for (const avatar of avatars.children) {
			if (avatar.classList.contains("border")) {
				return avatar.getAttribute("src");
			}
		}

	} else if (customURL) {
		return customURL;
	}
	return "/src/assets/avatar/avatar1.jpg";
};

const uploadAvatar = async avatar => {

	const url = "https://localhost/src/assets/avatar/custom/";

	const formData = new FormData();
	formData.append("avatar", avatar);

	try {
		const response = await fetch(url, {
			method: "POST",
			body: formData
		});
		if (!response.ok) {
			const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		// const json = await response.json();
		// console.log(json);
	} catch (error) {
		console.error(error.message);
	}
};

const submitRegistrationForm = async form => {
	
	const avatar = form.avatar.value;

	const data = new FormData(form);

	const formData = {
		"email": form.email.value,
		"username": form.username.value,
		"password": form.password.value,
		"profile": {
			"first_name": form.firstname.value,
			"last_name": form.lastname.value,
			"avatar_path": avatarPath(avatar),
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

		if (upload && avatar) {
			uploadAvatar(data.get("avatar"));
		}

		const json = await response.json();
		console.log(json);
		alert("Registration successful!");
	} catch (error) {
		console.error(error.message);
		alert(error.message);
	}
};

const submitProfileForm = async form => {

	const token = localStorage.getItem("authToken");
	const uid = localStorage.getItem("UID");

	const avatar = form.avatar.value;

	const data = new FormData(form);

	const formData = {
		"first_name": form.firstname.value,
		"last_name": form.lastname.value,
		"avatar_path": avatarPath(avatar),
		"bio": form.bio.value,
		"lang": form.lang.value
	};

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});

	const url = `https://localhost/api/profiles/${uid}/`;

	try {
		const response = await fetch(url, {
			method: "PATCH",
			body: JSON.stringify(formData),
			headers: headers
		});
		if (!response.ok) {
			const errorResponse = await response.text();
			console.log(errorResponse);
			throw new Error(`Response status: ${response.status}`);
		}

		if (upload && avatar) {
			uploadAvatar(data.get("avatar"));
		}

		const json = await response.json();
		console.log(json);
		profile = json;

		toggleProfileInfo(false);

	} catch (error) {
		console.error(error.message);
	}
};

const fetchProfileInfo = async () => {

	const token = localStorage.getItem("authToken");
	const uid = localStorage.getItem("UID");

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});

	const url = `https://localhost/api/profiles/${uid}`;

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

const addAvatarSection = () => {

	const imgSize = "25%";

	return `
		<div class="pb-4 border-bottom border-2 border-dark fw-bold">
			<p>Avatar</p>
			<div id="avatar-section-1" class="text-center">
				<img src="/src/assets/avatar/avatar1.jpg" alt="Avatar image 1" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow border border-4">
				<img src="/src/assets/avatar/avatar2.jpg" alt="Avatar image 2" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar3.jpg" alt="Avatar image 3" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar4.jpg" alt="Avatar image 4" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar5.jpg" alt="Avatar image 5" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar6.jpg" alt="Avatar image 6" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<span class="d-block mt-4 fst-italic">--> &nbsp;&nbsp;<a href="" class="text-decoration-none text-black" id="custom-image" data-i18n-key="uploadCustomImage">Upload custom image</a></span>
			</div>
			<div id="avatar-section-2" class="d-none text-center">
				<input type="file" class="form-control" name="avatar" id="avatar">
				<span class="d-block mt-4 fst-italic"><a href="" class="text-decoration-none text-black" id="default-image">Select default image</a>&nbsp;&nbsp; <--</span>
			</div>
		</div>
	`;
};

const setSelectedLanguage = option => {
	if (option === profile.lang) {
		return "selected";
	}
	return "";
};

const toggleProfileInfo = editMode => {
	if (editMode) {
		document.querySelector("#profile-info").innerHTML = `
			<form action="" method="post" enctype="multipart/form-data" class="fw-bold" id="edit-profile-form">
				${addAvatarSection()}
				<div class="py-2 pt-4">
					<label for="firstname" class="form-label" data-i18n-key="firstName">First name</label>
					<input type="text" class="form-control" name="firstname" id="firstname" value="${profile.first_name}">
				</div>
				<div class="py-2">
					<label for="lastname" class="form-label" data-i18n-key="lastName">Last name</label>
					<input type="text" class="form-control" name="lastname" id="lastname" value="${profile.last_name}">
				</div>
				<div class="py-2">
					<label for="bio" class="form-label">Bio</label>
					<textarea class="form-control" name="bio" id="bio">${profile.bio}</textarea>
				</div>
				<div class="py-4 pt-2 border-bottom border-2 border-dark">
					<label for="lang" class="form-label" data-i18n-key="language">Preferred language</label>
					<select class="form-select" name="lang" id="lang">
						<option value="en" ${setSelectedLanguage("en")}>English</option>
						<option value="fr" ${setSelectedLanguage("fr")}>French</option>
						<option value="nl" ${setSelectedLanguage("nl")}>Dutch</option>
					</select>
				</div>
				<div class="pt-4 text-center fw-normal">
					<button type="button" class="btn btn-dark rounded-pill mx-2 px-4" data-i18n-key="cancel">Cancel</button>
					<button type="submit" class="btn btn-dark rounded-pill mx-2 px-4" data-i18n-key="save">Save</button>
				</div>
			</form>
		`;
	} else {
		document.querySelector("#profile-info").innerHTML = `
			<p class="text-center my-1"><img src="${profile.avatar_path}" alt="Avatar image" width="128px" height="128px" class="border border-5 box-shadow"></p>
			<p class="text-center py-3 m-0 fs-2 fw-bold fst-italic border-bottom border-2 border-dark">${profile.username}</p>
			<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="name">Name</span> : ${profile.first_name} ${profile.last_name}</p>
			<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="email">Email</span> : ${profile.email}</p>
			<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold">Bio</span> : ${profile.bio}</p>
			<p class="m-0 mt-3 text-center"><button type="button" class="btn btn-dark rounded-pill px-4" id="edit-profile-btn" data-i18n-key="editProfile">Edit profile</button></p>
		`;
	}
};

export const updateProfile = () => {
	if (localStorage.getItem("authToken")) {
		fetchProfileInfo().then(info => {
			profile = info;
			document.querySelector("#profile").innerHTML = `
				<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5">
					<div class="row p-0 text-black">
						<div class="col-md-4">
							<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5" id="profile-info">
								<p class="text-center my-1"><img src="${profile.avatar_path}" alt="Avatar image" width="128px" height="128px" class="border border-5 box-shadow"></p>
								<p class="text-center py-3 m-0 fs-2 fw-bold fst-italic border-bottom border-2 border-dark">${profile.username}</p>
								<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="name">Name</span> : ${profile.first_name} ${profile.last_name}</p>
								<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="email">Email</span> : ${profile.email}</p>
								<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold">Bio</span> : ${profile.bio}</p>
								<p class="m-0 mt-3 text-center"><button type="button" class="btn btn-dark rounded-pill px-4" id="edit-profile-btn" data-i18n-key="editProfile">Edit profile</button></p>
							</div>
						</div>
						<div class="col-md-8 mt-4 mt-md-0">
							<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
								<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesWon">Games won</span><span class="float-end">11 / 42</span></p>
								<div class="progress mb-4 bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="11" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-success" style="width: 25%"></div>
								</div>
								<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesLost">Games lost</span><span class="float-end">2 / 42</span></p>
								<div class="progress mb-4 bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="2" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-danger" style="width: 2%"></div>
								</div>
								<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesPlayed">Games played</span><span class="float-end">13 / 42</span></p>
								<div class="progress mb-4 bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="13" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-info" style="width: 26%"></div>
								</div>
								<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesPerfect">Perfect games</span><span class="float-end">2 / 42</span></p>
								<div class="progress mb-4 bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="2" aria-valuemin="0" aria-valuemax="42">
									<div class="progress-bar bg-warning" style="width: 2%"></div>
								</div>
								<p class="m-0 text-center fw-bold fs-1 fst-italic"><span data-i18n-key="rank">Rank</span> : <span class="text-warning text-shadow" style="font-size: 60px; ">1st</span></p>
							</div>
						</div>
					</div>
				</div>
			`;
		});
	} else {
		document.querySelector("#profile").innerHTML = `
			<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5">
				<form id="registration-form" action="" method="post" enctype="multipart/form-data" class="row p-0 text-black fw-bold" novalidate>
					<div class="col-md-6">
						<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
							<div class="pb-2">
								<label for="email" class="form-label" data-i18n-key="email">Email</label>
								<input type="email" class="form-control" name="email" id="email" required>
								<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
							</div>
							<div class="py-2">
								<label for="username" class="form-label" data-i18n-key="username">Username</label>
								<input type="text" class="form-control" autocomplete="username" name="username" id="username" required>
								<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
							</div>
							<div class="py-2 pb-4 border-bottom border-2 border-dark">
								<label for="password" class="form-label" data-i18n-key="password">Password</label>
								<input type="password" class="form-control" name="password" id="password" autocomplete="new-password" required>
								<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
							</div>
							<div class="py-2 pt-4">
								<label for="firstname" class="form-label" data-i18n-key="firstName">First name</label>
								<input type="text" class="form-control" name="firstname" id="firstname">
							</div>
							<div class="py-2">
								<label for="lastname" class="form-label" data-i18n-key="lastName">Last name</label>
								<input type="text" class="form-control" name="lastname" id="lastname">
							</div>
							<div class="pb-2">
								<label for="lang" class="form-label" data-i18n-key="language">Preferred language</label>
								<select class="form-select" name="lang" id="lang">
									<option value="en">English</option>
									<option value="fr">French</option>
									<option value="nl">Dutch</option>
								</select>
							</div>
						</div>
					</div>
					<div class="col-md-6 mt-4 mt-md-0">
						<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
							${addAvatarSection()}
							<div class="py-4 border-bottom border-2 border-dark">
								<label for="bio" class="form-label">Bio</label>
								<textarea class="form-control" name="bio" id="bio"></textarea>
							</div>
							<div class="pt-4 text-center">
								<button type="submit" class="btn btn-dark rounded-pill px-4" data-i18n-key="createProfile">Create profile</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		`;
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
			const parent = element.parentElement;
			for (const child of parent.children) {
				if (child.classList.contains("border")) {
					child.classList.remove("border-4");
					child.classList.remove("border");
				}
			}
			element.classList.add("border");
			element.classList.add("border-4");
			break;

		case element.matches("#custom-image"):
			e.preventDefault();
			toggleAvatarSection(true);
			break;

		case element.matches("#default-image"):
			e.preventDefault();
			toggleAvatarSection(false);
			break;

		case element.matches("#edit-profile-btn"):
			e.preventDefault();
			toggleProfileInfo(true);
			break;

		case element.matches(`#profile-info button[type="button"]`):
			e.preventDefault();
			toggleProfileInfo(false);
			break;
	}
});

document.addEventListener("submit", e => {

	const element = e.target;

	switch (true) {
		case element.matches("#registration-form"):
			e.preventDefault();
			if (validateForm(element)) {
				submitRegistrationForm(element);
			}
			break;
		case element.matches("#edit-profile-form"):
			e.preventDefault();
			submitProfileForm(element);
			break;
	}
});
