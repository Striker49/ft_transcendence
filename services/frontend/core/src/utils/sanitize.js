// ========== Sanitize ==========
const replaceChar = char => {
	switch (char) {
		case '&': return '&amp;';
		case '<': return '&lt;';
		case '>': return '&gt;';
		case '"': return '&quot;';
		case '\'': return '&#39;';
		case '/': return '&#x2F;';
		default: return char;
	}
};

export const sanitizeString = str => str.replace(/[&<>"'\/]/g, replaceChar);

export const sanitizeJSON = json => {
	for (const key in json) {
		if (typeof json[key] === 'string') {
			json[key] = sanitizeString(json[key]);
		}
	}
	return json;
};