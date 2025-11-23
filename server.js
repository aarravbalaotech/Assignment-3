#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('./server/config/app');
var debug = require('debug')('webproject:server');
var http = require('http');
require('dotenv').config();
var mongoose = require('mongoose');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Start HTTP server after checking DB connection (wait up to 15s)
 */

function startServer() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

const conn = mongoose.connection;
if (conn && conn.readyState === 1) {
  // already connected
  app.locals.dbConnected = true;
  startServer();
} else {
  let started = false;
  const timeout = setTimeout(() => {
    if (!started) {
      console.warn('MongoDB did not connect within 15s — starting server anyway. Some pages may be unavailable.');
      app.locals.dbConnected = false;
      startServer();
      started = true;
    }
  }, 15000);

  conn.once('open', () => {
    if (!started) {
      clearTimeout(timeout);
      console.log('MongoDB connection opened — starting server');
      app.locals.dbConnected = true;
      startServer();
      started = true;
    }
  });

  conn.on('error', (err) => {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
  });
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log(`Server running on port ${port}`);
}

