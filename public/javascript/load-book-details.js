// WARNING - This file is used by the dashboard, club, and thread views!  Don't add any page-specific Javascript here!
const loadBookData = async function() {
	const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
	const bookQueue = $('div[data-id]');

	let buildKey = "";

    for (let i = 0; i < shuffleKey.length; i++) {
        buildKey += shuffleKey[(17 * i) % shuffleKey.length];
	}

	for (let i = 0; i < bookQueue.length; i++) {
		let book_id = bookQueue[i].getAttribute('data-id');
		
		const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${book_id}?key=${buildKey}`);

		if (response.ok) {
			const data = await response.json();
			var tmpElement;
			
			tmpElement = bookQueue[i].querySelector('span');

			if (tmpElement) {
				tmpElement.innerHTML = `<a href="/book/${encodeURIComponent(data.volumeInfo.title)}/id/${book_id}"><strong>${data.volumeInfo.title}</strong></a>`;
			}

			tmpElement = bookQueue[i].querySelector('#cover_panel');

			if (tmpElement) {
				tmpElement.setAttribute('style', 'background-image: url(' + data.volumeInfo.imageLinks.thumbnail + ')');
			}
		}
	}
}

loadBookData();