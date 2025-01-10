import { login } from "./login.js";
import { translatePage, fetchTranslationsFor, setLanguage } from "../localization.js";
import { validateForm } from "../utils/validation.js";
import { handleFetch } from "../api/api.js";
import { updateFriendlistSection } from "./friendlist.js"
import { sanitizeJSON, sanitizeString } from "../utils/sanitize.js"
import { printError } from "../utils/validation.js";
import { uppercaseEveryWord } from "../utils/string.js";

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
	email: "",
	id_42: ""
};

const clearUserProfile = () => {
	for (const key of Object.keys(userProfile)) {
		userProfile[key] = "";
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
        // =========== Custom avatar url ============
        return `https://localhost/api/media/images/${customURL}/`;
    }
    return null;
};

const uploadAvatar = async avatar => {

    const url = "https://localhost/api/profiles/avatar/";

    const formData = new FormData();
    formData.append("image_url", avatar);
    console.log(formData.get("image_url"));

    const token = localStorage.getItem("authToken");
    const headers = new Headers({
        "Authorization": `Token ${token}`
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        console.log("Image Upload Successful");
		return await response.json();

    } catch (error) {
        console.error(error.message);
		return "";
    }
};

const createResponse = () => {

	const response = document.createElement("div");
	const responseHeading = document.createElement("h3");
	const responseText = document.createElement("span");
	const responseIcon = document.createElement("i");
	const classes = [
		"container",
		"h-100",
		"position-absolute",
		"top-0",
		"start-50",
		"translate-middle-x",
		"bg-dark",
		"bg-opacity-75",
		"rounded-5",
		"text-white",
		"d-flex",
		"align-items-center",
		"justify-content-center"
	];
	const currentLang = localStorage.getItem("lang");

	switch (currentLang) {
		case "fr": responseText.textContent = "Inscription réussie"; break;
		case "nl": responseText.textContent = "Registratie succesvol"; break;
		default: responseText.textContent = "Registration successful"; break;
	}
	response.id = "response";
	response.classList.add(...classes);
	responseText.setAttribute("data-i18n-key", "formSubmittedCorrectly");
	responseIcon.classList.add("bi", "bi-check-circle-fill", "ms-2", "text-success");
	responseHeading.appendChild(responseText);
	responseHeading.appendChild(responseIcon);
	response.appendChild(responseHeading);
	return response;
};

const createLangKey = str => {

	let langKey = null;

	if (!str) {
		return "";
	}
	langKey = uppercaseEveryWord(str);
	langKey = langKey.replace(/ /g, "");
	langKey = langKey[0].toLowerCase() + langKey.slice(1);
	if (langKey[langKey.length - 1] === ".") {
		langKey = langKey.slice(0, -1);
	}
	return langKey;
};

const showFormErrors = error => {

	const obj = JSON.parse(error);

	for (const key of Object.keys(obj)) {
		if (key === "email") {
			printError(document.querySelector("#email + .form-error"), createLangKey(obj.email[0]), obj[key]);
		} else if (key === "username") {
			printError(document.querySelector("#username + .form-error"), createLangKey(obj.username[0]), obj[key]);
		} else {
			alert ("Unexpected error in profile section");
		}
	}
};

const submitRegistrationForm = async form => {

    const data = new FormData(form);

    console.log("========= Avatar =========");
    console.log("Custom avatar name : ", data.get("avatar").name);
    console.log("Custom avatar size : ", data.get("avatar").size);

    const avatar = avatarPath(data.get("avatar").name);
    console.log("Avatar Path : ", avatar);

    const formData = {
        "email": form.email.value,
        "username": form.username.value,
        "password": form.password.value,
        "profile": {
            "first_name": form.first_name.value,
            "last_name": form.last_name.value,
            "avatar_path": avatar,
            "bio": form.bio.value,
            "lang": form.lang.value
        }
    };
    const headers = new Headers({
        "Content-Type": "application/json"
    });
    const url = "https://localhost/api/users/registration/";

    try {
		const response = await handleFetch(url, "POST", JSON.stringify(formData), headers);
		await login(form, false);
        // ======== Upload if custom avatar =========
        if (upload && data.get("avatar").size > 0) {
            await uploadAvatar(data.get("avatar"));
			upload = false;
		}
		const responseMsg = createResponse();
		document.getElementById("profile").appendChild(responseMsg);
		setTimeout(() => { responseMsg.style.opacity = "1"; }, 100);
		setTimeout(() => { updateProfile(); }, 2000);
    } catch (error) {
		showFormErrors(error.message);
    }
};

const submitProfileForm = async form => {

	const data = new FormData(form);

	console.log("========= Avatar =========");
    console.log("Custom avatar name : ", data.get("avatar").name);
    console.log("Custom avatar size : ", data.get("avatar").size);

    const avatar = avatarPath(data.get("avatar").name);
    console.log("Avatar Path : ", avatar);

	const formUsers = {
		"email": form.email.value,
        "username": form.username.value
	};
	const formProfiles = {
		"first_name": form.first_name.value,
		"last_name": form.last_name.value,
		"bio": form.bio.value,
		"lang": form.lang.value
	};
	if (avatar) {
		formProfiles.avatar_path = avatar;
	}

	const token = localStorage.getItem("authToken");
	const uid = localStorage.getItem("UID");
	localStorage.setItem("lang", form.lang.value);

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});

	const urlProfiles = `https://localhost/api/profiles/${uid}/`;
	const urlUsers = `https://localhost/api/users/${uid}/`;

	try {

		const json_users = await handleFetch(urlUsers, "PATCH", JSON.stringify(formUsers), headers);
		const json_profiles = await handleFetch(urlProfiles, "PATCH", JSON.stringify(formProfiles), headers);
		Object.assign(userProfile, sanitizeJSON(json_profiles));

		// ======== Upload if custom avatar =========
        if (upload && data.get("avatar").size > 0) {
            const newAvatar = await uploadAvatar(data.get("avatar"));
			userProfile.avatar_path = newAvatar.image_url;
			upload = false;
        }
		displayUserProfile();

	} catch (error) {
		showFormErrors(error.message);
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
		const json = await handleFetch(url, "GET", "", headers);
		console.log("======= Profile Info =======");
		console.log(json);
		return json;
	} catch (error) {
		console.error(error.message);
		return "";
	}
};

