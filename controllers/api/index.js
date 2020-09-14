const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const clubRoutes = require('./club-routes');
const ratingRoutes = require('./rating-routes');
const clubSearchRoutes = require("./club-search.js");
const discussionCommentsRoutes = require("./discussion-comment-routes");
const discussionTopicRoutes = require("./discussion-topic-routes");
const messageRoutes = require("./message-routes");

router.use('/users', userRoutes);
router.use('/clubs', clubRoutes);
router.use('/ratings', ratingRoutes);
router.use("/club-search", clubSearchRoutes);
router.use("/topics", discussionTopicRoutes);
router.use("/comments", discussionCommentsRoutes);
router.use("/messages", messageRoutes);

module.exports = router;