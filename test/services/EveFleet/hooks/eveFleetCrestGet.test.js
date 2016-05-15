'use strict';

const assert = require('assert');
const eveFleetCrestGet = require('../../../../src\services\EveFleet\hooks\eveFleetCrestGet.js');

describe('EveFleet eveFleetCrestGet hook', function() {
  it('hook can be used', function() {
    const mockHook = {
      type: 'before',
      app: {},
      params: {},
      result: {},
      data: {}
    };

    eveFleetCrestGet()(mockHook);

    assert.ok(mockHook.eveFleetCrestGet);
  });
});
