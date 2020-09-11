const getBookInfo = async function() {
	const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
	const splitUrl = window.location.toString().split('/');
	const book_id = splitUrl[splitUrl.length - 1];

	if (!book_id) {
		return;
	}

	const rating = await fetch(`${window.location.protocol}//${window.location.host}/api/ratings/book/${book_id}`);

	if (rating.ok) {
		const data = await rating.json();

		$('#book_rating').append(`<p>Rated <strong>${data.average_score}</strong> by <strong>${data.rating_count}</strong> users</p>`);
	}

	let buildKey = "";

    for (let i = 0; i < shuffleKey.length; i++) {
        buildKey += shuffleKey[(17 * i) % shuffleKey.length];
	}
	
	const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${book_id}?key=${buildKey}`);

	if (response.ok) {
		const data = await response.json();
		//console.log(data);
		let authorString = 'by ';

		data.volumeInfo.authors.forEach((value, index, array) => {
			if (index > 1) {
				if (index === array.length - 1) {
					authorString += (array.length == 2) ? ' and ' : ', and ';
				} else {
					authorString += ', ';
				}
			}

			authorString += value;
		});

		if (data.volumeInfo.imageLinks) {
			$('#cover_panel').css('background-image', 'url(' + (data.volumeInfo.imageLinks.medium || data.volumeInfo.imageLinks.thumbnail) + ')');
		} else {
			$('#cover_panel').css('background-image', 'url(/images/logo.png)').css('opacity', 0.5);
		}
		
		$('#author_info').text(authorString);
		$('#book_description').append(data.volumeInfo.description);

		if (data.saleInfo != 'NOT_FOR_SALE') {
			$('#sale_info').append(`<br /><a href="${data.volumeInfo.infoLink}" target="_blank">View on Google Play</a>`)
		}
	}
}

getBookInfo()