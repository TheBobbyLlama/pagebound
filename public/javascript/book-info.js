const getBookInfo = async function() {
	const splitUrl = window.location.toString().split('/');
	const isbn = splitUrl[splitUrl.length - 1];

	const rating = await fetch(`${window.location.protocol}//${window.location.host}`);
	const response = await fetch('https://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&jscmd=data&format=json');

	if (response.ok) {
		const data = await response.json();
		const bookData = Object.entries(data)[0][1];
		console.log(bookData);
		let authorString = 'by ';

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
		$('#cover_panel').attr('style', 'background-image: url(' + bookData.cover.large + ');');
		$('#author_info').text(authorString);
	}
}

getBookInfo()