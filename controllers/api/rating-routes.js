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
            [sequelize.fn('AVG', sequelize.col('score')), 'average_score'],
            [sequelize.fn('COUNT', sequelize.col('score')), 'rating_count']
        ],
        group: 'book_id'
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

// Find ratings for an array of books.
router.post('/forlist', (req, res) => {
    BookRating.findAll({
        attributes: [
            'book_id',
            [sequelize.fn('AVG', sequelize.col('score')), 'average_score'],
            [sequelize.fn('COUNT', sequelize.col('score')), 'rating_count']
        ],
        group: 'book_id',
        where: {
            book_id: req.body.book_ids
        }
    })
    .then(dbRatingData => res.json(dbRatingData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//Get all ratings
router.get('/', (req, res) => {
    BookRating.findAll({
        attributes: [
            'book_id',
            [sequelize.fn('AVG', sequelize.col('score')), 'average_score'],
            [sequelize.fn('COUNT', sequelize.col('score')), 'rating_count']
        ],
        group: 'book_id'
    })
    .then(dbRatingData => res.json(dbRatingData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//change rating
router.put('/:id', (req, res) => {
    if (req.session) {
        BookRating.update(req.body, {
            where: {
                book_id: req.params.id,
                user_id: req.session.user_id
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
    }
});

//delete rating
router.delete('/:id', (req, res) => {
    if (req.session) {
        BookRating.destroy({
            where: {
                book_id: req.params.id,
                user_id: req.session.user_id
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
    }
});

module.exports = router;