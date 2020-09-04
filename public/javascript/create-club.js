async function createClubFormHandler(event) {
    event.preventDefault();

    const clubName = document.querySelector('#create-club-name').value.trim();
    const bookID = document.querySelector('#create-club-book-id').value.trim();

    if (clubName && bookID) {
        const response = await fetch('/api/clubs', {
            method: 'post',
            body: JSON.stringify({
                clubName,
                bookID
            }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            console.log('success');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.create-club-form').addEventListener('submit', createClubFormHandler);