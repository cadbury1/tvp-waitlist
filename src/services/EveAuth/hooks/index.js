'use strict';

const eveAuthGenerateState = require('./eveAuthGenerateState');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  find: hooks.disable('external'),
  get: hooks.disable('external'),
  create: [eveAuthGenerateState()],
  update: hooks.disable('external'),
  patch: hooks.disable('external'),
  remove: hooks.disable('external')
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
