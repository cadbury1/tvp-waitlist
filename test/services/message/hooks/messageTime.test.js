'use strict';

const assert = require('assert');
const messageTime = require('../../../../src\services\message\hooks\messageTime.js');

describe('message messageTime hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    messageTime()(mockHook);

    assert.ok(mockHook.messageTime);
  });
});
