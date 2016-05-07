'use strict';

const assert = require('assert');
const messageFrom = require('../../../../src\services\message\hooks\messageFrom.js');

describe('message messageFrom hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    messageFrom()(mockHook);

    assert.ok(mockHook.messageFrom);
  });
});
