import { handleFetch } from "../api/api.js";

// export default `
// 	<div class="offcanvas offcanvas-start bg-secondary-subtle" tabindex="-1" id="friendlist" aria-labelledby="friendlistLabel">
// 		<div class="offcanvas-header p-0 d-block text-center">
// 			<h3 class="offcanvas-title d-inline-block px-5 py-2 fs-5 fw-bold rounded-4 rounded-top-0 box-shadow-subtle bg-orange" id="friendlistLabel">Friends</h3>
// 			<button type="button" class="btn-close float-end m-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
// 		</div>
// 		<div class="offcanvas-body container p-4">
// 			<div class="row user-snippet">
// 				<div class="col-4">
// 					<img src="/src/assets/avatar/avatar1.jpg" alt="User avatar" class="border-orange w-100">
// 				</div>
// 				<div class="col-8">
// 					<h4>Ziggy al'Thor</h4>
// 					<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
// 				</div>
// 			</div>
// 			<div class="input-group my-3">
// 				<span class="input-group-text bg-light" id="search"><i class="bi bi-search"></i></span>
// 				<input type="text" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="search">
// 			</div>
// 			<div class="box-shadow-inset p-4 rounded-3 bg-light">
// 				<div class="row user-snippet mb-3">
// 					<div class="col-4">
// 						<img src="/src/assets/avatar/avatar2.jpg" alt="User avatar" class="border-orange w-100">
// 					</div>
// 					<div class="col-8">
// 						<h4>Ziggy al'Thor</h4>
// 						<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
// 					</div>
// 				</div>
// 				<div class="row user-snippet">
// 					<div class="col-4">
// 						<img src="/src/assets/avatar/avatar3.jpg" alt="User avatar" class="border-orange w-100">
// 					</div>
// 					<div class="col-8">
// 						<h4 class="m">Ziggy al'Thor</h4>
// 						<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
// 					</div>
// 				</div>
// 			</div>
// 			<div class="text-center">
// 				<button id="add-friend-btn" type="button" class="btn btn-dark rounded-pill px-4 my-3 bg-orange border-0 text-dark fw-bold box-shadow-subtle" data-i18n-key="addFriend">Add Friend</button>
// 			</div>
// 		</div>
// 	</div>
// `;

const createFriendship = async () => {

	const data = {
		"user1_ID": null,
		"user2_ID": null,
		"type": "pending_first_second"
	};
	const headers = new Headers({
        "Content-Type": "application/json"
    });
    const url = "https://localhost/api/profiles/friendship/";

	try {
		const json = await handleFetch(url, "POST", JSON.stringify(data), headers);
		console.log("======= Friend Request Sent =======");
		console.log(json);
		console.log("Response status: ", response.status);
		
	} catch (error) {
		console.error(error.message);
	}
};

const createUserSnippet = (avatar_path, username, rank) => {

	const defaultAvatarPath = "/src/assets/avatar/avatar1.jpg";

	const row = document.createElement("div");
	const col1 = document.createElement("div");
	const col2 = document.createElement("div");
	const img = document.createElement("img");
	const userTitle = document.createElement("h4");
	const userDescription = document.createElement("p");
	const userRank = document.createElement("span");

	row.className = "row";
	col1.className = "col-4";
	col2.className = "col-8";

	img.classList.add("border-orange", "w-100");
	userDescription.classList.add("fst-italic");
	userRank.classList.add("fw-bold");

	if (avatar_path) {
		img.src = avatar_path;
	} else {
		img.src = defaultAvatarPath;
	}

	if (username) {
		img.alt = `${username}'s avatar`;
		userTitle.textContent = username;
	} else {
		img.alt = "Default avatar";
		userTitle.textContent = "Undefined";
	}

	if (rank) {
		userRank.textContent = rank;
	} else {
		userRank.textContent = "-42";
	}
	userDescription.textContent = "Rank: ";
	userDescription.appendChild(userRank);

	col1.appendChild(img);
	col2.appendChild(userTitle);
	col2.appendChild(userDescription);
	row.appendChild(col1);
	row.appendChild(col2);

	return row;
};

const addFriendBtn = () => {

	const div = document.createElement("div");
	const btn = document.createElement("button");
	const btnClasses = [
		"btn",
		"btn-dark",
		"rounded-pill",
		"px-4",
		"my-3",
		"bg-orange",
		"border-0",
		"text-dark",
		"fw-bold",
		"box-shadow-subtle"
	];

	btn.id = "add-friend-btn";
	btn.textContent = "Add friend";
	btn.setAttribute("type", "button");
	btn.setAttribute("data-i18n-key", "addFriend");
	btn.classList.add(...btnClasses);
	div.classList.add("text-center");
	div.appendChild(btn);
	return div;
};

