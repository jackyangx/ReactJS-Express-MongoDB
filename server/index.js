require('@babel/core');
require('@babel/register');
require('@babel/polyfill');
const app = require('./src/main');
module.exports = app;
