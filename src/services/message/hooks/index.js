'use strict';

const messageFromResolve = require('./messageFromResolve');

const messageFrom = require('./messageFrom');

const messageTime = require('./messageTime');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;


exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: [],
  get: [],
  create: [messageTime(), messageFrom()],
  update: [messageTime(), messageFrom()],
  patch: [messageTime(), messageFrom()],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [messageFromResolve()],
  create: [messageFromResolve()],
  update: [messageFromResolve()],
  patch: [messageFromResolve()],
  remove: []
};
