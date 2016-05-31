'use strict';

const eveFleetCrestPut = require('./eveFleetCrestPut');

const eveFleetCrestGet = require('./eveFleetCrestGet');

const eveFleetValidation = require('./eveFleetValidation');

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
     all: [globalHooks.log({service: 'EveFleet'}),
           auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated()],
    find: [],
     get: [],
  create: [eveFleetValidation(),
           eveFleetCrestPut(),
           hooks.pluck('star', 'name', 'crest')],
  update: [eveFleetValidation(),
           eveFleetCrestPut(),
           hooks.pluck('star', 'name', 'crest')],
   patch: [eveFleetValidation(),
           eveFleetCrestPut(),
           hooks.pluck('star', 'name', 'crest')],
  remove: []
};

exports.after = {
     all: [],
    find: [],
     get: [eveFleetCrestGet()],
  create: [],
  update: [eveFleetCrestGet()],
   patch: [eveFleetCrestGet()],
  remove: []
};
