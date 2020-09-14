async function checkUnread() {
    const response = await fetch('/api/messages/received/read-count');
    
    if (response.ok) {
        const data = await response.json();
        const unread = data[0].unread_messages;
        console.log(unread);

        if (unread > 0) {
            $('.inbox-badge').removeClass('hide');
            $('.inbox-badge').html(unread);
        }
    }
}

window.addEventListener('load', checkUnread)