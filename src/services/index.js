'use strict';
const eveAuth = require('./EveAuth');
const message = require('./message');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(message);
  app.configure(eveAuth);
};
