async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    
    $('#credential-alert, #verify-alert').addClass('hide');

    if (email && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            // HACK - Going to dashboard too fast?  Had to add short delay.
            setTimeout(() => {
                document.location.replace('/dashboard');
            }, 100);
        } else {
            const error = await response.json();

            if (error.message.indexOf('credentials') > -1) {
                $('#credential-alert').removeClass('hide');
            } else if (error.message.indexOf('verify') > -1) {
                $('#verify-alert').removeClass('hide');
            }
        }
    }
}

document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
