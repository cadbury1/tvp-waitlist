'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('EveAuth service', function() {
  it('registered the EveAuths service', () => {
    assert.ok(app.service('EveAuths'));
  });
});
