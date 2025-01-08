// AddImage
export const addImage = (src, alt, id, width) => {

	const img = document.createElement("img");

	img.src = src;
	img.alt = alt;
	img.className = id;
	if (width) {
		img.width = 42;
	} else {
		img.style.width = "100%";
	}
	return img;
};