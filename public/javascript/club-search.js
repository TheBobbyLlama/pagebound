async function distanceSearchHandler() {
    const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
    const dist = $('#zip-distance').val()
    $('#zip-search-results').html('');
    const response = await fetch('/api/club-search?dist=' + dist); 

    if (response.ok) {
        const clubData = await response.json();
        
        clubData.forEach(async (club) => {
            let title = 'No Current Book';
            let cover = '/images/logo.png'

            if (club.book_id !== null) {
                let buildKey = "";

                for (let i = 0; i < shuffleKey.length; i++) {
                    buildKey += shuffleKey[(17 * i) % shuffleKey.length];
                }

                const bookFetch = await fetch(`https://www.googleapis.com/books/v1/volumes/${club.book_id}?key=${buildKey}`);

                if (bookFetch.ok) {
                    const bookInfo = await bookFetch.json();
                    title = bookInfo.volumeInfo.title;
                    cover = bookInfo.volumeInfo.imageLinks.medium || bookInfo.volumeInfo.imageLinks.thumbnail;
                }
            }

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
                            <img src="${cover}" style="height: 150px; width: auto;">
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
        })
    }
};

$('#zip-distance').on('change', distanceSearchHandler);
window.addEventListener('load', distanceSearchHandler);