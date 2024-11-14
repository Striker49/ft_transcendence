import { handleFetch } from "../api/api.js";
import { translatePage } from "../localization.js";
import { addSpan, clearSpan, printError } from "../utils/validation.js";

const getSpan = () => document.querySelector("#friendlist .form-error");

const hasParent = (parent, element) => {

	while (element) {
		if (element === parent) {
			return true;
		}
		element = element.parentElement;
	}
	return false;
};

const addButton = button => {

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
		"box-shadow-subtle",
		"text-center",
		"mx-2"
	];

	btn.id = button.id;
	btn.textContent = button.text;
	btn.setAttribute("type", "button");
	btn.setAttribute("data-i18n-key", button.langClass);
	btn.classList.add(...btnClasses);
	return btn;
};

const addButtons = buttons => {

	const friendlistButtons = document.createElement("div");

	friendlistButtons.id = "friendlistButtons";
	friendlistButtons.className = "text-center";
	buttons.forEach(button => {
		friendlistButtons.appendChild(addButton(button));
	});
	return friendlistButtons;
};

const addImage = (src, alt, id) => {

	const img = document.createElement("img");

	img.src = src;
	img.alt = alt;
	img.className = id;
	img.style.width = "100%";
	return img;
};

const fetchUserStats = async username => {

	const headers = new Headers({
		"Content-Type": "application/json",
	});
	const url = `https://localhost/api/game/stats/?search=${username}`;

	try {
		const json = await handleFetch(url, "GET", "", headers);
		return json;
	} catch (error) {
		console.error(error.message);
	}
};

const searchProfile = async username => {

	const headers = new Headers({
        "Content-Type": "application/json"
    });
	const url = `https://localhost/api/profiles/?search=${username}`;

	try {
		const json = await handleFetch(url, "GET", "", headers);
		return json;
	} catch (error) {
		console.error(error.message);
		return null;
	}
};

const addFriendshipIcons = async friendship => {

	const icons = document.createDocumentFragment();
	const uid = localStorage.getItem("UID");

	if (friendship.type == "friends") {
		const username = uid == friendship.user2_ID ? friendship.user1_username : friendship.user2_username;
		const profile = await searchProfile(username);
		if (profile && profile[0].status === "on") {
			icons.appendChild(addImage("/src/assets/icons/online.png", "Online", "online"));
			// if (profile.status === "on") {
			// 	icons.appendChild(addImage("/src/assets/icons/online.png", "Online", "online"));
			// } else if (profile.status === "in_game") {
			// 	icons.appendChild(addImage("/src/assets/icons/in-game.png", "In-game", "in-game"));
			// } else {
			// 	icons.appendChild(addImage("/src/assets/icons/offline.png", "Offline", "offline"));
			// }
		} else {
			icons.appendChild(addImage("/src/assets/icons/offline.png", "Offline", "offline"));
		}
	} else {
		if ((friendship.type == "pending_first_second" && uid == friendship.user1_ID) ||
			(friendship.type == "pending_second_first" && uid == friendship.user2_ID)) {
			icons.appendChild(addImage("/src/assets/icons/question-mark.png", "Pending connection", "pending-connection"));
		} else {
			icons.appendChild(addImage("/src/assets/icons/x.png", "Decline invitation", "decline-invitation"));
			icons.appendChild(addImage("/src/assets/icons/check.png", "Accept invitation", "accept-invitation"));
		}
	}
	return icons;
};

