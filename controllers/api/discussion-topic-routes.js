const router = require('express').Router();
const { DiscussionComment, DiscussionTopic } = require('../../models');

router.get('/', (req, res) => {
    DiscussionTopic.findAll()
        .then(dbTopicData => res.json(dbTopicData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//change topic
router.put('/:id', (req, res) => {
    DiscussionTopic.update(req.body, {
        where: {
            id: req.params.id
        }
    })
        .then(dbTopicData => {
            if (!dbTopicData[0]) {
                res.status(404).json({ message: 'No Topic found with this id' });
                return;
            }
            res.json(dbTopicData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/:id', (req, res) => {
    DiscussionTopic.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(dbTopicData => {
            if (!dbTopicData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbTopicData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get all comments for a given topic id
router.get('/:id/comments', (req, res) => {
    DiscussionComment.findAll({
        where: {
            discussion_id: req.params.id
        }
    })
        .then(dbCommentsByTopic => {
            if (!dbCommentsByTopic) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbCommentsByTopic);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete all comments for a given topic id
router.delete('/:id/comments', (req, res) => {
    DiscussionComment.destroy({
        where: {
            discussion_id: req.params.id
        }
    })
        .then(dbCommentsByTopic => {
            if (!dbCommentsByTopic) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbCommentsByTopic);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    // check the session
    if (req.session) {
        DiscussionTopic.create({
            title: req.body.topic_title,
            book_id: req.body.book_id,
            club_id: req.body.club_id,
        })
            .then(dbTopicData => {
                DiscussionComment.create({
                    discussion_id: dbTopicData.id,
                    user_id: req.session.user_id,
                    comment_text: req.body.topic_text
                })
                .then(dbCommentData => {
                    res.json(dbTopicData);
                });
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

router.delete('/:id', (req, res) => {
    DiscussionTopic.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbTopicData => {
            if (!dbTopicData) {
                res.status(404).json({ message: 'No topic found with this id!' });
                return;
            }
            res.json(dbTopicData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;