async function createCommentFormHandler(event) {
    event.preventDefault();
    url = window.location.href.split("/");
    topicID= url[url.length-1]
    if (topicID.charAt(topicID.length - 1) === "?") { topicID = topicID.slice(0, topicID.length - 1)}
    newComment = document.querySelector("#newComment").value
    const response = await fetch('/api/comments', {
        method: 'post',
        body: JSON.stringify({
            comment_text:newComment,
            discussion_id: topicID
        }),
        headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
        location.reload();
    } else {
        alert(response.statusText);
    }
}
async function reloadPage(){
    location.reload();
}
document.querySelector('#createCommentForm').addEventListener('submit', createCommentFormHandler);
document.querySelector('#createCommentForm').addEventListener('reset', reloadPage);