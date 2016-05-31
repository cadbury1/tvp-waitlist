'use strict';

const app = require('./app');
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () => {
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
})

app.logger.level = 'silly'

process.on('unhandledRejection', (reason, promise) => {
  app.logger.error("Unhandled Rejection at: Promise %s reason: %s", promise, reason.stack)
})
process.on('uncaughtException', error => {
  app.logger.error("Unhandled Exception: %s", error.stack)
})