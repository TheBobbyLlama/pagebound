const router = require('express').Router();
const sequelize = require('../config/connection');
const { Club, ClubMember } = require('../models');

router.get('/:title/id/:id', (req, res) => {
	Club.findAll({
		attributes: [
			'id', 'name', 
			[sequelize.literal(`(
				SELECT COUNT(*)
				FROM club_member
				WHERE club_member.club_id = club.id
			)`), 'member_count']
		],
		where: {
			book_id: req.params.id
		}
	})
	.then(dbClubData => {
		//const clubData = dbClubData.get({ plain: true });
		clubData = dbClubData.map(element => element.dataValues);
		
		console.log(clubData);

		res.render('book-info', {
			loggedIn: req.session.loggedIn,
			title: req.params.title,
			id: req.params.id,
			clubs: clubData,
			amazonUrl: req.params.title.toLowerCase().split(' ').join('+')
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).send(err);
	});
});

module.exports = router;