const router = require('express').Router();

router.get('/', (req, res) => {
  if (req.session.loggedIn) {
    res.render('dashboard', {
        loggedIn: req.session.loggedIn
    });
  } else {
    res.render('login', {
        loggedIn: req.session.loggedIn
    });
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
module.exports = router;