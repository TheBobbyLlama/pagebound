const router = require('express').Router();
const transporter = require('../../util/email.js');
const {generateEmailText, generateEmailBody} = require('../../src/verificationEmailTemplate');
const { BookRating, ClubMember, Club, User, UserVerification } = require('../../models');
const { Op } = require("sequelize");

//get all users
router.get('/', (req, res) => {
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//search user by username
router.get('/search', (req, res) => {
    let lookupValue = req.query.name
    console.log(lookupValue);
    User.findAll({
        limit: 20,
        attributes: { exclude: ['password'] },
        where: {
            username: {
                [Op.like]: lookupValue + '%'
            }
        }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//update user settings
router.put('/settings/', (req, res) => {

    updateUser(req.session.user_id, req, res)//, notifyDM, notifyDiscussion)
        .then(()=> {console.log("updated... right?")})
});

//get one user
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Club,
                attributes: ['name'],
                as: 'clubs'
            },
            {
                model: BookRating,
                attributes: ['id', 'user_id', 'isbn', 'score']
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//create new user and session
router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        zipcode: req.body.zipcode,
        notify_new_discussion_comment: true,
        notify_message: true
    })
        .then(dbUserData => {
            UserVerification.create({
                user_id: dbUserData.id,
                token: generateToken()
            })
                .then(dbVerificationData => {
                    const referral = req.headers.origin + '/validate/' + dbUserData.id + '/' + dbVerificationData.token;
                    console.log(referral)
                    transporter.sendMail({
                        from: 'Pagebound <pagebound.bootcamp@gmail.com>',
                        to: [ dbUserData.email ],
                        subject: 'Welcome to Pagebound!  Please verify your email address.',
                        text: generateEmailText(dbUserData.username, referral),
                        html: generateEmailBody(dbUserData.username, referral)
                    }, function() {});
                    
                    res.json(dbUserData);
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//login and create session
router.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'Incorrect credentials!' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);
    
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect credentials!' });
            return;
        }

        if (!dbUserData.validated) {
            res.status(401).json({ message: 'You must verify your email address before you can log in.' });
            return;
        }
    
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            req.session.zipcode = dbUserData.zipcode;
    
        res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });
});

//logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});

//change username/password
router.put('/:id', (req, res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
const updateUser = async function (id, req , res) {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
        
}

const generateToken = function() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(characters.length * Math.random()));
    }

    return result;
}

module.exports = router;