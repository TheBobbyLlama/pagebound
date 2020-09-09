const generateEmailText = function(username, referral_url) {
	return `Welcome to Pagebound, ${username}!

There's just one thing you need to do to get started.  Please visit the following link in your browser:
${referral_url}`;
}

const generateEmailBody = function(username, referral_url) {
	return `<div>
		<h1>Welcome to Pagebound, ${username}!</h1>
		<p>There's just one more thing you need to do to get started.</p>
		<a href="${referral_url}">Please click this link to verify your email address.</a>
	</div>`;
}

module.exports = { generateEmailText, generateEmailBody};