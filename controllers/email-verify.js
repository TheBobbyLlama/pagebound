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
		const plainData = dbUserVerificationData.get({plain: true});

		if ((!plainData.user_verification) || (!plainData.user_verification.token)) {
			res.redirect('/');
			return;
		}
		const dataToken = plainData.user_verification.token;

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
					// BUG - The session isn't ready yet when we hit this point.  setTimeout doesn't fix it, so we'll kick the user to a redirect page instead.
					res.render('verify-redirect');
				});
			});
		} else {
			throw('Incorrect token.');
		}
	})
	.catch(err => {
		console.log(err);
		res.render('error', { message: err });
	});
});

module.exports = router;