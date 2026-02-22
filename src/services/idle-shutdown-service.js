function createIdleShutdownService({ idleShutdownMilliseconds, onIdleShutdown, activityCheckIntervalMilliseconds = 60 * 1000 }) {
  let mostRecentActivityTimestamp = Date.now();
  let intervalReference;

  function registerActivity() {
    mostRecentActivityTimestamp = Date.now();
  }

  function start() {
    intervalReference = setInterval(() => {
      const currentTimestamp = Date.now();
      const idleDuration = currentTimestamp - mostRecentActivityTimestamp;
      if (idleDuration >= idleShutdownMilliseconds) {
        onIdleShutdown(idleDuration);
      }
    }, activityCheckIntervalMilliseconds);
  }

  function stop() {
    if (intervalReference) {
      clearInterval(intervalReference);
    }
  }

  return {
    registerActivity,
    start,
    stop
  };
}

module.exports = {
  createIdleShutdownService
};
