const express = require("express");
const session = require("express-session");
const passport = require("passport");
const SequelizeStore = require("connect-session-sequelize") (session.Store);
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;
cors = require("cors");

app.use(cors());


// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Routes for articles
// =============================================================
require("./routes/articleApiRoutes/userarticleApiRoutes")(app);
require("./routes/articleApiRoutes/articleApiRoutes")(app);
require("./routes/transactionApiRoutes")(app);


app.use(
  session ({
    secret: "keyboard cat",
    store: new SequelizeStore({
      db: db.sequelize,
    }),
    resave: false,
    saveUninitialized: false,
    //Life of the page is 10 minutes of idle time signed in before auto logout
    cookie: { maxAge: 600000},
    rolling: true,
  })
);

app.get('/', function (req, res) {
  connection.query('select * from user', function (error, results, fields) {
    if (error) throw error;
    res.end(JSON.stringify(results));
  });
});

app.use(passport.initialize());
app.use(passport.session());

require("./routes/apiRoutes") (
  app, 
  passport, 
  isAuthenticatedMiddleware,
  isNotAuthenticatedMiddleware
);

require("./routes/userRoutes") (
  app,
  isAuthenticatedMiddleware,
  isNotAuthenticatedMiddleware
);

function isAuthenticatedMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  };
}

function isNotAuthenticatedMiddleware() {
  return (req, res, next) => {
    if(!req.isAuthenticated()) return next();
    res.redirect("/");
  };
}

// Syncing our sequilize models and then starting our Express APP
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
  console.log(`Server listening on: http://localhost:${PORT}!`);
  });
});