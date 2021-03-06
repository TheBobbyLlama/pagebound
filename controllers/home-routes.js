const router = require('express').Router();
const { User, DirectMessage } = require('../models');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/dashboard');
    } else {
        res.render('cta');
    }
});

router.get('/club-search', (req, res) => {
    res.render('club-search', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.get('/cta', (req, res) => {
    res.render('cta');
});

router.get('/create-club', (req, res) => {
    res.render('create-club', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/results', (req, res) => {
    res.render('results', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/change-user-settings', (req, res) => {
    res.render('change-user-settings', {
        loggedIn: req.session.loggedIn
    });
});


router.get('/results', (req, res) => {
    res.render('results', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/inbox', (req, res) => {
    DirectMessage.findAll({
        order: sequelize.literal('created_at DESC'),
        where: {
            recipient_id: req.session.user_id
        }
    }).then(data => {
        const messages = data.map(message => message.get({ plain: true }));
        res.render('inbox', {
            messages,
            loggedIn: req.session.loggedIn
        });
    }); 
});

router.get('/inbox/:id', (req, res) => {
    DirectMessage.findOne({
        where: {
            id: req.params.id
        }
    }).then(data => {
        const message = data.get({ plain: true });
        res.render('direct-message', {
            message,
            loggedIn: req.session.loggedIn
        });
    }); 
});


router.get('/send-message', (req, res) => {
    res.render('send-message', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/send-message/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: [ 'id', 'username' ]
    })
    .then(data => {
        const user = data.get({ plain: true });

        res.render('message-user', {
            user,
            loggedIn: req.session.loggedIn
        });
    });
});

module.exports = router;