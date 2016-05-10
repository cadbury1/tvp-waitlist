'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('EveFleet service', function() {
  it('registered the EveFleets service', () => {
    assert.ok(app.service('EveFleets'));
  });
});
