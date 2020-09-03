async function signupFormHandler(event) {
    event.preventDefault();
   
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const zipcode = document.querySelector('#zipcode-signup').value.trim();

    if (username && email && password) {//intentionally leaving out zipcode since we allow for null values
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password,
                zipcode
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


async function loginFormHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();


    if (username && password) {
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
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
document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);