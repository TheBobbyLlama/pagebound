const router = require('express').Router();
const { BookRating, Club, User, DirectMessage } = require('../models');

router.get('/', (req, res) => {
        User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.session.user_id
            },
            include: [
                {
                    model: Club,
                    attributes: ['name', 'book_id'],
                    as: 'clubs'
                },
                {
                    model: BookRating,
                    attributes: ['id', 'user_id', 'book_id', 'score']
                },
                {
                    model: DirectMessage
                }
            ]
        })
            .then(dbUserData => {
                const userData = dbUserData.get({ plain: true });
                console.log(userData);
                res.render('dashboard', { userData, loggedIn: true });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
});

module.exports = router;