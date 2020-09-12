const router = require('express').Router();
const sequelize = require('../config/connection');
const { BookRating, Club, User, ClubMember, DiscussionTopic, DiscussionComment } = require('../models');
const { format_date } = require('../util/helpers');

router.get('/:id', (req, res) => {
    Club.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'username'],
                as: 'owner'
            },
            {
				model: User,
				attributes: ['id', 'username'],
				as: 'members'
			},
			{
				model: DiscussionTopic,
				attributes: [
					'id', 'title', 'book_id',
					[sequelize.literal(`(
						SELECT COUNT(*)
						FROM discussion_comment
						WHERE discussion_comment.discussion_id = discussion_topics.id
					)`), 'comment_count'],
					[sequelize.literal(`(
						SELECT MAX(created_at)
						FROM discussion_comment
						WHERE discussion_comment.discussion_id = discussion_topics.id
					)`), 'last_comment']
				],
				group: 'book_id',
				order: [['last_comment', 'DESC']]
			}
        ]
    })
    .then(dbClubData => {
		const clubData = dbClubData.get({ plain: true });
		const bookGroups = clubData.discussion_topics.map(element => element.book_id).filter((element, index, array) => ((element != clubData.book_id) && (array.indexOf(element) === index)));

		clubData.currentTopics = pullBookDiscussions(clubData.discussion_topics, clubData.book_id);
		clubData.priorTopics = [];

		bookGroups.forEach(element => {
			clubData.priorTopics.push({
				book_id: element,
				topics: clubData.discussion_topics.filter(curTopic => curTopic.book_id === element)
			});
		});
		
		//console.log(clubData);

        res.render('club', {
			loggedIn: req.session.loggedIn,
			isOwner: (clubData.owner_id === req.session.user_id),
            club: clubData
		});
		
	})
	.catch(err => {
		console.log(err);
		res.status(500).send(err);
	});
});

function pullBookDiscussions(topics, id) {
	return topics.filter(element => element.book_id === id);
}

module.exports = router;