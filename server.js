const express = require("express");
const path = require("path");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const sess = {
  secret: "I LIKE BOOKS Y'ALL",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(routes);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on connection to db and server
sequelize.sync({ force: !!process.env.DB_FORCE_RESET }).then(() => {
	app.listen(PORT, () => console.log("Now listening"));
});