const fetchGamesHistory = async () => {

	const token = localStorage.getItem("authToken");

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});

	const url = `https://localhost/api/game/played`;

	try {
		const json = await handleFetch(url, "GET", "", headers);
		console.log("======= Games History =======");
		console.log(json);
		return json;
	} catch (error) {
		console.error(error.message);
		return null;
	}
};

const listGamesHistory = async () => {

	const gamesHistory = await fetchGamesHistory();

	if (gamesHistory[0]) {

		const gamesHistoryDiv = document.querySelector("#games-history");
		let localTranslations = JSON.parse(localStorage.getItem("translations"));
		if (localTranslations == null)
			localTranslations = await fetchTranslationsFor(localStorage.getItem("lang") || document.querySelector("[lang]").getAttribute("lang"));

		gamesHistoryDiv.innerHTML = "";
		gamesHistory.forEach(game => {
			let player2 = sanitizeString(game.username_player2) || "<span data-i18n-key=\"CPU\">" + localTranslations["CPU"] + "</span>";
			if (player2 == "Player 2" || player2 == "Joueur 2" || player2 == "Speler 2")
				player2 = "<span data-i18n-key=\"playerTwo\">" + player2 + "</span>";
			const status = game.score_player1 > game.score_player2 ? "<span data-i18n-key=\"won\">" + localTranslations["won"] + "</span>" : "<span data-i18n-key=\"lost\">" + localTranslations["lost"] + "</span>";
			gamesHistoryDiv.insertAdjacentHTML("afterbegin", `
				<div class="row">
					<p class="col-12 col-sm-3 date">${game.created.slice(0, -3)}</p>
					<p class="col-12 col-sm-3 vs">vs. ${player2}</p>
					<p class="col-12 col-sm-3 score"><span data-i18n-key="score">Score</span>: ${game.score_player1} <span data-i18n-key="to">${localTranslations["to"]}</span> ${game.score_player2}</p>
					<p class="col-12 col-sm-3 status fw-bold">${status}</p>
				</div>
			`);
		});
	} else {
		document.querySelector("#games-history").innerHTML = `
			<div class="row">
				<p data-i18n-key="noGamesPlayed">No games played yet.</p>
			</div>
		`;
	}
};

const fetchUserStats = async () => {

	const token = localStorage.getItem("authToken");

	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});

	const url = `https://localhost/api/game/stats`;

	try {
		const json = await handleFetch(url, "GET", "", headers);
		console.log("======= User Stats =======");
		console.log(json);
		return json;
	} catch (error) {
		console.error(error.message);
		return null;
	}
};

