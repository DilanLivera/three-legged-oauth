// save environment variables in dotenv
require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');
const request = require('request');
const qs = require('querystring');
const randomString = require('randomstring');

const errorHandler = require("./handlers/error");

const port = process.env.PORT || 3000;
const redirect_uri = process.env.HOST + '/redirect';
// const csrfString = randomString.generate();

app.use(express.static('views'));

// initializes session
app.use(
  session({
    secret: randomString.generate(),
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
  })
);

app.get('/', (req, res, next) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/login', (req, res, next) => {
  // generate that csrf_string for your "state" parameter
  req.session.csrf_string = randomString.generate();
  // construct the GitHub URL you redirect your user to.
  // qs.stringify is a method that creates foo=bar&bar=baz type of string for you.
  const githubAuthUrl =
    'https://github.com/login/oauth/authorize?' +
    qs.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: redirect_uri,
      state: req.session.csrf_string,
      scope: 'user:email'
    });
  // redirect user with express
  res.redirect(githubAuthUrl);
});

app.get('/user', (req, res) => {
  // GET request to get emails
  // this time the token is in header instead of a query string
  request.get({
      url: 'https://api.github.com/user/public_emails',
      headers: {
        Authorization: 'token ' + req.session.access_token,
        'User-Agent': 'OAuth-iIth-GitHub-App'
      }
    },
    (error, response, body) => {
      res.send(
        "<p>You're logged in! Here's all your emails on GitHub: </p>" +
        body +
        '<p>Go back to <a href="/">log in page</a>.</p>'
      );
    }
  );
});

// Handle the response your application gets.
// Using app.all make sures no matter the provider sent you get or post request, they will all be handled
app.all('/redirect', (req, res) => {
  // Here, the req is request object sent by GitHub
  console.log('Request sent by GitHub: ');
  console.log(req.query);

  /* 
    req.query should look like this:
    {
      code: '3502d45d9fed81286eba',
      state: 'RCr5KXq8GwDyVILFA6Dk7j0LbFNTzJHs'
    }
  */
  const code = req.query.code;
  const returnedState = req.query.state;

  if (req.session.csrf_string === returnedState) {
    // Remember from step 5 that we initialized
    // If state matches up, send request to get access token
    // the request module is used here to send the post request
    request.post({
        url:
          'https://github.com/login/oauth/access_token?' +
          qs.stringify({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code: code,
            redirect_uri: redirect_uri,
            state: req.session.csrf_string
          })
      },
      (error, response, body) => {
        // The response will contain your new access token
        // this is where you store the token somewhere safe
        // for this example we're just storing it in session
        console.log('Your Access Token: ');
        console.log(qs.parse(body));
        req.session.access_token = qs.parse(body).access_token;

        // Redirects user to /user page so we can use
        // the token to get some data.
        res.redirect('/user');
      }
    );
  } else {
    // if state doesn't match up, something is wrong
    // just redirect to homepage
    res.redirect('/');
  }
});

// handle errors
app.use(function(req, res, next) {
  let err = new Error("Page Not Found!!!");
  err.status = 404;
  next(err);
});

app.use(errorHandler);

app.listen(port, () => {
  console.log('Server listening at port ' + port);
});