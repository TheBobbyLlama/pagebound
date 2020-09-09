async function distanceSearchHandler(){
    const dist = $('#zip-distance').val()
    $('#zip-search-results').html('');

    const response = await fetch('/api/club-search?dist=' + dist); 

    if (response.ok) {
        const clubData = await response.json();
        
        $(clubData).each(async function() {
            const club = $(this)[0];
            const title = 'No Current Book';

            if (club.isbn !== null) {
                const title = await getBookTitle(club.isbn);

                $('#zip-search-results').append(`
                <li class="cell small-12" style="padding: 0;">
                    <div class="card club-search-item">
                        <div class="card-divider club-result-title">
                            <strong>${club.name}</strong>
                        </div>
                        <div class="card-section grid-x align-justify club-card-section">
                            <div class="flex-container book-section" style="flex-direction: column;">
                                <strong class="currently-reading-label">Currently Reading:</strong>
                                <a href="" style="margin: 0;"><strong>${title}</strong></a>
                                <img src="http://covers.openlibrary.org/b/isbn/${club.isbn}-L.jpg" style="height: 150px; width: auto;">
                            </div>
                            <div class="flex-container align-justify align-right" style="flex-direction: column;">
                                <div class="flex-container align-left" style="flex-direction: column; margin: 1rem;">
                                    <strong>Club Owner: ${club.members[0].username}</strong>
                                    <strong>Members: ${club.members.length}</strong>
                                </div>
                                <div class="flex-container align-right">
                                    <button class="button group-page-button">Go to Group Page</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `);
            } else {
                $('#zip-search-results').append(`
                <li class="cell small-12" style="padding: 0;">
                    <div class="card club-search-item">
                        <div class="card-divider club-result-title">
                            <strong>${club.name}</strong>
                        </div>
                        <div class="card-section grid-x align-justify club-card-section">
                            <div class="flex-container book-section" style="flex-direction: column;">
                                <strong class="currently-reading-label">Currently Reading:</strong>
                                <a href="" style="margin: 0;"><strong>${title}</strong></a>
                                <img src="http://covers.openlibrary.org/b/isbn/${club.isbn}-L.jpg" style="height: 150px; width: auto;">
                            </div>
                            <div class="flex-container align-justify align-right" style="flex-direction: column;">
                                <div class="flex-container align-left" style="flex-direction: column; margin: 1rem;">
                                    <strong>Club Owner: ${club.members[0].username}</strong>
                                    <strong>Members: ${club.members.length}</strong>
                                </div>
                                <div class="flex-container align-right">
                                    <button class="button group-page-button">Go to Group Page</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                `);
            }
        })
    }
};

async function getBookTitle(isbn) {
    const response = await fetch('https://openlibrary.org/api/books?bibkeys=ISBN:' + isbn + '&format=json&jscmd=data');

    if (response.ok) {
        const json = await response.json();
        const entries = Object.entries(json);
        const info = entries[0];
        const title = info[1].title;

        return title;
    }
};

$('#zip-distance').on('change', distanceSearchHandler);
window.addEventListener('load', distanceSearchHandler);