const updateStat = (selector, stat) => {
	selector.querySelector("span.float-end").textContent = `${stat} / 42`;
	selector.querySelector("div.progress").setAttribute("aria-valuenow", stat);
	selector.querySelector("div.progress-bar").style.transition = "width 1s ease";
	selector.querySelector("div.progress-bar").style.width = `${Math.min((stat / 42) * 100, 100)}%`;
};

const updateUserStats = async () => {

	const userStats = await fetchUserStats();

	if (userStats) {

		updateStat(document.querySelector("#gamesWon"), userStats[0].wins);
		updateStat(document.querySelector("#gamesLost"), userStats[0].losses);
		updateStat(document.querySelector("#gamesPlayed"), userStats[0].total_games);
		// updateStat(document.querySelector("#gamesPerfect"), userStats[0].perfect);

		document.querySelector("#rank").textContent = userStats[0].rank || "-42";
	} else {
		document.querySelector("#rank").textContent = "-42";
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

const addAvatarSection = isEditMode => {

	const imgSize = "25%";
	const setBorder = !isEditMode ? "border border-4" : "";

	return `
		<div class="pb-4 border-bottom border-2 border-dark fw-bold">
			<p>Avatar</p>
			<div id="avatar-section-1" class="text-center">
				<img src="/src/assets/avatar/avatar1.jpg" alt="Avatar image 1" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow ${setBorder}">
				<img src="/src/assets/avatar/avatar2.jpg" alt="Avatar image 2" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar3.jpg" alt="Avatar image 3" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar4.jpg" alt="Avatar image 4" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar5.jpg" alt="Avatar image 5" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<img src="/src/assets/avatar/avatar6.jpg" alt="Avatar image 6" width="${imgSize}" height="${imgSize}" class="m-2 box-shadow">
				<span class="d-block mt-4 fst-italic">--> &nbsp;&nbsp;<a href="" class="text-decoration-none text-black" id="custom-image" data-i18n-key="uploadCustomImage">Upload custom image</a></span>
			</div>
			<div id="avatar-section-2" class="d-none text-center">
				<p id="avatar-file"></p>
				<label for="avatar" class="btn btn-dark rounded-pill px-4" data-i18n-key="uploadCustomImage">Upload Custom Image</label>
				<input type="file" class="form-control d-none" name="avatar" id="avatar">
				<span class="d-block mt-4 fst-italic"><a href="" class="text-decoration-none text-black" id="default-image" data-i18n-key="selectDefaultImage">Select default image</a>&nbsp;&nbsp; <--</span>
			</div>
		</div>
	`;
};

const setSelectedLanguage = option => {
	if (option === localStorage.getItem("lang")) {
		return "selected";
	}
	return "";
};

const displayBio = () => {
	
	if (!userProfile.bio || userProfile.bio === "null") {
		return "You are an amazing Pong player seeking retribution for the slaughtering of the Atari 2600. Please remain civil.";
	}
	return userProfile.bio;
};

const displayButtons = isEditMode => {
	if (isEditMode) {
		return `
			<button type="button" id="edit-cancel-btn" class="btn btn-dark rounded-pill m-2 px-4" data-i18n-key="cancel">Cancel</button>
			<button type="submit" class="btn btn-dark rounded-pill m-2 px-4" data-i18n-key="save">Save</button>
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
		<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
			<form id="${displayFormID(isEditMode)}" action="" method="post" enctype="multipart/form-data" class="row p-0 text-black fw-bold" novalidate>
				<div class="col-md-6">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 h-100">
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
							<label for="first_name" class="form-label" data-i18n-key="firstName">First name</label>
							<input type="text" class="form-control" name="first_name" id="first_name" value="${userProfile.first_name}">
						</div>
						<div class="py-2">
							<label for="last_name" class="form-label" data-i18n-key="lastName">Last name</label>
							<input type="text" class="form-control" name="last_name" id="last_name" value="${userProfile.last_name}">
						</div>
						<div class="pb-2">
							<label for="lang" class="form-label" data-i18n-key="language">Preferred language</label>
							<select class="form-select" name="lang" id="lang">
								<option value="en" ${setSelectedLanguage("en")}>English</option>
								<option value="fr" ${setSelectedLanguage("fr")}>Français</option>
								<option value="nl" ${setSelectedLanguage("nl")}>Nederlands</option>
							</select>
						</div>
					</div>
				</div>
				<div class="col-md-6 mt-4 mt-md-0">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 h-100">
						${addAvatarSection(isEditMode)}
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

	const link42Btn = userProfile.id_42 <= 0 ? `<a href="https://localhost/api/users/42/login/" class="btn btn-dark border-0 rounded-pill bg-orange text-dark fw-bold px-4 m-2" data-i18n-key="linkWith42">Link with 42</a>` : "";

	document.querySelector("#profile").innerHTML = `
		<div class="container bg-dark bg-opacity-75 rounded-5 p-5">
			<div class="row p-0 text-black">
				<div class="col-md-5">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 h-100" id="profile-info">
						<p class="text-center my-1"><img src="${userProfile.avatar_path}" alt="Avatar image" width="40%" height="40%" class="border border-5 box-shadow"></p>
						<p class="text-center py-4 m-0 fs-2 fw-bold fst-italic border-bottom border-2 border-dark">${userProfile.username}</p>
						<p class="py-4 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="name">Name</span> : ${userProfile.first_name} ${userProfile.last_name}</p>
						<p class="py-4 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold" data-i18n-key="email">Email</span> : ${userProfile.email}</p>
						<p class="py-4 px-2 m-0 border-bottom border-2 border-dark"><span class="fw-bold">Bio</span> : ${displayBio()}</p>
						<p class="m-0 mt-4 text-center">
							<button type="button" class="btn btn-dark rounded-pill px-4 m-2" data-bs-toggle="offcanvas" data-i18n-key="friendlist" data-bs-target="#friendlist" aria-controls="friendlist">Friendlist</button>
							${link42Btn}
							<button type="button" class="btn btn-dark rounded-pill px-4 m-2" id="edit-profile-btn" data-i18n-key="editProfile">Edit profile</button>
						</p>
					</div>
				</div>
				<div class="col-md-7 mt-4 mt-md-0">
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5">
						<div id="gamesWon" class="mb-3">
							<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesWon">Games won</span><span class="float-end">0 / 42</span></p>
							<div class="progress bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="42">
								<div class="progress-bar bg-success" style="width: 0%;"></div>
							</div>
						</div>
						<div id="gamesLost" class="mb-3">
							<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesLost">Games lost</span><span class="float-end">0 / 42</span></p>
							<div class="progress bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="42">
								<div class="progress-bar bg-danger" style="width: 0%;"></div>
							</div>
						</div>
						<div id="gamesPlayed" class="mb-3">
							<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesPlayed">Games played</span><span class="float-end">0 / 42</span></p>
							<div class="progress bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="42">
								<div class="progress-bar bg-info" style="width: 0%;"></div>
							</div>
						</div>
						<div id="gamesPerfect" class="mb-3">
							<p class="mb-2"><span class="fw-bold" data-i18n-key="gamesPerfect">Perfect games</span><span class="float-end">0 / 42</span></p>
							<div class="progress bg-dark box-shadow" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="42">
								<div class="progress-bar bg-warning" style="width: 0%;"></div>
							</div>
						</div>
						<p class="m-0 text-center fw-bold fs-1 fst-italic"><span data-i18n-key="rank">Rank</span> : <span class="text-shadow" id="rank" style="font-size: 60px; color: orange"></span></p>
					</div>
					<div class="p-4 bg-info bg-opacity-50 border border-5 border-info rounded-5 mt-4">
						<p class="mb-2 fw-bold" data-i18n-key="gameHistory">Game history</p>
						<div class="bg-dark rounded-5 p-2 box-shadow text-white text-center custom-scrollbar-css" id="games-history"></div>
					</div>
				</div>
			</div>
		</div>
	`;
	updateUserStats();
	listGamesHistory();
	translatePage();
};

const fetchAndDisplayProfile = async () => {
	const info = await fetchProfileInfo();
	userProfile = sanitizeJSON(info);
	displayUserProfile();
};

export const updateProfile = () => {
	if (localStorage.getItem("authToken")) {
		fetchAndDisplayProfile();
		updateFriendlistSection(true);
	} else {
		clearUserProfile();
		displayProfileForm(false);
		updateFriendlistSection(false);
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

document.addEventListener("change", e => {

	const element = e.target;

	switch (true) {
		case element.matches("#avatar-section-2 #avatar"):
			document.querySelector("#avatar-file").textContent = element.files[0].name;
			break;
	}
});

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

		case element.matches("#edit-cancel-btn"):
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
				submitProfileForm(element);
				setLanguage();
			}
			break;
	}
});
