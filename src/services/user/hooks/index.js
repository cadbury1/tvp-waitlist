'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    // can't put verifyToken/populateUser/restrictTo... here, because create has to be possible without beeing authenticated
  ],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({ roles: ['admin'] })
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: '_id',
      owner: true
    })
  ],
  create: [
    auth.hashPassword(),
    // don't allow to assign yourself roles on user creation
    hooks.remove('roles')
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: '_id',
      owner: true
    }),
    // don't allow to assign yourself roles, unless you're an admin
    hooks.remove('roles', hook => {
      return !hook.params.user.roles.contains('admin')
    })
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: '_id',
      owner: true
    }),
    // don't allow to assign yourself roles, unless you're an admin
    hooks.remove('roles', hook => {
      return !hook.params.user.roles.contains('admin')
    })
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToRoles({
      roles: ['admin'],
      ownerField: '_id',
      owner: true
    })
  ]
};

exports.after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
