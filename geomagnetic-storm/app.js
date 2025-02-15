require('dotenv').config();
const { startScheduler } = require('./scheduler');

console.log('🚀 Iniciando rastreamento de tempestades geomagnéticas...');
startScheduler();