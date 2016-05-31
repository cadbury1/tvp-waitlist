'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('char service', function() {
  it('registered the chars service', () => {
    assert.ok(app.service('chars'));
  });
});
