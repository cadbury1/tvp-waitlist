'use strict';

const assert = require('assert');
const messageFromResolve = require('../../../../src\services\message\hooks\messageFromResolve.js');

describe('message messageFromResolve hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    messageFromResolve()(mockHook);

    assert.ok(mockHook.messageFromResolve);
  });
});
