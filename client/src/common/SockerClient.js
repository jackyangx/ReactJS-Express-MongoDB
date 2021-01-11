import Utility from './Utility';

export default class SockerClient {
  static onAccept;
  static onOpen;
  static onClose;

  /**
   * create socket
   *
   * @static
   * @param {*} wsURL
   * @returns
   * @memberof SockerClient
   */
  static Create() {
    let WS =  Utility.ApiService || `${window.location.host}:5100`;
    if (!window.WebSocket) {
      return false;
    }
    if (this.client) {
      console.log('socket exists...');
      return;
    }
    this.client = new WebSocket(`ws:${WS}/chat`);
    this.client.onopen = (a) => {
      console.log('connection server success...');
      this.onOpen && this.onOpen(a);
    };

    this.client.onclose = (ee) => {
      console.log('server close ', ee.code);
      this.onClose && this.onClose(ee);
    };

    this.client.onmessage = ({data: args}) => {
      try {
        const data = JSON.parse(args);
        const {status} = data;
        switch (status) {
          case 401:
            Utility.NotifyLogout.next(true);
            break;
          default:
            Utility.NotifyChatMsg.next(data);
            this.onAccept && this.onAccept(data);
            break;
        }
        return;
      } catch (ex) {
        console.log(ex);
      }
    };
  }

  static Login() {
    this.SendData({cmdName: 'Login'});
  }

  /**
   * send data
   *
   * @static
   * @param {*} data
   * @memberof SockerClient
   */
  static SendData(data) {
    try {
      // console.log('cmdName:', data.cmdName);
      const token = Utility.Token;
      data.token = token;
      if (this.client && this.client.readyState === this.client.OPEN) {
        this.client.send(JSON.stringify(data));
        return;
      }
      const timeout = 1000;
      this.client = null;
      this.Create();
      setTimeout(() => {
        if (this.client && this.client.readyState === this.client.OPEN) {
          this.client.send(JSON.stringify(data));
          return;
        }
      }, timeout);
    } catch (ex) {
      console.log(ex);
    }
  }

  static Close() {
    console.log('--close--socket--');
    if (this.client) {
      console.log('--close--socket--1');
      if (this.client.readyState === this.client.OPEN) {
        console.log('--close--socket--3');
        this.client.close(3000, 'close');
      }
    }
  }

  /**
   * get Message list
   *
   * @static
   * @param {*} project_id
   * @memberof SockerClient
   */
  static MessageList(project_id) {
    console.log('--------', project_id);
    this.SendData({cmdName: 'MessageList', data: {project_id}});
  }
}
