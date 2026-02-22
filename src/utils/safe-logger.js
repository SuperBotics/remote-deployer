function createSafeLogger({ safeLoggingEnabled }) {
  function info(message, metadata = {}) {
    if (!safeLoggingEnabled) return;
    const timestamp = new Date().toISOString();
    console.log(JSON.stringify({ level: 'info', timestamp, message, metadata }));
  }

  function error(message, metadata = {}) {
    const timestamp = new Date().toISOString();
    console.error(JSON.stringify({ level: 'error', timestamp, message, metadata }));
  }

  return { info, error };
}

module.exports = {
  createSafeLogger
};
