const router = require('express').Router();
const { User, BookRating } = require('../../models');
const sequelize = require('../../config/connection');

//create new rating
router.post('/', (req, res) => {
    if (req.session) {
        BookRating.create({
            book_id: req.body.book_id,
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
router.get('/book/:id', (req, res) => {
    BookRating.findOne({
        where: {
            book_id: req.params.id
        },
        attributes: [
            'book_id',
            [
                sequelize.literal('(SELECT AVG(score) FROM book_rating WHERE book_id = ' + req.params.id + ')'),
                'average_score'
            ],
            [
                sequelize.literal('(SELECT COUNT(*) FROM book_rating WHERE book_id = ' + req.params.id + ')'),
                'rating_count'
            ]
        ]
    })
    .then(dbRatingData => {
        if (!dbRatingData) {
        res.status(404).json({ message: 'No book found with this id' });
        return;
        }
        res.json(dbRatingData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//change rating
router.put('/:id', (req, res) => {
    BookRating.update(req.body, {
        where: {
            id: req.params.id
        }
    })
    .then(dbRatingData => {
        if (!dbRatingData[0]) {
        res.status(404).json({ message: 'No rating found with this id' });
        return;
        }
        res.json(dbRatingData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete rating
router.delete('/:id', (req, res) => {
    BookRating.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbRatingData => {
        if (!dbRatingData) {
            res.status(404).json({ message: 'No rating found with this id!' });
            return;
        }
        res.json(dbRatingData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;