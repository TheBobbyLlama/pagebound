const router = require('express').Router();
const { DiscussionComment, DiscussionTopic } = require('../../models');
let ownerID = 0;
router.get('/', (req, res) => {
    DiscussionComment.findAll()
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//change comment IF the owner is making the request
router.put('/:id', async (req, res) => {
    const dummy = await getCommentOwnerID(req.params.id, res);
    console.log(ownerID)
    if (ownerID === req.session.user_id){
        
        DiscussionComment.update({comment_text: req.body.comment_text}, {
            where: {
                id: req.params.id
            }
        })
            .then(dbCommentData => {
                console.log("updated!")
                if (!dbCommentData[0]) {
                    res.status(404).json({ message: 'No comment found with this id' });
                    return;
                }
                res.json(dbCommentData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
    else {console.log("User requesting isn't the owner!")}

});

router.get('/:id', (req, res) => {
    DiscussionComment.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    // check the session
    if (req.session) {
        DiscussionComment.create({
            comment_text: req.body.comment_text,
            discussion_id: req.body.discussion_id,
            user_id: req.session.user_id
        })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

router.delete('/:id', (req, res) => {
    DiscussionComment.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No comment found with this id!' });
                return;
            }
            res.json(dbCommentData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

async function getCommentOwnerID (id, res) {
    return DiscussionComment.findOne({
        where: {
            id: id
        }
    })
        .then(dbCommentData => {
            if (!dbCommentData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            
            ownerID = dbCommentData.user_id;
            console.log(ownerID)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
}
module.exports = router;