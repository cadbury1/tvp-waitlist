'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
     all: [globalHooks.log({service: 'char'}),
           auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated()],
    find: [auth.queryWithCurrentUser({
             idField: 'charGroup',
                  as: 'group'
           })],
     get: [auth.restrictToRoles({
                  roles: ['admin'],
             
                idField: 'charGroup',
             ownerField: 'group',
                  owner: true
           })],
  create: [auth.associateCurrentUser({
             idField: 'charGroup',
                  as: 'group'
           })],
  update: [auth.restrictToRoles({
                  roles: ['admin'],
             
                idField: 'charGroup',
             ownerField: 'group',
                  owner: true
           })],
   patch: [auth.restrictToRoles({
                  roles: ['admin'],
             
                idField: 'charGroup',
             ownerField: 'group',
                  owner: true
           })],
  remove: [auth.restrictToRoles({
                  roles: ['admin'],
             
                idField: 'charGroup',
             ownerField: 'group',
                  owner: true
           })],
};

exports.after = {
     all: [hooks.pluck('_id', 'name', 'avatar')],
    find: [],
     get: [],
  create: [],
  update: [],
   patch: [],
  remove: []
};
