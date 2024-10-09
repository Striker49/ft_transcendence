const helloBtn = document.querySelector('#hello-btn');
const helloText = document.querySelector('#hello-text');

helloBtn.addEventListener('click', async e => {
	const url = 'https://localhost/api/hello/'; 

	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}
		
		const data = await response.json(); // Await the JSON parsing
		helloText.innerHTML = data.message; // Access the "message" key
	} catch (error) {
		console.error(error.message);
	}
});
