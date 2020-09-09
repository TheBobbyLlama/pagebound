const router = require('express').Router();
const sequelize = require('../config/connection');
const {User, UserVerification} = require('../models');
const { restore } = require('../models/User');

router.get('/:id/:token', async (req, res) => {
	if ((!req.params.id) || (!req.params.token)) {
		res.status(400);
	}

	User.findOne({
		where: {
			id: req.params.id
		},
		include: [
			{
			  model: UserVerification,
			  attributes: ['token']
			}
		  ]
	})
	.then(dbUserVerificationData => {
		const dataToken = dbUserVerificationData.get({plain: true}).user_verification.token;
		console.log(dataToken);

		if (req.params.token === dataToken) {
			req.session.save(() => {
				req.session.user_id = dbUserVerificationData.id;
				req.session.username = dbUserVerificationData.username;
				req.session.loggedIn = true;
				req.session.zipcode = dbUserVerificationData.zipcode;
			});

			dbUserVerificationData.update({ validated: true })
			.then(() => {
				UserVerification.destroy({
					where: {
						user_id: dbUserVerificationData.id
					}
				})
				.then(dbUserData => {
					res.redirect('/dashboard');
				});
			});
		} else {
			throw('Incorrect token.');
		}
	})
	.catch(err => {
		// TODO - Proper error page!
		console.log(err);
		res.status(500).json(err);
	});
});

module.exports = router;