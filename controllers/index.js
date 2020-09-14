const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./home-routes.js");
const emailVerificationRoute = require("./email-verify.js");
const dashboardRoutes = require("./dashboard-routes.js");
const bookRoutes = require("./book-routes.js");
const clubRoutes = require("./club-routes.js");
const threadRoutes = require("./thread-routes.js");

router.use("/dashboard", dashboardRoutes);
router.use("/book", bookRoutes);
router.use("/club", clubRoutes);
router.use("/discussion", threadRoutes);
router.use("/", homeRoutes);
router.use("/validate", emailVerificationRoute);
router.use("/api", apiRoutes);


router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;