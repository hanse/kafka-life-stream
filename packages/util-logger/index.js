function logMessage(level, message) {
  return JSON.stringify({
    level,
    timestamp: Date.now(),
    message
  });
}

function info(message) {
  console.info(logMessage('info', message));
}

function error(message) {
  console.error(logMessage('error', message));
}

module.exports = {
  info,
  error
};
