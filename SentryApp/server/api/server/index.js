'use strict';

import * as auth from '../../auth/auth.service';

var express = require('express');
var controller = require('./server.controller');

var router = express.Router();

router.get('/info', controller.serverInfo);

module.exports = router;
