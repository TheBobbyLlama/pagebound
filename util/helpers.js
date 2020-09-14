const display_user = (user) => {
	return `<span data-user-id="${user.id}">${user.username} <a href="../send-message/${user.id}"><i class="foundicon-mail"></i></a></span>`;
}

module.exports = {
	format_date: date => {
		return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
			date
		  ).getFullYear()}`;
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
	}
};