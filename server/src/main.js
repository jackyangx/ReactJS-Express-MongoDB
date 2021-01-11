import http from 'http';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import fs from 'fs';
import cfg from './config';
import SockerService from './service/SocketService';
import router from './api/api.index';
import UserService from './service/UserService';

const port = process.env.PORT || 5100;
// console log
function printLog() {
  try {
    const _curDate = new Date();
    const info = `${_curDate.getFullYear()}-${
      _curDate.getMonth() + 1
    }-${_curDate.getDate()} ${_curDate.getHours()}:${_curDate.getMinutes()}:${_curDate.getSeconds()}.${_curDate.getMilliseconds()}`;

    console.log(`${info}-->`, ...arguments);
  } catch (ex) {
    console.log(ex);
  }
}

const app = express();
const staticPath = path.join(__dirname, '../public');
// create static resource directory
if (!fs.existsSync(staticPath)) {
  fs.mkdirSync(staticPath, {recursive: true});
}
app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(
  session({
    cookie: {secure: true, maxAge: 60 * 60 * 24, httpOnly: true, path: '/'},
    secret: 'nodex-express@!@#$1234',
    resave: false,
    saveUninitialized: false,
  }),
);

// console print request method and url path;
app.use(async function (req, res, next) {
  const {headers, method, url} = req;

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization,token, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    req.token = headers.token;
    const [isExpire, userInfo] = await UserService.CheckToken(req.token);
    if (!isExpire) {
      req.userInfo = userInfo;
    } else {
      req.token = '';
    }
    if (process.env.NODE_ENV !== 'test') {
      printLog(process.env.NODE_ENV, 'method:', method.toLowerCase(), url);
    }
    await next();
  }
});

// init router
router(app);

app.use('/', (req, res, next) => {
  res.statusCode = 404;
  res.send({code: 404, msg: 'method not found'});
  next();
});

app.use(function (err, req, res, next) {
  if (res.locals) {
    res.locals.message = err.message;
    res.locals.error = err;
  }
  console.log('----------------------error----------', err.status);
  console.log(err);
  res.status(err.status || 500).send(JSON.stringify({code: err.status || 500, msg: err.message}));
});

app.set('port', port);

const server = http.createServer(app);

const ss = new SockerService();

ss.start(server);
server.listen(port, () => {});

server.on('error', (error) => {
  console.log('---------enter error info------------');
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
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
});

// create mongodb connection
const MongoDbConn = () => {
  mongoose.connect(cfg.dbConn, {useUnifiedTopology: true, useNewUrlParser: true}, function (err) {
    if (err) throw err;
    console.log('Connected to mongodb success');
  });
};

// listening
server.on('listening', () => {
  printLog(`http://127.0.0.1:${port}/api`);
  try {
    MongoDbConn();
  } catch (ex) {
    //
  }
});

process.on('unhandledRejection', (err, b, next) => {
  console.log('error', err.message);
  if (next) {
    next();
  }
});

export default app;