const addFriendlist = async () => {

	const token = localStorage.getItem("authToken");
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});
    const url = "https://localhost/api/profiles/friendship/";

	let json;

	try {
		json = await handleFetch(url, "GET", "", headers);
		console.log("======= Friendlist : Other users =======");
		console.log(json);
	} catch (error) {
		console.error(error.message);
	}

	const fragment = document.createDocumentFragment();
	json.forEach(friend => {
		fragment.appendChild(createUserSnippet("", friend.user2_username, ""));
	});

	const container = document.createElement("div");
	container.classList.add("box-shadow-inset", "p-4", "rounded-3", "bg-light");
	container.appendChild(fragment);
	return container;
};

const addSearchBar = () => {

	const searchBar = document.createElement("div");
	const span = document.createElement("span");
	const icon = document.createElement("i");
	const input = document.createElement("input");

	searchBar.classList.add("input-group", "my-3");
	span.id = "search";
	span.classList.add("input-group-text", "bg-light");
	icon.classList.add("bi", "bi-search");

	input.className = "form-control";
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "Search");
	input.setAttribute("aria-label", "Search");
	input.setAttribute("aria-describedby", "search");

	span.appendChild(icon);
	searchBar.appendChild(span);
	searchBar.appendChild(input);

	return searchBar;
};

const addCurrentUser = async () => {

	const token = localStorage.getItem("authToken");
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});
    const urlProfile = "https://localhost/api/profiles/";
    const urlGameStats = "https://localhost/api/game/stats/";

	let jsonProfile;
	let jsonGameStats;

	try {
		jsonProfile = await handleFetch(urlProfile, "GET", "", headers);
		jsonGameStats = await handleFetch(urlGameStats, "GET", "", headers);
		console.log("======= Friendlist : Current user =======");
		console.log("Profile: ", jsonProfile[0]);
		console.log("Game Stats: ", jsonGameStats[0]);
	} catch (error) {
		console.error(error.message);
	}

	return createUserSnippet(jsonProfile[0].avatar_path, jsonProfile[0].username, jsonGameStats[0].rank);
};

const addContent = async () => {

	const fragment = document.createDocumentFragment();

	fragment.appendChild(await addCurrentUser());
	fragment.appendChild(addSearchBar());
	fragment.appendChild(await addFriendlist());
	fragment.appendChild(addFriendBtn());

	return fragment;
};

const removeFriendlistSection = () => {

	const friendlist = document.getElementById("friendlist");

	if (friendlist) {
		document.body.removeChild(friendlist);
	}
};

const addFriendlistSection = async () => {

	const friendlist = document.createElement("section");
	const header = document.createElement("div");
	const headerTitle = document.createElement("h3");
	const headerCloseBtn = document.createElement("button");
	const body = document.createElement("div");

	friendlist.id = "friendlist";
	friendlist.setAttribute("tabindex", "-1");
	friendlist.setAttribute("aria-labelledby", "friendlistLabel");
	friendlist.classList.add("offcanvas", "offcanvas-start", "bg-secondary-subtle");
	header.classList.add("offcanvas-header", "p-0", "d-block", "text-center");

	const headerTitleClasses = [
		"offcanvas-title",
		"d-inline-block",
		"px-5",
		"py-2",
		"fs-5",
		"fw-bold",
		"rounded-4",
		"rounded-top-0",
		"box-shadow-subtle",
		"bg-orange"
	];
	headerTitle.id = "friendlistLabel";
	headerTitle.classList.add(...headerTitleClasses);
	headerTitle.textContent = "Friends";

	headerCloseBtn.setAttribute("type", "button");
	headerCloseBtn.setAttribute("aria-label", "Close");
	headerCloseBtn.setAttribute("data-bs-dismiss", "offcanvas");
	headerCloseBtn.classList.add("btn-close", "float-end", "m-2");
	body.classList.add("offcanvas-body", "container", "p-4");

	header.appendChild(headerTitle);
	header.appendChild(headerCloseBtn);
	
	body.appendChild(await addContent());

	friendlist.appendChild(header);
	friendlist.appendChild(body);

	document.querySelector("#profile").insertAdjacentElement("afterend", friendlist);
};

export const updateFriendlistSection = isLoggedIn => {

	if (isLoggedIn) {
		if (!document.getElementById("friendlist")) {
			addFriendlistSection();
		}
	} else {
		removeFriendlistSection();
	}
};

// ============ Events ==============

// document.addEventListener("click", e => {

// 	const element = e.target;

// 	switch (true) {
// 		case element.matches("#add-friend-btn"):
// 			e.preventDefault();
// 			createFriendship();
// 			break;
// 	}
// });