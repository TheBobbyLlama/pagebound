
async function markAsRead(event) {
    const messageId = window.location.pathname.replace('/inbox/','');

    const response = await fetch('/api/messages/' + messageId, {
        method: 'put',
        body: JSON.stringify({
            read: true
        }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        console.log('read')
    }
}

window.addEventListener('load', markAsRead)