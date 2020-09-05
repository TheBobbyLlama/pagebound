async function loginFormHandler(event) {
    event.preventDefault();

    const email = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    
    $('#email-alert').addClass('hide');
    $('#password-alert').addClass('hide');

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
            document.location.replace('/dashboard');
        } else {
            const error = await response.json()

            if (error.message = "No user with that email address!") {
                $('#email-alert').removeClass('hide');
            } else if (error.message = 'Incorrect password!') {
                $('#password-alert').removeClass('hide');
            }
        }
    }
}


//LAURENCE, see element IDs 
document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
