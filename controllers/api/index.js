const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const clubRoutes = require('./club-routes');
const ratingRoutes = require('./rating-routes');
const clubSearchRoutes = require("./club-search.js");

router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);
router.use('/ratings', ratingRoutes);
router.use("/club-search", clubSearchRoutes);

module.exports = router;