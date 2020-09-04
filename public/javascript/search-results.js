async function searchClickHandler() {
    const param = $('#book-search-select').val();
    const query = $('#book-search-input').val().toLowerCase().split(' ').join('+');

    $('#search-results').html(`<div style="text-align: center;"><img src="images/working.gif" /></div>`);

    const response = await fetch('http://openlibrary.org/search.json?' + param + '=' + query);

    if (response.ok) {
        const data = await response.json();

        //I guess in a few cases there is no ISBN. This only seems to happen w duplicates or really obscure books, so we'll just eliminate them for now.
        const results = data.docs.filter(result => result.isbn);
  
        const ratedResults = await Promise.all(results.map(async (result) => {
            await checkForRatings(result);
            return result;
        }));

        $('#search-results').empty();

        $(ratedResults).each(function() {
            const info = $(this)[0];
            const url = info.title.toLowerCase().split(' ').join('+');
            console.log(info);
            $('#search-results').append(`
            <ol>
            <li class="list-group-item flex-container align-top">
                <div style="margin-right: 25px; margin-top: 10px; flex: 0 0 auto; height: 250px; width: 200px;">
                    <img src="images/cover-loading.gif" alt="" style="height: 250px; width: auto;" onload="this.src = 'http://covers.openlibrary.org/b/isbn/${info.isbn[0]}-L.jpg';">
                </div>
                <div class="flex-container align-self-stretch" style="margin-top: 10px; flex-direction: column; justify-content: space-between;">
                    <div>
                        <strong>
                            ${info.title}
                        </strong>
                        <br>
                        <p>${info.author_name[0]}<p>
                        <br>
                        <a href="https://www.amazon.com/s?k=${url}&i=stripbooks">Find on Amazon</a>
                    </div>
                    <div>
                        ${(() => { if (info.rating) { return `<p>Rated <strong>${info.rating.average_score}</strong> by <strong>${info.rating.rating_count}</strong> users</p>`} else { return ``}})()}
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

async function checkForRatings(result) {
   const response = await fetch('/api/ratings');

   if (response.ok) {
        const data = await response.json();
        $(data).each(function() {
            if ($(this)[0].isbn === result.isbn[0]) {
                result.rating = $(this)[0];
            } else {
                return result;
            }
        });
    }      
};

$('#book-search-submit').click(searchClickHandler);