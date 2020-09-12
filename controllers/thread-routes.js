const router = require('express').Router();
const sequelize = require('../config/connection');
const { BookRating, Club, User, ClubMember, DiscussionTopic, DiscussionComment } = require('../models');
const { format_date } = require('../util/helpers');

router.get('/:id', (req, res) => {
	DiscussionTopic.findOne({
		where: {
			id: req.params.id
		},
		include: [
			{
				model: Club,
				attributes: [ 'id', 'name' ],
				include: [
					{
						model: User,
						attributes: ['id', 'username'],
						as: 'members'
					}
				]
			},
			{
				model: DiscussionComment,
				include: [
					{
						model: User,
						attributes: [ 'id', 'username' ]
					}
				]
			}
		]
	})
	.then(dbThreadData => {
		if (!dbThreadData) {
			throw "Thread not found!";
		}

		const threadData = dbThreadData.get({plain: true});
		threadData.discussion_comments.forEach(element => element.myComment = (element.user.id === req.session.user_id));
		
		//console.log(threadData);

        res.render('thread', {
			loggedIn: req.session.loggedIn,
			inClub: !!threadData.club.members.find(item => item.id == req.params.id),
            thread: threadData
		});
		
	})
	.catch(err => {
		console.log(err);
		res.status(500).send(err);
	});
});

module.exports = router;