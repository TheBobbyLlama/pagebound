const router = require('express').Router();
const { DirectMessage } = require('../../models');
const { Op } = require('sequelize');

//create new direct message
router.post('/', (req, res) => {
    if (req.session) {
        DirectMessage.create({
            sender_id: req.session.user_id,
            //make sure this'll work:
            recipient_id: req.body.recipient_id,
            subject: req.body.subject,
            message: req.body.message,
            read: false
        })
            .then(dbDMData => res.json(dbDMData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

//set DM read to true
router.put('/:id', (req, res) => {
    if (req.session) {
        DirectMessage.update({ read: true }, {
            where: {
                id: req.params.id,
                order: ['id', 'DESC']
            }
        })
            .then(dbDMData => {
                if (!dbDMData[0]) {
                    res.status(404).json({ message: 'No message found with this id' });
                    return;
                }
                res.json(dbDMData);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

//Get all messages to the logged-in user
router.get('/received', (req, res) => {
    if (req.session) {
        DirectMessage.findAll({
            where: {
                recipient_id: req.session.user_id
            }
        })
            .then(dbDMData => res.json(dbDMData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

router.get('/read', (req, res) => {
    if (req.session) {
        DirectMessage.findAll({
            where: {
                [Op.and]: [{
                    recipient_id: req.session.user_id
                },
                {
                    read: false
                }]
            }
        })
            .then(dbDMData => res.json(dbDMData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

//Get all messages from the logged-in user
router.get('/sent', (req, res) => {
    if (req.session) {
        DirectMessage.findAll({
            where: {
                sender_id: req.session.user_id
            }
        })
            .then(dbDMData => res.json(dbDMData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

//see all messages
router.get('/all/', (req, res) => {
    if (req.session) {
        DirectMessage.findAll({
        })
            .then(dbDMData => res.json(dbDMData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

module.exports = router;