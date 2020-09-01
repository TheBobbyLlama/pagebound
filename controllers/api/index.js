const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const clubRoutes = require('./club-routes');

router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);

module.exports = router;