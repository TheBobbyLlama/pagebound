const router = require("express").Router();

const apiRoutes = require("./api");
const homeRoutes = require("./home-routes.js");
const emailVerificationRoute = require("./email-verify.js");
const clubSearchRoute = require("./club-search.js");

router.use("/", homeRoutes);
router.use("/validate", emailVerificationRoute);
router.use("/api", apiRoutes);
router.use("/club-search", clubSearchRoute);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;