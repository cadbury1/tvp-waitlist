'use strict';

const eveAuthCreateSsoLink = require('./eveAuthCreateSsoLink');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
     all: [globalHooks.log({service: 'EveAuth'})],
    find:  hooks.disable('external'),
     get:  hooks.disable('external'), // TODO refresh token on get
  create: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           
           hooks.pluck('scope'), // removes everything but data.scope
           auth.associateCurrentUser(), // adds data.userId
           hook => { hook.data.state = '' + Math.random() }], // adds data.state
  update:  hooks.disable('external'),
   patch:  hooks.disable('external'),
  remove:  hooks.disable('external')
};

exports.after = {
     all: [], // TODO pluck access_token
    find: [],
     get: [],
  create: [eveAuthCreateSsoLink(), // adds result.ssoLink
           hooks.pluck('ssoLink')], // removes everything but result.ssoLink
  update: [],
   patch: [],
  remove: []
};
