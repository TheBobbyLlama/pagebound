const submitNewDiscussion = async function(event) {
	event.preventDefault();

	let club_id = $(this).attr('data-club-id');
	let book_id = $(this).attr('data-book-id');
	let topic_title = $('#new-title').val();
	let topic_text = $('#new-body').val();

	console.log(club_id, book_id, topic_title, topic_text);

	if ((!topic_title) || (!topic_text)) {
		// TODO - Show an error message!
		return;
	}

	const response = await fetch('/api/topics', {
		method: 'post',
		body: JSON.stringify({
			club_id,
			book_id,
			topic_title,
			topic_text
		}),
		headers: { 'Content-Type': 'application/json' }
	});

	if (response.ok) {
		const data = await response.json();
		window.location.assign(`/discussion/${data.id}`);
	}
}

$('#new-discussion-form').on('submit', submitNewDiscussion);