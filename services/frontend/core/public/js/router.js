import About from "./views/About.js";
import Game from "./views/Game.js";
import Index from "./views/Index.js";
import Instructions from "./views/Instructions.js";
import Profile from "./views/Profile.js";
import Select from "./views/Select.js";
import Tournament from "./views/Tournament.js";

const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Index },
		{ path: "/about", view: About },
		{ path: "/game", view: Game },
		{ path: "/instructions", view: Instructions },
		{ path: "/profile", view: Profile },
		{ path: "/select", view: Select },
		{ path: "/tournament", view: Tournament }
	];

	// Test each route for potential match
	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		};
	});

	let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

	// If no match, default to index
	if (!match) {
		match = {
			route: routes[0],
			isMatch: true
		}
	}

	console.log("Path: ", match.route.path);

	const view = new match.route.view();

	document.querySelector("main").innerHTML = await view.getHtml();

	// document.body.insertAdjacentHTML("beforeend", await view.getJS());

};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
	router();
});


// ============== Test with fetch() ===============
// https://www.youtube.com/watch?v=ZleShIpv5zQ

// const routes = {
// 	404: "./views/404.html",
// 	"/": "./views/main.js",
// 	"/about": "./views/about.js",
// 	"/instructions": "./views/instructions.js",
// 	"/profile": "./views/profile.js",
// 	"/select": "./views/select.js",
// 	"/tournament": "./views/tournament.js"
// };

// const router = async () => {
// 	const path = window.location.pathname;
// 	const route = routes[path] || routes[404];
// 	const html = await fetch(route).then((data) => data.text());
// 	document.querySelector("main").innerHTML = html;
// };

// window.onpopstate = router;
// window.route = route;

// router();