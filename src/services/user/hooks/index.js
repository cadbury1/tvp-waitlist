'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
     all: [globalHooks.log({service: 'user'})], // can't put verifyToken/populateUser/restrictTo... here, because create has to be possible without beeing authenticated
    find: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           auth.restrictToRoles({ roles: ['admin'] })],
     get: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           auth.restrictToRoles({
             roles: ['admin'],
             ownerField: '_id',
             owner: true
           })],
  create: [auth.hashPassword(),
           
           hook => {
             // don't allow to assign yourself roles or a group of eve characters
             hook.data.roles = []
             hook.data.charGroup = null
           }],
  update: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           auth.restrictToRoles({
             roles: ['admin'],
             ownerField: '_id',
             owner: true
           }),
           
           hooks.remove('roles', 'charGroup', hook => {
             if (!hook.params.provider)
               // on internal call, don't remove roles and charGroup properties
               return false

             // don't allow to assign yourself roles or a group of eve characters, unless you're an admin
             return !hook.params.user.roles.contains('admin')
           })],
   patch: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           auth.restrictToRoles({
             roles: ['admin'],
             ownerField: '_id',
             owner: true
           }),
           
           hooks.remove('roles', 'charGroup', hook => {
             if (!hook.params.provider)
               // on internal call, don't remove roles and charGroup properties
               return false

             // don't allow to assign yourself roles or a group of eve characters, unless you're an admin
             return !hook.params.user.roles.contains('admin')
           })],
  remove: [auth.verifyToken(),
           auth.populateUser(),
           auth.restrictToAuthenticated(),
           auth.restrictToRoles({
             roles: ['admin'],
             ownerField: '_id',
             owner: true
           })]
};

exports.after = {
     all: [hooks.remove('password'),
           hooks.remove('roles', 'charGroup', hook => {
             if (!hook.params.provider)
               // on internal call, don't remove roles and charGroup properties
               return false

             // don't publish your roles or group of eve characters, unless you're an admin
             return !hook.params.user || !hook.params.user.roles.contains('admin')
           })],
    find: [],
     get: [],
  create: [],
  update: [],
   patch: [],
  remove: []
};
