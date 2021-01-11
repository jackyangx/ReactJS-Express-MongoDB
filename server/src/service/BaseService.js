/**
 * Operation database base class
 *
 * @class BaseService
 */
export default class BaseService {
  constructor(modal) {
    this.modal = modal;
  }

  /**
   * console output log
   *
   * @memberof MongoDbHelper
   */
  log() {
    try {
      const _curDate = new Date();
      const info = `${_curDate.getFullYear()}-${
        _curDate.getMonth() + 1
      }-${_curDate.getDay()} ${_curDate.getHours()}:${_curDate.getMinutes()}:${_curDate.getSeconds()}.${_curDate.getMilliseconds()}`;
      if (process.env.NODE_ENV !== 'test') {
        console.log(`${info}-->`, ...arguments);
      }
    } catch (ex) {
      console.log(ex);
      console.log(args);
    }
  }
  logJson(data) {
    this.log(JSON.stringify(data));
  }
  /**
   * Generating random numbers
   *
   * @param {number} [len=10]
   * @returns
   * @memberof BaseService
   */
  GeneratingString(len = 10) {
    const arr = '!@#$%^&*()_+|1234567890-=qwertyuiop[]asdfghjkl;zxcvbnm,./ABCDEFGHIJKLMNOPQRSTUVWXZY'.split('');
    let str = '';
    for (var i = 0; i < len; i++) {
      pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  }

  /**
   * find record by id
   *
   * @param {*} id
   * @returns
   * @memberof BaseService
   */
  async findById(id) {
    const info = await this.modal.findById(id);
    return info ? JSON.parse(JSON.stringify(info)) : null;
  }

  /**
   * return record list
   *
   * @static
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..}, limit:10, skip:0, ...}
   * @returns
   * @memberof BaseService
   */
  async find(condition = {}, fields = {}, options = {}) {
    try {
      const list = await this.modal.find(condition, fields, options);
      return list ? JSON.parse(JSON.stringify(list)) : [];
    } catch (ex) {
      this.log(ex);
      this.failure(ex.message);
    }
  }

  /**
   * save document to db
   *
   * @param {any} fields
   * @returns
   * @memberof BaseService
   */
  async save(fields) {
    try {
      const result = await this.modal.create(fields);
      return result ? JSON.parse(JSON.stringify(result)) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `save doucment error:${ex.message}`});
    }
  }

  /**
   * create
   *
   * @param {*} docs
   * @return {*}
   */
  async create(docs) {
    return this.save(docs);
  }

  /**
   *  find first document  by condition
   *
   * @param {any} condition  {field1:'conditionValue',type:4 ...}
   * @param {any} [fields={}]
   * @param {any} [options={}] {sort:{fiel4:-1,..},...}
   * @returns
   * @memberof BaseService
   */
  async findOne(condition, fields = {}, options = {}) {
    try {
      const result = await this.modal.findOne(condition, fields, options);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return null;
    }
  }

  /**
   * modify document by id
   *
   * @param {any} id      PK
   * @param {any} fields  {field1:'a',field2:'b'...}
   * @returns
   * @memberof BaseService
   */
  async findByIdAndUpdate(id, fields) {
    try {
      const condition = {_id: id};
      await this.modal.updateOne(condition, {$set: fields});
      const result = await this.modal.findById(id);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }

  /**
   * update document fields by condition
   *
   * @param {*} condition
   * @param {*} fields
   * @returns
   * @memberof BaseService
   */
  async updateByCondition(condition, fields) {
    try {
      await this.modal.updateOne(condition, fields);
      const result = await this.modal.findOne(condition);
      return result ? result.toJSON() : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }

  /**
   * delete document by id
   *
   * @param {*} id
   * @returns
   * @memberof BaseService
   */
  async findByIdAndDelete(id) {
    return this.modal.findByIdAndDelete(id);
  }

  /**
   * get document count by condition
   *
   * @param {*} condition
   * @returns
   * @memberof BaseService
   */
  async count(condition) {
    return this.modal.countDocuments(condition);
  }

  /**
   * batch update doucment
   *
   * @param {*} condition
   * @param {*} updateField
   * @returns
   * @memberof BaseService
   */
  async updateMany(condition, updateField) {
    try {
      await this.modal.updateMany({...condition}, {$set: {...updateField}});
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }

  /**
   * delete document
   *
   * @param {*} condition : delete condition fields
   * @returns
   * @memberof BaseService
   */
  async deleteOne(condition) {
    try {
      await this.modal.deleteOne({...condition});
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }

  /**
   * delete documetn by many
   *
   * @param {*} condition
   * @returns
   * @memberof BaseService
   */
  async deleteMany(condition) {
    try {
      await this.modal.deleteMany({...condition});
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }
  /**
   *
   *
   * @param {*} aggregations = [ {$group : {} } , {$project:{} }, {$match: {}} ]
   * @example
   * this.aggregate(
   * [
   *   {
   *     $group: {
   *       _id: { worker_id: '$worker_id' },
   *       totalPrice: { $sum: '$price' }
   *     }
   *   },
   *   {
   *     $project: { worker_id: '$_id.worker_id', total: '$totalPrice' }
   *   },
   *   {
   *     $match: { worker_id: '5f6eb0eb5025214504cd2377' }
   *   }
   * ])
   *
   * @return {*}
   */
  async aggregate(aggregations) {
    try {
      const result = await this.modal.aggregate(aggregations);
      return result && result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : null;
    } catch (ex) {
      this.log(ex);
      return Promise.reject({msg: `[${this.TableName}]update error :${ex.message}`});
    }
  }

  /**
   * error process
   *
   * @param {*} msg
   * @memberof BaseService
   */
  failure(msg) {
    throw Error(msg);
  }

  /**
   * return success content
   *
   * @param {*} msg
   * @returns
   * @memberof BaseService
   */
  success(msg) {
    return {code: 200, data: msg};
  }

  /**
   * format Date
   * @param fmt
   * @param date
   * @return {*}
   * @constructor
   */
  formatDate(date, fmt = 'yyyy-MM-dd hh:mm:ss.S') {
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
}
