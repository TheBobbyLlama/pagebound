const userSearchHolder = [];
let userId = null;

async function sendMessage(event) {
    event.preventDefault();
    $('#no-user-alert').removeClass('hide');

    let subject = $('#message-subject').val();
    const body = $('#message-body').val();
    

    if (subject === '') {
        subject = 'No Subject'
    }

    if (userId) {
        $('#no-user-alert').addClass('hide')
        const response = await fetch('/api/messages', {
            method: 'post',
            body: JSON.stringify({
                recipient_id: userId,
                subject: subject,
                message: body
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            const check = await response.json();
            console.log(check);
            document.location.replace('/dashboard');
        } 
    }

};

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
const usernameCheckHandler = debounce(function() {
    usernameCheck();
}, 1500)

async function searchUserHandler() { 
    if ($('#message-user-input')) {
        $('#add-user-dropdown').addClass('hide'); 
        const search = $('#message-user-input').val().toLowerCase()
        if (search.length <= 2) {
            $('#no-user-alert').addClass('hide');
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
    $('#no-user-alert').addClass('hide');
    userId = null;
    const username = $('#message-user-input').val();

    const response = await fetch ('/api/users/username/' + username);

    if (response.ok) {
        const userData = await response.json();
        userId = userData.id;
    } else {
        $('#no-user-alert').removeClass('hide');
    }
}

function addUserHandler(event) {
    const listEl = event.target.closest('li');
    const username = listEl.querySelector('strong').innerHTML.trim();

    $('#no-user-alert').addClass('hide');
    $('#message-user-input').val(username);
    $('#add-user-dropdown').foundation('close')
}

$('#message-form').on('submit', sendMessage);
$('#message-user-input').on('input',  usernameCheckHandler);
$('#message-user-input').on('focus', () => $('#add-user-dropdown').foundation('open'));
$('#add-user-dropdown').on('click', 'li.list-group-item', addUserHandler);
$('#message-user-input').on('input', searchUserHandler);