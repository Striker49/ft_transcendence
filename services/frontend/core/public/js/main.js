import Canvas from "./components/canvas.js"
import Footer from "./components/footer.js"
import Login, { submitLoginForm } from "./components/login.js"
import Main from "./components/main.js"
import Nav from "./components/nav.js"
import { submitRegistrationForm } from "./components/profile.js"

const addScript = url => {
	const script = document.createElement("script");
	script.src = url;
	script.type = "module";
	document.body.appendChild(script);
};

document.addEventListener("submit", e => {
	e.preventDefault();
	if (e.target.matches("#login-form")) {
		submitLoginForm(e.target);
	} else if (e.target.matches("#registration-form")) {
		submitRegistrationForm(e.target);
	}
});

document.addEventListener("DOMContentLoaded", e => {
	document.body.insertAdjacentHTML("afterbegin", `
		${Canvas}
		${Nav}
		${Login}
		${Main}
		${Footer}
	`);
	addScript("/js/router.js");
	addScript("/js/scene.js");
});