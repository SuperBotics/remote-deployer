const test = require('node:test');
const assert = require('node:assert');
const { createIdleShutdownService } = require('../src/services/idle-shutdown-service');

test('createIdleShutdownService triggers callback after idle threshold', async () => {
  let callbackInvocationCount = 0;
  const idleShutdownService = createIdleShutdownService({
    idleShutdownMilliseconds: 50,
    activityCheckIntervalMilliseconds: 10,
    onIdleShutdown: () => {
      callbackInvocationCount += 1;
    }
  });

  idleShutdownService.start();
  await new Promise((resolve) => setTimeout(resolve, 120));
  idleShutdownService.stop();

  assert.equal(callbackInvocationCount > 0, true);
});
