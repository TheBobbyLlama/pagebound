//where we will store isbn if book is chosen
let bookIsbn = null;
const userSearchHolder = [];
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
                isbn: bookIsbn
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            const res = await response.json()
            console.log(res);
            addUsersToClub(res);
            //document.location.replace('/club' + res.id);
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
    console.log('end timeout')
    searchInputResults();
}, 1500)

//Get search results
async function searchInputResults() {
    const param = $('#book-add-select').val();
    const query = $('#book-add-input').val().toLowerCase().split(' ').join('+');
    console.log('searching');

    $('#book-add-results').html('');
    $('#book-add-loading-gif').removeClass('hide');

    const response = await fetch('http://openlibrary.org/search.json?' + param + '=' + query);

    if (response.ok) {
        const data = await response.json()
        //I guess in a few cases there is no ISBN. This only seems to happen w duplicates or really obscure books, so we'll just eliminate them for now.
        const results = data.docs.filter(result => result.isbn);
  
        const ratedResults = await Promise.all(results.map(async (result) => {
            await checkForRatings(result);
            return result;
        }));

        const currentInput = $('#book-add-input').val().toLowerCase().split(' ').join('+');

        //if results are still loading while another request gets through only return the newest results
        if (query !== currentInput) {
            return
        }

        $('#book-add-loading-gif').addClass('hide');

        $(ratedResults).each(function() {
            const info = $(this)[0];
            const url = info.title.toLowerCase().split(' ').join('+');
            $('#book-add-results').append(`
            <ol class="flex-container align-center">
            <li class="flex-container align-top" id="result">
                <div style="margin-right: 25px; margin-top: 10px; flex: 0 0 auto; height: 150px; width: 120px; position: relative;">
                    <div class="no-image-found">No<br>Image<br>Found.</div>
                    <img src="http://covers.openlibrary.org/b/isbn/${info.isbn[0]}-L.jpg" alt="" style="height: 150px; width: auto; position: absolute;">
                </div>
                <div class="flex-container align-self-stretch" style="margin-top: 10px; flex-direction: column; justify-content: space-between;">
                    <div>
                        <strong>
                            ${info.title}
                        </strong>
                        <br>
                        ${(() => { if (info.author_name) { return `<p>${info.author_name[0]}<p>`} else { return ``}})()}
                    </div>
                    <div>
                        <div class="flex-container">
                            <button type="button" class="success button small" id="add-to-club" data-close>Add Book to Club</button>
                        </div>
                    </div>
                </div>
            </li>
        </ol>
            `)
        });    
    }  
};

//matches ratings from our database to openlibrary response isbns
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

//sets and displays book to be added to club
function bookSelectHandler(event) {
    const selectedItem = event.target.closest('li');
    const image = selectedItem.querySelector('img');
    const title = selectedItem.querySelector('strong');
    const isbn = image.outerHTML.replace('<img src="http://covers.openlibrary.org/b/isbn/', '').replace('-L.jpg" alt="" style="height: 150px; width: auto; position: absolute;">', '');
    
    bookIsbn = isbn;

    $('#add-club-book').html('')

    $('#add-club-book').append(`
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
    bookIsbn = null;
    $('#add-club-book').html('')
    $('#add-a-book-button').html('Add a Book');
    $('#add-a-book-plus-sign').removeClass('hide');
};

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
        $('#add-user-dropdown').removeClass('hide');
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
    }
};

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

function removeUserHandler() {
    const listEl = this.closest('li')
    const username = listEl.querySelector('p').innerHTML.trim();

    $(listEl).remove();

    $(userAddArray).each(function(index) {
        const thisUsername = $(this)[0].username;
        if (username === thisUsername) {
            userAddArray.splice(index, 1);
        }
    });

    if (userAddArray.length === 0) {
        $('#selected-user-list').addClass('hide'); 
    }
}; 

async function addUsersToClub(clubInfo) {
    const clubId = clubInfo.id
    for (let index = 0; index < userAddArray.length; index++) {
        const userId = userAddArray[index].id
        console.log(userId);
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

document.querySelector('#book-add-input').addEventListener('input', searchInputHandler);
document.querySelector('#create-club-form').addEventListener('submit', createClubFormHandler);
$('#selected-user-list').on('click', 'button.user-close', removeUserHandler);
$('#add-user-dropdown').on('click', 'li.list-group-item', addUserHandler);
$('#add-club-user-input').on('input',  searchUserHandler);
$('#book-add-results').on('click', 'button.button', bookSelectHandler);
$('#create-club-form').on('click', 'button.book-close', bookRemoveHandler);
