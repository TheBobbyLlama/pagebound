const userSearchHolder = [];
let userId = null;
let currentHandler = null;

//debounce function, delays searchInputResults from executing for 'wait' ms after event
const debounce = (func, wait) => {
    let timeout;
  
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
    
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

//executedFunction from debounce ^ called each input event and reset each input event.
const searchInputHandler = debounce(function() {
    searchInputResults();
}, 1500)

//executedFunction from debounce ^ called each input event and reset each input event.
const usernameCheckHandler = debounce(function() {
    usernameCheck();
}, 1500)

async function searchUserHandler() { 
    if ($('#message-user-input')) {
        $('#add-user-dropdown').addClass('hide'); 
        const search = $('#message-user-input').val().toLowerCase()
        if (search.length <= 2) {
            $('#no-user-alert, #duplicate-user-alert').addClass('hide');
            return
        }
        $('#add-user-dropdown').addClass('is-open');

        //reset userSearchHolder
        userSearchHolder.length = 0;

        const response = await fetch('/api/users/search?name=' + search);

        if (response.ok) {
            const results = await response.json()

            $('#add-user-dropdown-list').html('');
            $(results).each(function() {
                userSearchHolder.push($(this)[0])
                $('#add-user-dropdown-list').append(`
                <li class="list-group-item flex-container align-middle align-justify">
                <strong>
                ${$(this)[0].username}
                </strong>
                </li>
                `);
            });

            if (userSearchHolder.length > 0) {
                $('#add-user-dropdown').removeClass('hide');
            }
        }
    }
};

async function usernameCheck() {
    $('#no-user-alert, #duplicate-user-alert').addClass('hide');
    userId = null;
    const username = $('#message-user-input').val();

    const response = await fetch ('/api/users/username/' + username);

    if (response.ok) {
        const userData = await response.json();

        if (currentHandler.closest('.club-user-info').find(`*[data-user-id='${userData.id}']`).length) {
            $('#duplicate-user-alert').removeClass('hide');
        } else {
            userId = userData.id;
        }
    } else {
        $('#no-user-alert').removeClass('hide');
    }
}

function addUserHandler(event) {
    const listEl = event.target.closest('li');
    const username = listEl.querySelector('strong').innerHTML.trim();

    $('#no-user-alert, #duplicate-user-alert').addClass('hide');
    $('#message-user-input').val(username);
    $('#add-user-dropdown').foundation('close')
}

async function addUserToClub(event) {
    event.preventDefault();

    let club_id = $(event.target).attr('data-club-id');

    if ((userId) && (club_id)) {
        const response = await fetch('/api/clubs/add', {
            method: 'post',
            body: JSON.stringify({
                user_id: userId,
                club_id
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            window.location.reload();
        }
    }
}

//Get search results
async function searchInputResults() {
    const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
    const param = $('#book-add-select').val();
    const query = $('#book-add-input').val().toLowerCase().split(' ').join('+');

    if (!query) {
        return;
    }

    $('#book-add-results').html(`<div style="text-align: center;"><img src="/images/working.gif" /></div>`);

    let buildKey = "";

    for (let i = 0; i < shuffleKey.length; i++) {
        buildKey += shuffleKey[(17 * i) % shuffleKey.length];
    }

    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?orderBy=relevance&printType=BOOKS&q=${param}%3A${encodeURIComponent(query)}&key=${buildKey}`)

    if (response.ok) {
        const results = await response.json()
  
        // This will append ratings to the book items, if applicable.
        await getBookRatings(results.items);

        const currentInput = $('#book-add-input').val().toLowerCase().split(' ').join('+');

        //if results are still loading while another request gets through only return the newest results
        if (query !== currentInput) {
            return
        }

        $('#book-add-results').empty();

        results.items.forEach(info => {
            let authorString = info.volumeInfo.authors.join(', ');

            $('#book-add-results').append(`
            <ol class="flex-container align-center">
            <li class="flex-container align-top align-justify" style="width: 20rem;" id="result">
                <div style="margin-right: 25px; margin-top: 10px; flex: 0 0 auto; height: 150px; width: 120px; position: relative;">
                    <div class="no-image-found">No<br>Image<br>Found.</div>
                    <img src="${info.volumeInfo.imageLinks.thumbnail}" alt="" style="max-height: 150px; width: 120px; position: absolute;">
                </div>
                <div class="flex-container align-self-stretch align-right" style="margin-top: 10px; flex-direction: column; justify-content: space-between;">
                    <div style="text-align: right;">
                        <strong>
                            ${info.volumeInfo.title}
                        </strong>
                        <br>
                        ${(() => { if (authorString) { return `<p>${authorString}<p>`} else { return ``}})()}
                    </div>
                    <div>
                    ${(() => { if (info.pagebound_rating_count) { return `<p>Rated <strong>${info.pagebound_rating_average}</strong> by <strong>${info.pagebound_rating_count}</strong> users</p>`} else { return ``}})()}
                        <div class="flex-container align-right">
                            <button type="button" class="success button small" id="add-to-club" data-id="${info.id}" data-close>Read This Book!</button>
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

//sets and displays book to be added to club
async function bookSelectHandler(event) {
	let club_id = $('#add-book-modal').attr('data-club-id');
    let book_id = $(this).attr('data-id');

    const response = await fetch(`/api/clubs/${club_id}`, {
		method: 'PUT',
		body: JSON.stringify({
			book_id
		}),
		headers: { 'Content-Type': 'application/json' }
	});

	if (response.ok) {
		window.location.reload();
	}
};

$('#message-user-input').on('input',  usernameCheckHandler);
$('#message-user-input').on('focus', (event) => { currentHandler = $(event.target); $('#add-user-dropdown').foundation('open'); });
$('#add-user-dropdown').on('click', 'li.list-group-item', addUserHandler);
$('#message-user-input').on('input', searchUserHandler);
$('#add-user-form').on('submit', addUserToClub);

$('#book-add-input').on('input', searchInputHandler);
$('#book-add-results').on('click', 'button.button', bookSelectHandler);
