// save environment variables in dotenv
require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const randomString = require('randomstring');

const errorHandler = require("./handlers/error");
const routes = require("./routes/");

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
// serve static files
app.use(express.static('views'));
app.use(express.static(__dirname + "/public"));

// initializes session
app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

// home route
app.get('/', (req, res, next) => {
  res.render("landing-page", { loggedIn: !!req.session.user });
});

// handles the routes except home route
app.use(routes);

// handle errors
app.use(function(req, res, next) {
  let err = new Error("Page Not Found!!!");
  err.status = 404;
  next(err);
});

// set the error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log('Server listening at port ' + port);
});