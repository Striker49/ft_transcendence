import { handleFetch } from "../api/api.js";
// import { addSpan } from "../utils/validation.js";

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

const addFriendshipIcons = friendship => {

	const icons = document.createDocumentFragment();
	const uid = localStorage.getItem("UID");

	if (friendship.type == "friends") {
		icons.appendChild(addImage("/src/assets/icons/input-gaming-icon-lg.png", "In-game", "user-in-game"));
	} else {
		if ((friendship.type == "pending_first_second" && uid == friendship.user1_ID) ||
			(friendship.type == "pending_second_first" && uid == friendship.user2_ID)) {
			icons.appendChild(addImage("/src/assets/icons/question-mark.webp", "Pending connection", "pending-connection"));
		} else {
			icons.appendChild(addImage("/src/assets/icons/x.png", "Decline invitation", "decline-invitation"));
			icons.appendChild(addImage("/src/assets/icons/check.png", "Accept invitation", "accept-invitation"));
		}
	}
	return icons;
};

const createUserSnippet = (avatar_path, username, rank, friendship) => {

	const defaultAvatarPath = "/src/assets/avatar/avatar1.jpg";

	const row = document.createElement("div");
	const col1 = document.createElement("div");
	const col2 = document.createElement("div");
	const col3 = document.createElement("div");
	const img = document.createElement("img");
	const userTitle = document.createElement("h4");
	const userDescription = document.createElement("p");
	const userRank = document.createElement("span");

	row.classList.add("row", "mb-3");
	col1.className = "col-4";
	col2.className = "col-6";
	col3.className = "col-2";

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

	if (friendship) {		
		col3.appendChild(addFriendshipIcons(friendship));
	}
	col1.appendChild(img);
	col2.appendChild(userTitle);
	col2.appendChild(userDescription);
	row.appendChild(col1);
	row.appendChild(col2);
	row.appendChild(col3);

	return row;
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
		"Authorization": `Token ${token}`,
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

const updateFriendship = async (friendshipId, element, status) => {

	const token = localStorage.getItem("authToken");
	const data = {
		"type": "friends"
	};
	const headers = new Headers({
		"Content-Type": "application/json",
		"Authorization": `Token ${token}`,
	});
    const url = `https://localhost/api/profiles/friendship/${friendshipId}/`;

	let json;

	try {
		if (status) {
			json = await handleFetch(url, "PATCH", JSON.stringify(data), headers);
			element.replaceChildren(addFriendshipIcons(json));
		} else {
			console.log("Yo");
			json = await handleFetch(url, "DELETE", "", headers);
			element.remove();
		}
		console.log("======= Friendship updated =======");
		console.log(json);
		
	} catch (error) {
		console.error(error.message);
	}
};

const handleInvitation = (icon, status) => {

	const user = icon.parentElement.previousSibling.firstElementChild.textContent;

	if (user) {
		getFriendshipID(user).then(id => {
			if (id) {
				if (status) {
					updateFriendship(id, icon.parentElement, status);
				} else {
					updateFriendship(id, icon.parentElement.parentElement, status);
				}
			}
		});
	} else {
		alert ("No user selected !");
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
			entry.textContent = profile.username;
			fragment.appendChild(entry);
		}
	});
	return fragment;
};

const addFriendlist = async () => {

	const friendlist = await getFriendlist();
	const uid = localStorage.getItem("UID");

	const fragment = document.createDocumentFragment();
	friendlist.forEach(friend => {
		if (uid == friend.user1_ID) {
			fragment.appendChild(createUserSnippet("", friend.user2_username, "", friend));
		} else {
			fragment.appendChild(createUserSnippet("", friend.user1_username, "", friend));
		}
	});

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

	dropdown.className = "dropdown-menu";

	span.appendChild(icon);
	searchBar.appendChild(span);
	searchBar.appendChild(input);
	// searchBar.appendChild(addSpan());
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
			friendlist.removeChild(document.getElementById("friendlistButtons"));
		}
		fragment.appendChild(addSearchBar());
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
			friendlist.removeChild(document.getElementById("friendlistButtons"));
		}
		fragment.appendChild(await addFriendlist());
		fragment.appendChild(addButtons([
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
	headerTitle.textContent = "Friends";

	headerCloseBtn.setAttribute("type", "button");
	headerCloseBtn.setAttribute("aria-label", "Close");
	headerCloseBtn.setAttribute("data-bs-dismiss", "offcanvas");
	headerCloseBtn.classList.add("btn-close", "float-end", "m-2");
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
			});
			break;

		case element.matches("#cancel-friend-btn"):
			e.preventDefault();
			toggleContent(false).then(content => {
				document.querySelector("#friendlist .offcanvas-body").appendChild(content);
			});
			break;
		
		case element.matches("#invite-friend-btn"):
			e.preventDefault();
			const input = document.querySelector("#searchBar input").value;
			if (input) {
				if (input == localStorage.getItem("username")) {
					alert("Cannot add yourself as a friend.");
				} else {
					checkIfUserExists(input).then(user => {
						if (user) {
							createFriendship(user[0].UID);
						} else {
							alert("Username not found. Please provide an existing username");
						}
					});
				}
			} else {
				alert ("Please provide a username");
			}
			break;

		case element.matches(".accept-invitation"):
			e.preventDefault();
			handleInvitation(element, true);
			break;

		case element.matches(".decline-invitation"):
			e.preventDefault();
			handleInvitation(element, false);
			break;

		case element.matches("#friendlist .dropdown-menu li"):
			e.preventDefault();
			document.querySelector("#searchBar input").value = element.textContent;
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