const createUserSnippet = async (avatar_path, username, rank, friendship) => {

	const defaultAvatarPath = "/src/assets/avatar/avatar1.jpg";

	const row = document.createElement("div");
	const col1 = document.createElement("div");
	const col2 = document.createElement("div");
	const col3 = document.createElement("div");
	const img = document.createElement("img");
	const userTitle = document.createElement("h4");
	const userDescription = document.createElement("p");
	const userRank = document.createElement("span");

	row.classList.add("row", "py-1", "mb-2");
	col1.className = "col-4";
	col2.classList.add("col-6", "friend-info");
	col3.classList.add("col-2", "friend-icons");

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
	// userDescription.setAttribute("data-i18n-key", "rank");
	userDescription.appendChild(userRank);

	if (friendship) {		
		col3.appendChild(await addFriendshipIcons(friendship));
	}
	col1.appendChild(img);
	col2.appendChild(userTitle);
	col2.appendChild(userDescription);
	row.appendChild(col1);
	row.appendChild(col2);
	row.appendChild(col3);

	return row;
};

const acceptFriendship = async (friendshipId, element) => {

	const token = localStorage.getItem("authToken");
	const data = {
		"type": "friends"
	};
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});
    const url = `https://localhost/api/profiles/friendship/${friendshipId}/`;

	try {
		const json = await handleFetch(url, "PATCH", JSON.stringify(data), headers);
		element.replaceChildren(await addFriendshipIcons(json));
		console.log("======= Friendship updated =======");
		console.log(json);
	} catch (error) {
		console.error(error.message);
	}
};

