import About from "../pages/About.js";
import Game from "../pages/Game.js";
import Index from "../pages/Index.js";
import Instructions from "../pages/Instructions.js";
import Profile from "../pages/Profile.js";
import Select from "../pages/Select.js";
import Tournament from "../pages/Tournament.js";
import FetchTest from "../pages/FetchTest.js";
import { translateX } from "../utils/utils.js";

const navigateTo = url => {
	history.pushState(null, null, url);
	router();
};

const router = async () => {
	const routes = [
		{ path: "/", page: Index },
		{ path: "/about", page: About },
		{ path: "/game", page: Game },
		{ path: "/instructions", page: Instructions },
		{ path: "/profile", page: Profile },
		{ path: "/select", page: Select },
		{ path: "/tournament", page: Tournament },
		{ path: "/fetch-test", page: FetchTest }
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

	const page = new match.route.page();

	const pathname = window.location.pathname;

	if (!(pathname == "/about" || pathname == "/profile")) {
		document.querySelector("main").innerHTML = await page.getHtml();
	}

	translateX();
};

window.addEventListener("popstate", router);

const init = () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});
	router();
};

init();

// document.addEventListener("DOMContentLoaded", () => {
// 	document.body.addEventListener("click", e => {
// 		if (e.target.matches("[data-link]")) {
// 			e.preventDefault();
// 			navigateTo(e.target.href);
// 		}
// 	});
// 	router();
// });


// ============== Test with fetch() ===============
// https://www.youtube.com/watch?v=ZleShIpv5zQ

// const routes = {
// 	404: "./pages/404.html",
// 	"/": "./pages/main.js",
// 	"/about": "./pages/about.js",
// 	"/instructions": "./pages/instructions.js",
// 	"/profile": "./pages/profile.js",
// 	"/select": "./pages/select.js",
// 	"/tournament": "./pages/tournament.js"
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