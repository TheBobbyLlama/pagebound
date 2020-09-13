async function sendMessage(event) {
    event.preventDefault();

    const userId = window.location.pathname.replace('/send-message/','');
    let subject = $('#message-subject').val();
    const body = $('#message-body').val();
    

    if (subject === '') {
        subject = 'No Subject'
    }

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

};

$('#message-form').on('submit', sendMessage);