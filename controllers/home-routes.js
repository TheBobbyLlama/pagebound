const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('homepage', {
      loggedIn: req.session.loggedIn
  });
});

router.get('/results', (req, res) => {
    res.render('results', {
        loggedIn: req.session.loggedIn
    });
});
module.exports = router;