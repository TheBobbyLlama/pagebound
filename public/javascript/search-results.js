async function searchClickHandler() {
    const param = $('#book-search-select').val();
    const query = $('#book-search-input').val().toLowerCase().split(' ').join('+');

    const response = await fetch('http://openlibrary.org/search.json?' + param + '=' + query);

    if (response.ok) {
        const data = await response.json()
        //I guess in a few cases there is no ISBN. This only seems to happen w duplicates or really obscure books, so we'll just eliminate them for now.
        const results = data.docs.filter(result => result.isbn);
  
        const ratedResults = await Promise.all(results.map(async (result) => {
            await checkForRatings(result);
            return result;
            }));
        console.log(ratedResults);    
    }  
};

async function checkForRatings(result) {
   const response = await fetch('/api/ratings');

   if (response.ok) {
        const data = await response.json();
        $(data).each(function() {
            if ($(this)[0].isbn === result.isbn[0]) {
                result.rating = $(this)[0];
                console.log(result);
            } else {
                return result;
            }
        });
    }      
};

$('#book-search-submit').click(searchClickHandler);