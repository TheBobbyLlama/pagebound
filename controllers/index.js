const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./home-routes.js");
const emailVerificationRoute = require("./email-verify.js");
const dashboardRoutes = require("./dashboard-routes.js");
const clubRoutes = require("./club-routes.js");

router.use("/dashboard", dashboardRoutes);
router.use("/club", clubRoutes);
router.use("/", homeRoutes);
router.use("/validate", emailVerificationRoute);
router.use("/api", apiRoutes);


router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;