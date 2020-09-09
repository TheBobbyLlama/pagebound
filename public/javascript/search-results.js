async function searchClickHandler() {
    const param = $('#book-search-select').val();
    const query = $('#book-search-input').val().toLowerCase().split(' ').join('+');

    $('#search-results').html(`<div style="text-align: center;"><img src="images/working.gif" /></div>`);

    const response = await fetch('http://openlibrary.org/search.json?' + param + '=' + query);

    if (response.ok) {
        const data = await response.json();

        //I guess in a few cases there is no ISBN. This only seems to happen w duplicates or really obscure books, so we'll just eliminate them for now.
        const results = data.docs.filter(result => result.isbn);

        // This will append ratings to the book items, if applicable.
        await getBookRatings(results);

        $('#search-results').empty();

        results.forEach(info => {
            const url = info.title.toLowerCase().split(' ').join('+');
            $('#search-results').append(`
            <ol>
            <li class="flex-container align-top">
                <div style="margin-right: 25px; margin-top: 10px; flex: 0 0 auto; height: 250px; width: 200px;">
                    <img src="images/cover-loading.gif" alt="" style="max-height: 250px; width: auto;" onload="this.src = 'http://covers.openlibrary.org/b/isbn/${info.isbn[0]}-L.jpg';">
                </div>
                <div class="flex-container align-self-stretch" style="margin-top: 10px; flex-direction: column; justify-content: space-between;">
                    <div>
                        <strong>
                            ${info.title}
                        </strong>
                        <br>
                        ${(() => { if (info.author_name) { return `<p>${info.author_name[0]}<p>`} else { return ``}})()}
                        <br>
                        <a href="https://www.amazon.com/s?k=${url}&i=stripbooks">Find on Amazon</a>
                    </div>
                    <div>
                        ${(() => { if (info.pagebound_rating_count) { return `<p>Rated <strong>${info.pagebound_rating_average}</strong> by <strong>${info.pagebound_rating_count}</strong> users</p>`} else { return ``}})()}
                        <div class="flex-container">
                            <button type="button" class="button small" style="margin-right: 10px;" id="book-page">Go to Book Page</button>
                            <button type="button" class="success button small" id="add-to-club">Add Book to Club</button>
                        </div>
                    </div>
                </div>
            </li>
        </ol>
            `)
        });    
    }  
};

// Appends rating info to each book entry.
async function getBookRatings(results) {
    const response = await fetch('/api/ratings/forlist', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbns: results.map(element => element.isbn[0])})
    });

    if (response.ok) {
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            let curBook = results.find(book => book.isbn[0] === data[i].isbn);

            if (curBook) {
                curBook.pagebound_rating_average = data[i].average_score;
                curBook.pagebound_rating_count = data[i].rating_count;
            }
        }
    }
}

$('#book-search-submit').click(searchClickHandler);