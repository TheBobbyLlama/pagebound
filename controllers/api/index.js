const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const clubRoutes = require('./club-routes');
const ratingRoutes = require('./rating-routes');

router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);
router.use('/ratings', ratingRoutes)

module.exports = router;