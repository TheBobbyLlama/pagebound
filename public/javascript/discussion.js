async function createCommentFormHandler(event) {
    event.preventDefault();
    url = window.location.href.split("/");
    topicID = url[url.length - 1]
    if (topicID.charAt(topicID.length - 1) === "?") { topicID = topicID.slice(0, topicID.length - 1) }
    newComment = document.querySelector("#newComment").value
    const response = await fetch('/api/comments', {
        method: 'post',
        body: JSON.stringify({
            comment_text: newComment,
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



async function createTopicFormHandler(event) {
    event.preventDefault();
    url = window.location.href.split("/");
    topicID = url[url.length - 1]
    if (topicID.charAt(topicID.length - 1) === "?") { topicID = topicID.slice(0, topicID.length - 1) }
    newComment = document.querySelector("#newComment").value
    const response = await fetch('/api/comments', {
        method: 'post',
        body: JSON.stringify({
            comment_text: newComment,
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

async function editComment(){
    //console.dir($(this).attr("data-id"))
    $(this).hide()
    const commentID = $(this).attr("data-id")
    const commentContent = $(this).parent().parent().children("p")
    var text = commentContent
        .text()
        .trim();
    var textInput = jQuery("<textarea>")
        .addClass("form-control")
        .val(text);
    commentContent.replaceWith(textInput);
    textInput.trigger("focus");

    
    textInput.after(`<button id="cancelBtn" class='button cancel'>Cancel</button>`)
    textInput.after(`<button id='${commentID}' class='button save'>Save</button>`)
}

async function abortEdit(){
    console.log("aborted")

}

async function saveComment(){
    const url = window.location.href.split("/");
    let topicID = url[url.length - 1]
    if (topicID.charAt(topicID.length - 1) === "?") {
        topicID = topicID.slice(0, topicID.length - 1) 
    }
    const commentId = $(this).attr("id")
    console.log("saved")
    $("#cancelBtn").remove();
    console.dir($(this).siblings(".button"))
    const commentContent = $(this).parent().children("textarea")
    $(this).remove();
    const text = commentContent
        .val()
        .trim();
    // recreate p element
    var taskP = jQuery("<p>")
        .text(text);

    const response = await fetch(`/api/comments/${commentId}`, {
        method: 'put',
        body: JSON.stringify({
            comment_text: text,
            discussion_id: topicID
        }),
        headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
        location.reload();
    } else {
        alert(response.statusText);
    }

    // replace textarea with p element
    commentContent.replaceWith(taskP);
}


$(document).on('click', 'button[data-id]', editComment)
$(document).on('click', '.save', saveComment)
$(document).on('click', '.cancel', abortEdit)
document.querySelector('#createCommentForm').addEventListener('submit', createCommentFormHandler);
//document.querySelector('#createTopicForm').addEventListener('submit', createTopicFormHandler);
document.querySelector('#createCommentForm').addEventListener('reset', reloadPage);