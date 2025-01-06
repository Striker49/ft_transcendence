// AddImage
export const addImage = (src, alt, id) => {

	const img = document.createElement("img");

	img.src = src;
	img.alt = alt;
	img.className = id;
	img.style.width = "100%";
	return img;
};