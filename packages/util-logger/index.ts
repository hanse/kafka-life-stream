function logMessage(level: 'info' | 'error' | 'debug', message: any) {
  return JSON.stringify({
    level,
    timestamp: Date.now(),
    message
  });
}

export function info(message: any) {
  console.info(logMessage('info', message));
}

export function error(message: any) {
  console.error(logMessage('error', message));
}

export function debug(message: any) {
  console.debug(logMessage('debug', message));
}
