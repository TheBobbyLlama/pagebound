async function signupFormHandler(event) {
    event.preventDefault();
   
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const passwordCheck = document.querySelector('#password-take-one').value.trim();
    const zipcode = document.querySelector('#zipcode-signup').value.trim();

    //reset alerts/classes
    $('#invalid-email').addClass('hide');
    $('#email-taken').addClass('hide');
    $('#username-alert').addClass('hide');
    $('#zip-alert').addClass('hide');
    $('#pass-match-alert').addClass('hide');
    $('#blank-required').addClass('hide');
    $('#signup-form :input').removeClass('blank-field');

    if (password === passwordCheck) {
        if (username && email && password && (zipcode.length === 5 || zipcode.length === 0)) {
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
                $('#signup-form input').attr('disabled', 'true');
                $('#signup-form > *').addClass('hide');
                $('#signup_success').removeClass('hide');
            } else {
                const error = await response.json()
                console.log(error);
                if (error.errors[0].message === 'Validation isEmail on email failed') {
                    $('#invalid-email').removeClass('hide');
                }
                if (error.errors[0].message === "user.username must be unique") {
                    $('#username-alert').removeClass('hide');
                }
                if (error.errors[0].message === "user.email must be unique") {
                    $('#email-taken').removeClass('hide');
                }
            }
        } else if (!username || !email || !password) { 
            //required fields left blank
            $('#blank-required').removeClass('hide');
            $('#signup-form :input').each(function () {
                const field = $(this)[0];
                if ($(field).val() === '') {
                    $(field).addClass('blank-field')
                }
            });
            $('.button').removeClass('blank-field')
            $('#zipcode-signup').removeClass('blank-field')
        } else {
            $('#zip-alert').removeClass('hide')
        }
    } else { //passwords dont match
        $('#pass-match-alert').removeClass('hide');
    }
}

//visual aid for password match
function passCheckHandler() {
    const password = document.querySelector('#password-signup').value.trim();
    const passwordCheck = document.querySelector('#password-take-one').value.trim();

    if (passwordCheck !== password) {
        $('#password-signup').removeClass('passwords-match-true');
        $('#password-take-one').removeClass('passwords-match-true');
        $('#password-signup').addClass('passwords-match-false');
        $('#password-take-one').addClass('passwords-match-false');
    } else if (passwordCheck === password) {
        $('#password-signup').removeClass('passwords-match-false');
        $('#password-take-one').removeClass('passwords-match-false');
        $('#password-signup').addClass('passwords-match-true');
        $('#password-take-one').addClass('passwords-match-true');
    }
}

document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('#password-signup').addEventListener('input', passCheckHandler);