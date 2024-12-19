// Fetch api
export const handleFetch = async (url, method, body, headers) => {

	const options = {
		method: method,
		headers: headers
	};
	if (method === "POST" || method === "PUT" || method == "PATCH") {
		options.body = body;
	}

	const response = await fetch(url, options);
	if (!response.ok) {
		// throw new Error(`Response status: ${response.status}`);
		const text = await response.text();
		// for (const key of Object.keys(text)) {
		// 	if (!errors) {
		// 		errors = text[key][0] + "\n";
		// 	} else {
		// 		errors += text[key][0] + "\n";
		// 	}
		// }
		throw new Error(text);
	}
	return response.json();
};