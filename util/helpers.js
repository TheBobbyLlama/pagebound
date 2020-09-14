const display_user = (user) => {
	return `<span data-user-id="${user.id}">${user.username} <a href="../send-message/${user.id}"><i class="foundicon-mail"></i></a></span>`;
}

async function find_username(id) {
	const response = await fetch('/api/users/:id');

	if (response.ok) {
		const data = await response.json();
		return data.username;
	}
}

module.exports = {
	format_date: date => {
		return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
			date
		  ).getFullYear()}`;
	},
	format_date_message: date => {
		return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
			date
		  ).getFullYear()} ${new Date(date).getHours()}:${new Date(date).getMinutes()}`;
	},
	format_plural: (word, amount) => {
	  if (amount !== 1) {
		return `${word}s`;
	  }
  
	  return word;
	},
	display_user,
	display_userlist: (list, exclude=null) => {
		return list.filter(user=> user.username !== exclude).map(user => display_user(user)).join(', ');
	},
	find_username
};