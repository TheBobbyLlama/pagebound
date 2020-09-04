async function loginFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();


    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        })

        if (response.ok) {
            //TODO where are we going with this, dashboard again?
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}


//LAURENCE, see element IDs 
document.querySelector('#login-form').addEventListener('submit', loginFormHandler);
