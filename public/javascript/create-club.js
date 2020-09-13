//where we will store isbn if book is chosen
let selectedBook = null;
//store user info from user search dropdown 
const userSearchHolder = [];
//user info chosen from ^
const userAddArray = [];

async function createClubFormHandler(event) {
    event.preventDefault();

    const clubName = document.querySelector('#add-club-name').value.trim();

    $('#name-taken-alert').addClass('hide');
    $('#name-blank-alert').addClass('hide');

    if (clubName) {
        const response = await fetch('/api/clubs', {
            method: 'post',
            body: JSON.stringify({
                name: clubName,
                book_id: selectedBook
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            const res = await response.json()
            //console.log(res);
            addUsersToClub(res);
            document.location.replace('/club/' + res.id);
        } else {
            const error = await response.json()
            const errMessage = error.errors[0].message;
            if (errMessage === 'club.name must be unique') {
                $('#name-taken-alert').removeClass('hide');
            }
        }
    } else if (!clubName) {
        $('#name-blank-alert').removeClass('hide');
    }
}

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

//Get search results
async function searchInputResults() {
    const shuffleKey = [ "A", "v", "d", "W", "K", "g", "l", "y", "l", "D", "F", "H", "a", "b", "4", "i", "2", "I", "g", "m", "1", "k", "4", "x", "D", "f", "o", "f", "O", "S", "l", "O", "k", "7", "z", "e", "v", "8", "d" ];
    const param = $('#book-add-select').val();
    const query = $('#book-add-input').val().toLowerCase().split(' ').join('+');

    $('#book-add-results').html(`<div style="text-align: center;"><img src="images/working.gif" /></div>`);

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
                            <button type="button" class="success button small" id="add-to-club" data-id="${info.id}" data-close>Add Book to Club</button>
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
function bookSelectHandler(event) {
    const selectedItem = event.target.closest('li');
    const image = selectedItem.querySelector('img');
    const title = selectedItem.querySelector('strong');
    
    selectedBook = $(this).attr('data-id');

     $('#add-club-book').empty().append(`
        <button class="close-button book-close" type="button" style="top: -.4rem; left: 11rem;" id="remove-book-selection">
            <span>&times;</span>
        </button>
        ${title.outerHTML}
        <br>
        ${image.outerHTML.replace('position: absolute;', 'z-index: 100;')}
    `);

    $('#add-a-book-button').html('Change Book');
    $('#add-a-book-plus-sign').addClass('hide');
};

//removes book from club and display with close button
function bookRemoveHandler() {
    selectedBook = null;
    $('#add-club-book').html('')
    $('#add-a-book-button').html('Add a Book');
    $('#add-a-book-plus-sign').removeClass('hide');
};

//user search returns closest results each input
async function searchUserHandler() { 
    $('#add-user-dropdown').addClass('hide'); 
    const search = $('#add-club-user-input').val().toLowerCase()
    if (search.length <= 1) {
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
            <i id="add-user-plus" class="foundicon-plus" style="font-weight: lighter; margin-right: .2rem;"></i>
            </li>
            `);
        });

        if (userSearchHolder.length > 0) {
            $('#add-user-dropdown').removeClass('hide');
        }
    }
};

//adds user from dropdown list to visual list and add user array
function addUserHandler(event) {
    const listEl = event.target.closest('li');
    const username = listEl.querySelector('strong').innerHTML.trim();

    $('#selected-user-list').removeClass('hide');
    $('#add-club-user-input').val('')

    $('#selected-user-list').append(`
    <li class="list-group-item flex-container align-middle align-justify selected-user-list">
            <p style="margin-bottom: 0px;">
            ${username}
            </p>
            <button class="close-button user-close" type="button" style="position: static; margin-bottom: .5rem;">
                <span>&times;</span>
             </button>
    </li>
    `)

    $(userSearchHolder).each(function() {
        const thisUsername = $(this)[0].username;
        const thisID = $(this)[0].id
        if (thisUsername === username) {
            userAddArray.push({ id: thisID, username: username });
        }
    })
};

//remove user from add to club list
function removeUserHandler() {
    const listEl = this.closest('li')
    const username = listEl.querySelector('p').innerHTML.trim();

    //remove from visual list
    $(listEl).remove();

    //loop through user add array and take out user at matching username
    $(userAddArray).each(function(index) {
        const thisUsername = $(this)[0].username;
        if (username === thisUsername) {
            userAddArray.splice(index, 1);
        }
    });

    //hide the visual list container if no users
    if (userAddArray.length === 0) {
        $('#selected-user-list').addClass('hide'); 
    }
}; 

//add selected users to club
async function addUsersToClub(clubInfo) {
    //info returned by club post route
    const clubId = clubInfo.id

    //add each user in add array to club
    for (let index = 0; index < userAddArray.length; index++) {
        const userId = userAddArray[index].id
        //console.log(userId);
        const response = await fetch('/api/clubs/add', {
            method: 'put',
            body: JSON.stringify({
                user_id: userId,
                club_id: clubId
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            console.log('success');
        } 
    }
};

$('#book-add-input').on('input', searchInputHandler);
$('#add-club-user-input').on('focus', () => $('#add-user-dropdown').foundation('open'));
$('#create-club-form').on('submit', createClubFormHandler);
$('#selected-user-list').on('click', 'button.user-close', removeUserHandler);
$('#add-user-dropdown').on('click', 'li.list-group-item', addUserHandler);
$('#add-club-user-input').on('input',  searchUserHandler);
$('#book-add-results').on('click', 'button.button', bookSelectHandler);
$('#create-club-form').on('click', 'button.book-close', bookRemoveHandler);
