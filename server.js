// Invoke 'strict' JavaScript mode
'use strict'

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global._config = require('./config/_config')
require('./servers/web')
