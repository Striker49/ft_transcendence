import { translatePage } from "../localization.js";
import { validateForm } from "../utils/validation.js";

let upload = false;
let userProfile = {
	UID: "",
	id: "",
	first_name: "",
	last_name: "",
	avatar_path: "",
	bio: "",
	lang: "",
	username: "",
	email: ""
};

const clearUserProfile = () => {
	for (let [key, value] of Object.entries(userProfile)) {
		value = "";
	}
};

const printUserProfile = () => {
	console.log("======= User Profile - Start ======");
	for (const [key, value] of Object.entries(userProfile)) {
		console.log(key, " : ", value);
	}
	console.log("======= User Profile - End ======");
};

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
			"first_name": form.first_name.value,
			"last_name": form.last_name.value,
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
	}
};

const handleFetch = async (url, method, formData, headers) => {

	const response = await fetch(url, {
		method: method,
		body: JSON.stringify(formData),
		headers: headers
	});

	if (!response.ok) {
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
};

const submitEditForm = async form => {

	const formData = new FormData(form);

	const formAvatar = {};
	const formProfiles = {};
	const formUsers = {};

	for (const [key, value] of formData.entries()) {
	
		switch (key) {

			case "email": case "username":
				// if (value !== userProfile[key]) {
					formUsers[key] = value;
				// }
				break;

			case "avatar":
				formAvatar[key] = value;
				break;

			default:
				// if (value !== userProfile[key]) {
					formProfiles[key] = value;
				// }
		}
	}

	const token = localStorage.getItem("authToken");
	const uid = localStorage.getItem("UID");

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});

	const avatar_path = avatarPath(form.avatar.value);	// Temporary. Will manage uploads later on
	formProfiles.avatar_path = avatar_path;

	// const urlAvatar = "https://localhost/api/upload";
	const urlProfiles = `https://localhost/api/profiles/${uid}/`;
	const urlUsers = `https://localhost/api/users/${uid}/`;

	try {

		const json_users = await handleFetch(urlUsers, "PATCH", formUsers, headers);
		// const json_avatar = await handleFetch(urlAvatar, "POST", formAvatar, headers);
		const json_profiles = await handleFetch(urlProfiles, "PATCH", formProfiles, headers);

		console.log("======= Submitted Edit Form =======");
		console.log(json_users);
		console.log(json_profiles);

		Object.assign(userProfile, json_profiles);

		displayUserProfile();

	} catch (error) {
		console.error(error.message);
	}

	// if (upload && avatar) {
	// 	uploadAvatar(data.get("avatar"));
	// }
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
	if (option === userProfile.lang) {
		return "selected";
	}
	return "";
};

const displayButtons = isEditMode => {
	if (isEditMode) {
		return `
			<button type="button" class="btn btn-dark rounded-pill mx-2 px-4" data-i18n-key="cancel">Cancel</button>
			<button type="submit" class="btn btn-dark rounded-pill mx-2 px-4" data-i18n-key="save">Save</button>
		`;
	} else {
		return `
			<button type="submit" class="btn btn-dark rounded-pill px-4" data-i18n-key="createProfile">Create profile</button>
		`;
	}
};

const displayFormID = isEditMode => {
	if (isEditMode) {
		return "edit-form";
	} else {
		return "registration-form";
	}
};

const displayPassword = isEditMode => {
	if (isEditMode) {
		return "";
	} else {
		return `
			<div class="py-2">
				<label for="password" class="form-label" data-i18n-key="password">Password</label>
				<input type="password" class="form-control" name="password" id="password" required>
				<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
			</div>
		`;
	}
};

const displayProfileForm = isEditMode => {
	document.querySelector("#profile").innerHTML = `
		<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5">
			<form id="${displayFormID(isEditMode)}" action="" method="post" enctype="multipart/form-data" class="row p-0 text-black fw-bold" novalidate>
				<div class="col-md-6">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
						<div class="pb-2">
							<label for="email" class="form-label" data-i18n-key="email">Email</label>
							<input type="email" class="form-control" name="email" id="email" value="${userProfile.email}" required>
							<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
						</div>
						<div class="py-2">
							<label for="username" class="form-label" data-i18n-key="username">Username</label>
							<input type="text" class="form-control" name="username" id="username" value="${userProfile.username}" required>
							<p class="form-error my-0 mt-2 fst-italic lh-1" style="font-size: 12px;"></p>
						</div>
						${displayPassword(isEditMode)}
						<div class="py-2 border-top border-2 border-dark">
							<label for="firstname" class="form-label" data-i18n-key="firstName">First name</label>
							<input type="text" class="form-control" name="first_name" id="first_name" value="${userProfile.first_name}">
						</div>
						<div class="py-2">
							<label for="lastname" class="form-label" data-i18n-key="lastName">Last name</label>
							<input type="text" class="form-control" name="last_name" id="last_name" value="${userProfile.last_name}">
						</div>
						<div class="pb-2">
							<label for="lang" class="form-label" data-i18n-key="language">Preferred language</label>
							<select class="form-select" name="lang" id="lang">
								<option value="en" ${setSelectedLanguage("en")}>English</option>
								<option value="fr" ${setSelectedLanguage("fr")}>French</option>
								<option value="nl" ${setSelectedLanguage("nl")}>Dutch</option>
							</select>
						</div>
					</div>
				</div>
				<div class="col-md-6 mt-4 mt-md-0">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
						${addAvatarSection()}
						<div class="py-4 border-bottom border-2 border-dark">
							<label for="bio" class="form-label">Bio</label>
							<textarea class="form-control" name="bio" id="bio">${userProfile.bio}</textarea>
						</div>
						<div class="pt-4 text-center">
							${displayButtons(isEditMode)}
						</div>
					</div>
				</div>
			</form>
		</div>
	`;
	translatePage();
};

const displayUserProfile = () => {
	document.querySelector("#profile").innerHTML = `
		<div class="container bg-dark bg-opacity-75 rounded-5 mt-5 p-5">
			<div class="row p-0 text-black">
				<div class="col-md-4">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5" id="profile-info">
						<p class="text-center my-1"><img src="${userProfile.avatar_path}" alt="Avatar image" width="128px" height="128px" class="border border-5 box-shadow"></p>
						<p class="text-center py-3 m-0 fs-2 fw-bold fst-italic border-bottom border-2 border-dark">${userProfile.username}</p>
						<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="name">Name</span> : ${userProfile.first_name} ${userProfile.last_name}</p>
						<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="email">Email</span> : ${userProfile.email}</p>
						<p class="py-3 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold">Bio</span> : ${userProfile.bio}</p>
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
	translatePage();
};

export const updateProfile = () => {
	if (localStorage.getItem("authToken")) {
		fetchProfileInfo().then(info => {
			userProfile = info;
			displayUserProfile();
		});
	} else {
		clearUserProfile();
		displayProfileForm(false);
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
			displayProfileForm(true);
			translatePage();
			break;

		case element.matches(`#profile button[type="button"]`):
			e.preventDefault();
			displayUserProfile();
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
		case element.matches("#edit-form"):
			e.preventDefault();
			if (validateForm(element)) {
				submitEditForm(element);
			}
			break;
	}
});
