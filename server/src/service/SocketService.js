import Message from '../model/model.message';
import WebSockerServer from 'ws';
import BaseService from './BaseService';
import UserService from './UserService';
import TaskService from './TaskService';

export default class SocketService extends BaseService {
  userNum = 0;
  ClientMap = {};
  constructor() {
    super(Message);
  }

  start(server) {
    this.wss = new WebSockerServer.Server({server, path: '/chat'});
    this.connection();
  }

  connection() {
    const self = this;
    this.wss.on('connection', (ws) => {
      self.userNum++;
      self.log('client connection', 'total connention', self.userNum);
      ws.on('pong', function () {
        self.isAlive = true;
      });

      ws.on('message', function (e) {
        self.processMessage({client: ws, data: JSON.parse(e)});
      });
      ws.on('close', function (e) {
        self.userNum--;
        self.log('client connection', 'total connention', self.userNum, e);
        clearInterval(self.interval);
      });

      self.heartbeat();
    });
    this.wss.on('error', (err) => {
      this.log(err);
    });
  }

  heartbeat() {
    this.interval = setInterval(() => {
      this.wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
          console.log('-----1--- hearbeat');
          return ws.terminate();
        }
        // ws.isAlive = false;
        ws.ping(() => {
          // console.log('-----2--- ws.ping')
        });
      });
    }, 1000 * 10);
  }

  sendData(client, data) {
    if (!client) {
      return;
    }
    const value = JSON.stringify({...data, createTime: new Date().getTime()});
    if (client && client.readyState === WebSockerServer.OPEN) {
      this.log('total', this.userNum, 'cmdName:', data.cmdName);
      client.send(value);
    }
  }

  async Logout(client, data) {
    this.sendData(client, {status: 401, msg: 'token expire,login again'});
    client.close();
  }

  async processMessage({client, data}) {
    const {cmdName, token} = data;
    if (cmdName == 'test') {
      this.sendData(client, {...data, ts: new Date()});
      return;
    }
    // judge token is expire
    const [isExpire, userInfo] = await UserService.CheckToken(token);
    if (isExpire) {
      await this.Logout(client, data);
      return;
    }
    const processCmdName = `Cmd_${cmdName}`;

    if (!this[processCmdName]) {
      this.sendData(client, {status: 404, msg: 'not found'});
      return;
    }
    data.userInfo = userInfo;
    this.ClientMap[userInfo.id] = client;
    this[processCmdName](client, data);
  }

  async Cmd_Login(client, data) {
    this.log('user login...');
    this.sendData(client, {cmdName: 'Login', data: 'login success'});
  }

  async Cmd_MessageList(client, body) {
    const {data} = body;
    const {project_id} = data;
    // this.log('project_id:', project_id);
    const list = await this.find({project_id}, {_id: 0, project_id: 0}, {sort: {create_time: -1}, limit: 100});
    list.reverse();
    const info = {cmdName: 'MessageList', data: {project_id, list}};
    this.sendData(client, info);
  }

  async Cmd_Message(client, body) {
    const {userInfo, data} = body;
    const {id: user_id, username} = userInfo;
    const {project_id, message: content} = data;

    const doc = {project_id, user_id, username, content, create_time: Date.now()};
    await this.create(doc);
    const list = await TaskService.find({project_id});
    const msgInfo = {cmdName: 'Message', data: {project_id, data: doc}};

    if (list && list.length > 0) {
      const ownClient = this.ClientMap[list[0].own_id];
      if (ownClient) {
        this.sendData(ownClient, msgInfo);
      }

      list.forEach((row) => {
        const userClient = this.ClientMap[row.task_user_id];
        if (userClient) {
          this.sendData(userClient, msgInfo);
        }
      });
    }
  }
}
