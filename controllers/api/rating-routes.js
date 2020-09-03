const router = require('express').Router();
const { User, BookRating } = require('../../models');
const sequelize = require('../../config/connection');

//create new rating
router.post('/', (req, res) => {
    if (req.session) {
        BookRating.create({
            isbn: req.body.isbn,
            user_id: req.session.user_id,
            score: req.body.score
        })
        .then(dbRatingData => res.json(dbRatingData))
        .catch(err => {
        console.log(err);
        res.status(400).json(err);
        });
    }
});

//Find ratings for book
router.get('/book/:isbn', (req, res) => {
    BookRating.findOne({
        where: {
            isbn: req.params.isbn
        },
        attributes: [
            'isbn',
            [
                sequelize.literal('(SELECT AVG(score) FROM book_rating WHERE isbn = ' + req.params.isbn + ')'),
                'average_score'
            ],
            [
                sequelize.literal('(SELECT COUNT(*) FROM book_rating WHERE isbn = ' + req.params.isbn + ')'),
                'rating_count'
            ]
        ]
    })
    .then(dbRatingData => {
        if (!dbRatingData) {
        res.status(404).json({ message: 'No book found with this isbn' });
        return;
        }
        res.json(dbRatingData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get all ratings
router.get('/', (req, res) => {
    BookRating.findAll({
        attributes: [
            'isbn',
            [
                sequelize.literal('(SELECT AVG(score) FROM book_rating GROUP BY isbn)'),
                'average_score'
            ],
            [
                sequelize.literal('(SELECT COUNT(*) FROM book_rating GROUP BY isbn)'),
                'rating_count'
            ]
        ]
    })
    .then(dbRatingData => res.json(dbRatingData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//change rating
router.put('/:isbn', (req, res) => {
    if (req.session) {
        BookRating.update(req.body, {
            where: {
                isbn: req.params.isbn,
                user_id: req.session.user_id
            }
        })
        .then(dbRatingData => {
            if (!dbRatingData[0]) {
            res.status(404).json({ message: 'No rating found with this isbn' });
            return;
            }
            res.json(dbRatingData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

//delete rating
router.delete('/:isbn', (req, res) => {
    if (req.session) {
        BookRating.destroy({
            where: {
                isbn: req.params.isbn,
                user_id: req.session.user_id
            }
        })
        .then(dbRatingData => {
            if (!dbRatingData) {
                res.status(404).json({ message: 'No rating found with this isbn!' });
                return;
            }
            res.json(dbRatingData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

module.exports = router;