async function searchClickHandler() {
    const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
    const param = $('#book-search-select').val();
    const query = $('#book-search-input').val().toLowerCase();

    // Don't search if the user hasn't entered anything.
    if (!query) {
        // Unfortunately, we can't fire the close handle immediately and prevent the modal from appearing altogether.
        setTimeout(() => { $('#close-search').click(); }, 1);
        return;
    }

    let buildKey = "";

    for (let i = 0; i < shuffleKey.length; i++) {
        buildKey += shuffleKey[(17 * i) % shuffleKey.length];
    }

    $('#search-results-modal').css('max-width', '300px');
    $('#search-results').html(`<div style="text-align: center;"><img src="/images/working.gif" /></div>`);

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?orderBy=relevance&printType=BOOKS&q=${param}%3A${encodeURIComponent(query)}&key=${buildKey}`)

    if (response.ok) {
        const results = await response.json();

        //console.log(results);

        // This will append ratings to the book items, if applicable.
        await getBookRatings(results.items);

        $('#search-results-modal').css('max-width', '');
        $('#search-results').empty();

        results.items.forEach(info => {
            const url = info.volumeInfo.title.toLowerCase().split(' ').join('+');
            let authorString = info.volumeInfo.authors.join(', ');

            $('#search-results').append(`
            <ol>
            <li class="flex-container align-top">
                <div style="margin-right: 25px; margin-top: 10px; flex: 0 0 auto; height: 250px; width: 200px;">
                    <img src="/images/cover-loading.gif" alt="" style="height: 250px; width: auto;" onload="this.src = '${info.volumeInfo.imageLinks.thumbnail}';">
                </div>
                <div class="flex-container align-self-stretch" style="margin-top: 10px; flex-direction: column; justify-content: space-between;">
                    <div>
                        <strong>
                            ${info.volumeInfo.title}
                        </strong>
                        <br>
                        ${(() => { if (authorString) { return `<p>${authorString}<p>`} else { return ``}})()}
                    </div>
                    <div>
                        ${(() => { if (info.pagebound_rating_count) { return `<p>Rated <strong>${info.pagebound_rating_average}</strong> by <strong>${info.pagebound_rating_count}</strong> users</p>`} else { return ``}})()}
                        <div class="flex-container">
                            <button type="button" name="book-info" class="button small" style="margin-right: 10px;" id="book-page" data-url="/book/${encodeURIComponent(info.volumeInfo.title)}/id/${info.id}">Go to Book Page</button>
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
        body: JSON.stringify({ book_ids: results.map(element => element.id)})
    });

    if (response.ok) {
        const data = await response.json();
        for (let i = 0; i < data.length; i++) {
            let curBook = results.find(book => book.id === data[i].book_id);

            if (curBook) {
                curBook.pagebound_rating_average = data[i].average_score;
                curBook.pagebound_rating_count = data[i].rating_count;
            }
        }
    }
}

function bookInfoHandler() {
    const url = $(this).attr('data-url');
    window.location.assign(url);
}

$('#book-search-submit').on('click', searchClickHandler);
$('#search-results').on('click', 'button[name=\'book-info\']', bookInfoHandler);