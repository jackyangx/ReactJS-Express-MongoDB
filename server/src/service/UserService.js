import ModelUser from '../model/model.user';
import BaseService from './BaseService';
import jwt from 'jsonwebtoken';
import cfg from './../config';
import bcryptjs from 'bcryptjs';
import CryptoJS from 'crypto-js';

class UserService extends BaseService {
  constructor() {
    super(ModelUser);
  }

  /**
   * check token
   *
   * @param {*} token
   * @return {*}
   * @memberof UserService
   */
  async CheckToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, cfg.jwtKey, function (err, decoded) {
        if (err) {
          resolve([true, null]);
        } else {
          resolve([false, decoded.info]);
        }
      });
    });
  }

  /**
   * user signup
   *
   * @param {*} data
   * @return {*}
   * @memberof UserService
   */
  async SignUp(data) {
    const {username, email, password, confirmPwd, address, mobile} = data;
    this.log('password:', CryptoJS.MD5(password).toString());

    if (!username) {
      this.failure('username is not empty');
    }

    if (!password) {
      this.failure('password is not empty');
    }
    if (confirmPwd != password) {
      this.failure('incorrect password input twice');
    }

    // judge user is exists
    const info = await this.findOne({username});
    if (info) {
      this.failure('username exists');
    }
    const salt = bcryptjs.genSaltSync(10);

    const newPwd = CryptoJS.MD5(`${password}_${salt}`).toString();
    this.log('salt:-->', salt, '--new password', newPwd, 'password', password);

    await this.create({username, email, password: newPwd, salt, address, mobile});
    return this.success('singup success');
  }

  /**
   * user singin
   *
   * @param {*} data
   * @return {*}
   * @memberof UserService
   */
  async UserSignIn(data) {
    const {username, password} = data;
    if (!username) {
      this.failure('username is not empty');
    }
    if (!password) {
      this.failure('password is not empty');
    }

    const info = await this.findOne({username});
    if (!info) {
      this.failure('invalid username or password');
    }
    const newPwd = CryptoJS.MD5(`${password}_${info.salt}`).toString();
    if (info.password !== newPwd) {
      this.failure('invalid username or password');
    }

    delete info.password;
    delete info.salt;
    delete info.update_time;
    delete info.create_time;

    info.token = jwt.sign({info}, cfg.jwtKey, {expiresIn: '24h'});

    return this.success(info);
  }
}

export default new UserService();
