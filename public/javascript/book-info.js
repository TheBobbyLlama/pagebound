const getBookInfo = async function() {
	const splitUrl = window.location.toString().split('/');
	const isbn = splitUrl[splitUrl.length - 1];

	if (!isbn) {
		return;
	}

	const rating = await fetch(`${window.location.protocol}//${window.location.host}/api/ratings/book/${isbn}`);

	if (rating.ok) {
		const data = await rating.json();

		$('#book_rating').append(`<p>Rated <strong>${data.average_score}</strong> by <strong>${data.rating_count}</strong> users</p>`);
	}

	const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);

	if (response.ok) {
		const data = await response.json();
		const bookData = Object.entries(data)[0][1];
		//console.log(bookData);
		let authorString = 'by ';
		let coverString = '/images/logo.png';

		bookData.authors.forEach((value, index, array) => {
			if (index > 1) {
				if (index === array.length - 1) {
					authorString += (array.length == 2) ? ' and ' : ', and ';
				} else {
					authorString += ', ';
				}
			}

			authorString += value.name;
		});

		if (bookData.cover) {
			$('#cover_panel').css('background-image', 'url(' + bookData.cover.large + ')');
		} else {
			$('#cover_panel').css('background-image', 'url(/images/logo.png)').css('opacity', 0.5);
		}
		
		$('#author_info').text(authorString);
	}
}

getBookInfo()