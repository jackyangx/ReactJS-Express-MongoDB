import {Subject} from 'rxjs';
const ApiMap = {development: '//127.0.0.1:5100', production: ''};

export const ApiService = ApiMap[process.env.NODE_ENV] || '';

export default class Utility {
  static ApiService = ApiService;

  static NotifyLogin = new Subject();
  static NotifyUpdate = new Subject();
  static NotifyLogout = new Subject();
  static NotifyChatMsg = new Subject();

  /**
   * get token from localstorage
   *
   * @static
   * @memberof Utility
   */
  static get Token() {
    return window.localStorage.getItem('token');
  }

  /**
   * save token to localstorage
   *
   * @static
   * @memberof Utility
   */
  static set Token(val) {
    if (!val) {
      window.localStorage.removeItem('token');
    } else {
      window.localStorage.setItem('token', val);
    }
  }

  /**
   * sve user info to localstorage
   *
   * @static
   * @memberof Utility
   */
  static set UserInfo(val) {
    const key = 'userinfo';
    if (!val) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  }

  /**
   * get user info from localstorage
   *
   * @static
   * @memberof Utility
   */
  static get UserInfo() {
    const info = window.localStorage.getItem('userinfo');
    if (info) {
      try {
        return JSON.parse(info);
      } catch (ex) {
        return null;
      }
    }
    return null;
  }

  static Toast() {}

  static LoadingHide() {}

  static IsArray(obj) {
    if (!obj || !Array.isArray(obj) || obj.length === 0) {
      return false;
    }
    return Array.isArray(obj);
  }

  /**
   * format Date
   * @param fmt
   * @param date
   * @return {*}
   * @constructor
   */
  static FormatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss.S') {
    if (!date) {
      return '';
    }
    let __this = new Date();
    let _fmt = fmt || 'yyyy-MM-dd HH:mm:ss.S';
    if (date !== null) {
      if (Date.parse(date)) {
        __this = new Date(date);
      } else {
        try {
          __this = new Date(date);
        } catch (ex) {
          __this = new Date();
        }
      }
    }
    const oo = {
      'M+': __this.getMonth() + 1, //                    month
      'd+': __this.getDate(), //                         day
      'D+': __this.getDate(), //                         day
      'H+': __this.getHours(), //                        hours
      'h+': __this.getHours(), //                        hours
      'm+': __this.getMinutes(), //                      minutes
      's+': __this.getSeconds(), //                      second
      'q+': Math.floor((__this.getMonth() + 3) / 3), //
      S: __this.getMilliseconds(), //                    milliseconds
    };
    if (/(y+)/.test(_fmt)) {
      const fmt1 = _fmt.replace(RegExp.$1, (__this.getFullYear() + '').substr(4 - RegExp.$1.length));
      _fmt = fmt1;
    }
    for (const kk in oo) {
      if (new RegExp('(' + kk + ')').test(_fmt)) {
        _fmt = _fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? oo[kk] : ('00' + oo[kk]).substr(('' + oo[kk]).length));
      }
    }
    return _fmt;
  }

  static Alert(msg) {
    if (!msg) {
      return;
    }
    window.alert(msg);
  }
}
