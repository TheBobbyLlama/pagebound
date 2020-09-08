const router = require('express').Router();

router.get('/', (req, res) => {
  if (!req.session.loggedIn) {
    res.render('login', {
        loggedIn: req.session.loggedIn
    });
  } else {
    res.render('dashboard', {
        loggedIn: req.session.loggedIn
    });
  }
});

router.get('/signup', (req, res) => {
    res.render('signup', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/create-club', (req, res) => {
    res.render('create-club', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        loggedIn: req.session.loggedIn
    });
});

router.get('/results', (req, res) => {
    res.render('results', {
        loggedIn: req.session.loggedIn
    });
});
module.exports = router;