const express = require("express");
const router = express.Router();

const { login, logout, user, redirect, home } = require('../handlers/');
const { loginRequired, ensureCorrectUser } = require("../middleware/auth");


router.get('/login', login);
router.get('/logout', logout);
router.get('/home', loginRequired, home);
router.get('/user', loginRequired, user);
/*
  Handle the response your application gets.
  Using router.all make sures no matter the provider sent you get or post request, they will all be handled
*/
router.all('/redirect', redirect );

module.exports = router;