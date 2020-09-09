const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('login', {
      loggedIn: req.session.loggedIn
  });
});

router.get('/signup', (req, res) => {
    res.render('signup', {
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

router.get('/change-user-settings', (req, res) => {
    res.render('change-user-settings', {
        loggedIn: req.session.loggedIn
    });
});

module.exports = router;