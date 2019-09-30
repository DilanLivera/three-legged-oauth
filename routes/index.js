const express = require("express");
const router = express.Router();

const { login, user, redirect } = require('../handlers/');

router.get('/login', login);
router.get('/user', user);
/*
  Handle the response your application gets.
  Using router.all make sures no matter the provider sent you get or post request, they will all be handled
*/
router.all('/redirect', redirect );

module.exports = router;