const removeFriendship = async (friendshipId, element) => {

	const token = localStorage.getItem("authToken");
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});
    const url = `https://localhost/api/profiles/friendship/${friendshipId}/`;

	try {
		const response = await fetch(url, {
			method: "DELETE",
			headers: headers
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		console.log("======= Friendship deleted =======");
		element.remove();
	} catch (error) {
		console.error(error.message);
	}
};

const createFriendship = async uid2 => {

	const token = localStorage.getItem("authToken");
	const uid1 = localStorage.getItem("UID");

	const data = {
		"user1_ID": uid1 < uid2 ? uid1 : uid2,
		"user2_ID": uid1 > uid2 ? uid1 : uid2,
		"type": uid1 < uid2 ? "pending_first_second" : "pending_second_first"
	};
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`
	});
    const url = "https://localhost/api/profiles/friendship/";

	try {
		const json = await handleFetch(url, "POST", JSON.stringify(data), headers);
		console.log("======= Friend Request Sent =======");
		console.log(json);
		document.querySelector("#friendlist .offcanvas-body").appendChild(await toggleContent(false));
	} catch (error) {
		console.error(error.message);
	}
};

const getFriendlist = async () => {

	const token = localStorage.getItem("authToken");
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});
    const url = "https://localhost/api/profiles/friendship/";

	try {
		const json = await handleFetch(url, "GET", "", headers);
		console.log("======= Friendlist : Other users =======");
		console.log(json);
		return json;
	} catch (error) {
		console.error(error.message);
		return "";
	}
};	

const getFriendshipID = async user => {

	const friendlist = await getFriendlist();

	if (friendlist) {
		for (const friend of friendlist) {
			if (user == friend.user1_username || user == friend.user2_username) {
				return friend.friendship_id;
			}
		}
	}
	return null;
};

const getIcons = row => {

	for (const child of row.children) {
		if (child.classList.contains("friend-icons")) {
			return child;
		}
	}
	return null;
};

const getRow = element => {

	const friendlist = document.querySelector("#friends");

	while (element.parentElement !== friendlist) {
		element = element.parentElement;
	}
	return element;
};

const getUser = row => {

	for (const child of row.children) {
		if (child.classList.contains("friend-info")) {
			return child.firstElementChild.textContent;
		}
	}
	return null;
};

const handleFriendship = (element, status) => {

	const row = getRow(element);
	const user = getUser(row);

	if (user) {
		getFriendshipID(user).then(id => {
			if (id) {
				if (status) {
					acceptFriendship(id, getIcons(row));
				} else {
					removeFriendship(id, row);
				}
			}
		});
	} else {
		alert ("No user selected !");
	}
};

const selectRow = element => {

	const friendlist = document.querySelector("#friends");

	while (element.parentElement !== friendlist) {
		element = element.parentElement;
	}
	if (element.classList.contains("row-selected")) {
		element.classList.remove("row-selected");
	} else {
		element.classList.add("row-selected");
	}
};

const checkIfUserExists = async input => {

	const headers = new Headers({
        "Content-Type": "application/json"
    });
	const url = `https://localhost/api/profiles/?search=${input}`;

	try {
		const json = await handleFetch(url, "GET", "", headers);
		return json;
	} catch (error) {
		console.error(error.message);
		return "";
	}
};

const displayProfiles = async input => {

	const headers = new Headers({
        "Content-Type": "application/json"
    });
	const url = "https://localhost/api/profiles/";

	let json;

	try {
		json = await handleFetch(url, "GET", "", headers);
	} catch (error) {
		console.error(error.message);
	}

	const fragment = document.createDocumentFragment();
	json.forEach(profile => {
		if (profile.username.startsWith(input)) {
			const entry = document.createElement("li");
			entry.classList.add("px-1");
			entry.textContent = profile.username;
			fragment.appendChild(entry);
		}
	});
	return fragment;
};

const addFriendlist = async () => {

	const friendlist = await getFriendlist();
	const fragment = document.createDocumentFragment();
	const uid = localStorage.getItem("UID");

	for (const friend of friendlist) {
		if (uid == friend.user1_ID) {
			const userProfile = await searchProfile(friend.user2_username);
			const userStats = await fetchUserStats(friend.user2_username);
			fragment.appendChild(await createUserSnippet(userProfile[0].avatar_path, friend.user2_username, userStats[0].rank, friend));
		} else {
			const userProfile = await searchProfile(friend.user1_username);
			const userStats = await fetchUserStats(friend.user1_username);
			fragment.appendChild(await createUserSnippet(userProfile[0].avatar_path, friend.user1_username, userStats[0].rank, friend));
		}
	}

	const container = document.createElement("div");
	container.id = "friends";
	container.classList.add("box-shadow-inset", "p-4", "mt-4", "mb-3", "rounded-3", "bg-light");
	container.appendChild(fragment);
	return container;
};

const addSearchBar = () => {

	const searchBar = document.createElement("div");
	const span = document.createElement("span");
	const icon = document.createElement("i");
	const input = document.createElement("input");
	const dropdown = document.createElement("ul");

	searchBar.id = "searchBar";
	searchBar.classList.add("input-group", "mt-4", "mb-3", "dropdown");
	span.id = "search";
	span.classList.add("input-group-text", "bg-light");
	icon.classList.add("bi", "bi-search");

	input.classList.add("form-control", "dropdown-toggle");
	input.setAttribute("type", "text");
	input.setAttribute("placeholder", "Search");
	input.setAttribute("aria-label", "Search");
	input.setAttribute("aria-describedby", "search");
	input.setAttribute("data-bs-toggle", "dropdown");

	dropdown.classList.add("dropdown-menu", "overflow-y-scroll", "rounded-0");

	span.appendChild(icon);
	searchBar.appendChild(span);
	searchBar.appendChild(input);
	searchBar.appendChild(dropdown);

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

	const currentUser = createUserSnippet(jsonProfile[0].avatar_path, jsonProfile[0].username, jsonGameStats[0].rank, "");
	currentUser.id = "currentUser";
	return currentUser;
};

const toggleContent = async isSearchMode => {

	const fragment = document.createDocumentFragment();
	const friendlist = document.querySelector("#friendlist .offcanvas-body");

	if (isSearchMode) {
		if (friendlist) {
			friendlist.removeChild(document.getElementById("friends"));
			friendlist.removeChild(document.querySelector("#friendlist .form-error"));
			friendlist.removeChild(document.getElementById("friendlistButtons"));
		}
		fragment.appendChild(addSearchBar());
		fragment.appendChild(addSpan());
		fragment.appendChild(addButtons([
		{
			id: "cancel-friend-btn",
			text: "Cancel",
			langClass: "cancel"
		},
		{
			id: "invite-friend-btn",
			text: "Invite",
			langClass: "invite"
		}
		]));
	} else {
		if (friendlist) {
			friendlist.removeChild(document.getElementById("searchBar"));
			friendlist.removeChild(document.querySelector("#friendlist .form-error"));
			friendlist.removeChild(document.getElementById("friendlistButtons"));
		}
		fragment.appendChild(await addFriendlist());
		fragment.appendChild(addSpan());
		fragment.appendChild(addButtons([
		{
			id: "remove-friend-btn",
			text: "Remove friend",
			langClass: "removeFriend"
		},
		{
			id: "add-friend-btn",
			text: "Add friend",
			langClass: "addFriend"
		}
		]));
	}
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
	const buttons = document.createElement("div");

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
	headerTitle.textContent = "Friendlist";
	headerTitle.setAttribute("data-i18n-key", "friendlist");

	headerCloseBtn.setAttribute("type", "button");
	headerCloseBtn.setAttribute("aria-label", "Close");
	headerCloseBtn.setAttribute("data-bs-dismiss", "offcanvas");
	headerCloseBtn.classList.add("btn-close", "m-2", "position-absolute", "end-0");
	body.classList.add("offcanvas-body", "container", "p-4");

	header.appendChild(headerTitle);
	header.appendChild(headerCloseBtn);
	
	body.appendChild(await addCurrentUser());
	body.appendChild(await toggleContent(false));
	
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

document.addEventListener("click", e => {

	const element = e.target;

	switch (true) {

		case element.matches("#add-friend-btn"):
			e.preventDefault();
			toggleContent(true).then(content => {
				document.querySelector("#friendlist .offcanvas-body").appendChild(content);
				translatePage();
			});
			break;

		case element.matches("#cancel-friend-btn"):
			e.preventDefault();
			toggleContent(false).then(content => {
				document.querySelector("#friendlist .offcanvas-body").appendChild(content);
				translatePage();
			});
			break;
		
		case element.matches("#invite-friend-btn"):
			e.preventDefault();
			const input = document.querySelector("#searchBar input").value;
			if (input) {
				if (input == localStorage.getItem("username")) {
					printError(getSpan(), "sameUser", "Cannot add yourself as a friend.");
					// alert("Cannot add yourself as a friend.");
				} else {
					checkIfUserExists(input).then(user => {
						if (user) {
							createFriendship(user[0].UID);
						} else {
							printError(getSpan(), "userNotFound", "Username not found. Please provide an existing username");
							// alert("Username not found. Please provide an existing username");
						}
					});
				}
			} else {
				printError(getSpan(), "usernameRequired", "Username is required");
				// alert ("Please provide a username");
			}
			break;
		
		case element.matches("#remove-friend-btn"):
			e.preventDefault();
			const rows = document.querySelectorAll(".row-selected");
			if (rows.length) {
				clearSpan(getSpan());
				rows.forEach(friend => {
					handleFriendship(friend, false);
				});
			} else {
				printError(getSpan(), "selectFriends", "You must select friends first.");
				// alert("You must select friends first.");
			}
			break;

		case element.matches(".decline-invitation"):
			e.preventDefault();
			handleFriendship(element, false);
			break;

		case element.matches(".accept-invitation"):
			e.preventDefault();
			handleFriendship(element, true);
			break;

		case element.matches("#friendlist .dropdown-menu li"):
			e.preventDefault();
			document.querySelector("#searchBar input").value = element.textContent;
			break;

		// Has to be at the end in order not to override the other cases
		case hasParent(document.querySelector("#friends"), element):
			e.preventDefault();
			selectRow(element);
			break;
	}
});

document.addEventListener("input", e => {

	const element = e.target;

	switch (true) {
		case element.matches("#searchBar input"):
			e.preventDefault();
			if (element.value) {
				displayProfiles(element.value).then(profiles => {
					document.querySelector("#friendlist .dropdown-menu").replaceChildren(profiles);
				});
			}
			break;
	}
});