async function findUsername(id) {
	const response = await fetch('../api/users/' + id);

	if (response.ok) {
        const data = await response.json();
        return data.username;
	}
}

async function displayUsername() {
    $('.username-inbox').each(async function() {
        const id = $(this)[0].innerHTML;
        console.log(id);
        const username = await findUsername(id);
        $(this)[0].innerHTML = username;
    })
}

window.addEventListener('load', displayUsername)