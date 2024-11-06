import Canvas from "./components/canvas.js"
import Footer from "./components/footer.js"
import Login from "./components/login.js"
import About from "./components/about.js"
import Main from "./components/main.js"
import Nav from "./components/nav.js"
import Profile from "./components/profile.js"

const addScript = url => {
	const script = document.createElement("script");
	script.src = url;
	script.type = "module";
	document.body.appendChild(script);
};

document.addEventListener("DOMContentLoaded", e => {
	document.body.insertAdjacentHTML("afterbegin", `
		${Canvas}
		${Nav}
		${Login}
		${Main}
		${About}
		${Profile}
		${Footer}
	`);
	addScript("/src/router/router.js");
	addScript("/src/scenes/default.js");
	addScript("/src/localization.js");
});