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
		throw new Error(`Response status: ${response.status}`);
	}
	return response.json();
};