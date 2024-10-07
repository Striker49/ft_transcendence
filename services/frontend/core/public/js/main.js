import Canvas from "./components/canvas.js"
import Footer from "./components/footer.js"
import Login, { submitLoginForm } from "./components/login.js"
import Main from "./components/main.js"
import Nav from "./components/nav.js"

const addScript = url => {
	const script = document.createElement("script");
	script.src = url;
	script.type = "module";
	document.body.appendChild(script);
};

const renderHtml = component => {
	const html = component;
	document.body.insertAdjacentHTML("beforeend", html);
};

document.addEventListener("submit", e => {
	e.preventDefault();
	if (e.target.matches("#login-form")) {
		submitLoginForm(e.target);
	}
});

document.addEventListener("DOMContentLoaded", e => {

	renderHtml(Canvas);
	renderHtml(Nav);
	renderHtml(Login);
	renderHtml(Main);
	renderHtml(Footer);

	document.body.insertAdjacentHTML("beforeend", "<!-- Scripts -->");

	addScript("/js/router.js");
	addScript("/js/scene.js");
});