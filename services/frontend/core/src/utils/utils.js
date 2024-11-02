export const translateX = () => {

	const currentDiv = document.querySelector(".on-screen");

	if (window.location.pathname == "/about") {

		const newDiv = document.querySelector("#about");

		if (currentDiv != newDiv) {
			currentDiv.style.left = "100%";
			newDiv.style.left = "0%";
			currentDiv.classList.remove("on-screen");
			newDiv.classList.add("on-screen");
		}

	} else if (window.location.pathname == "/profile") {

		const newDiv = document.querySelector("#profile");

		if (currentDiv != newDiv) {
			currentDiv.style.left = "-100%";
			newDiv.style.left = "0%";
			currentDiv.classList.remove("on-screen");
			newDiv.classList.add("on-screen");
		}

	} else {

		const newDiv = document.querySelector("main");

		if (currentDiv != newDiv) {
			if (currentDiv.getAttribute("id") == "about") {
				currentDiv.style.left = "-100%";
			} else {
				currentDiv.style.left = "100%";
			}
			newDiv.style.left = "0%";
			currentDiv.classList.remove("on-screen");
			newDiv.classList.add("on-screen");
		}
	}
};