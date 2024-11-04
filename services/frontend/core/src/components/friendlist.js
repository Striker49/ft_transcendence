import { handleFetch } from "../api/api.js";

export default `
	<div class="offcanvas offcanvas-start bg-secondary-subtle" tabindex="-1" id="friendlist" aria-labelledby="friendlistLabel">
		<div class="offcanvas-header p-0 d-block text-center">
			<h3 class="offcanvas-title d-inline-block px-5 py-2 fs-5 fw-bold rounded-4 rounded-top-0 box-shadow-subtle bg-orange" id="friendlistLabel">Friends</h3>
			<button type="button" class="btn-close float-end m-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
		</div>
		<div class="offcanvas-body container p-4">
			<div class="row user-snippet">
				<div class="col-4">
					<img src="/src/assets/avatar/avatar1.jpg" alt="User avatar" class="border-orange w-100">
				</div>
				<div class="col-8">
					<h4>Ziggy al'Thor</h4>
					<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
				</div>
			</div>
			<div class="input-group my-3">
				<span class="input-group-text bg-light" id="search"><i class="bi bi-search"></i></span>
				<input type="text" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="search">
			</div>
			<div class="box-shadow-inset p-4 rounded-3 bg-light">
				<div class="row user-snippet mb-3">
					<div class="col-4">
						<img src="/src/assets/avatar/avatar2.jpg" alt="User avatar" class="border-orange w-100">
					</div>
					<div class="col-8 align-items-center">
						<h4>Ziggy al'Thor</h4>
						<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
					</div>
				</div>
				<div class="row user-snippet">
					<div class="col-4">
						<img src="/src/assets/avatar/avatar3.jpg" alt="User avatar" class="border-orange w-100">
					</div>
					<div class="col-8">
						<h4 class="m">Ziggy al'Thor</h4>
						<p class="fst-italic">Rank: <span class="fw-bold">1st</span></p>
					</div>
				</div>
			</div>
			<div class="text-center">
				<button id="add-friend-btn" type="button" class="btn btn-dark rounded-pill px-4 my-3 bg-orange border-0 text-dark fw-bold box-shadow-subtle" data-i18n-key="addFriend">Add Friend</button>
			</div>
		</div>
	</div>
`;

const createFriendship = async () => {

	const data = {
		"user1_ID": null,
		"user2_ID": null,
		"type": "pending_first_second"
	};
	const headers = new Headers({
        "Content-Type": "application/json"
    });
    const url = "https://localhost/api/game/profile/friendship/";

	try {
		const json = await handleFetch(url, "POST", JSON.stringify(data), headers);
		console.log("======= Friend Request Sent =======");
		console.log(json);
		console.log("Response status: ", response.status);
		
	} catch (error) {
		console.error(error.message);
	}
};

const getFriendList = async () => {

	const headers = new Headers({
        "Content-Type": "application/json"
    });
    const url = "https://localhost/api/game/profile/friendship/";

	try {
		const json = await handleFetch(url, "GET", "", headers);
		console.log("======= Friendlist =======");
		console.log(json);
		console.log("Response status: ", response.status);
		
	} catch (error) {
		console.error(error.message);
	}
};

const addCurrentUser = () => {

};

const updateFriendlist = () => {
	if (localStorage.getItem("authToken")) {
		addCurrentUser();
		addFriendlist();
		toggleAddFriendBtn(true);
	}
};

// export default `
// 	<!-- Friendlist -->
// 	<section id="friendlist" class="offcanvas offcanvas-start bg-secondary-subtle" tabindex="-1" aria-labelledby="friendlistLabel">
// 		<div class="offcanvas-header p-0 d-block text-center">
// 			<h3 class="offcanvas-title d-inline-block px-5 py-2 fs-5 fw-bold rounded-4 rounded-top-0 box-shadow-subtle bg-orange" id="friendlistLabel">Friends</h3>
// 			<button type="button" class="btn-close float-end m-2" data-bs-dismiss="offcanvas" aria-label="Close"></button>
// 		</div>
// 		<div class="offcanvas-body container p-4"></div>
// 	</section>
// `;

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