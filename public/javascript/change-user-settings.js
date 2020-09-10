async function displayCurrentSettings() {
    const response = await fetch('/api/users/settings');

    if (response.ok) {
        const data = await response.json();
        console.log('data');
    }
}

async function settingsUpdateFormHandler(event) {
    event.preventDefault();
    //update the user account DB entry
    const response = await fetch('/api/users/settings/', {
        method: 'put',
        body: JSON.stringify({
            notify_message: document.getElementById("dm-yes").checked,
            notify_new_discussion_comment: document.getElementById("comment-yes").checked
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
}

window.addEventListener('load', displayCurrentSettings);
document.querySelector('#user-settings-form').addEventListener('submit', settingsUpdateFormHandler);