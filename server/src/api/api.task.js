import express from 'express';
import TaskService from '../service/TaskService';
import UserService from '../service/UserService';

const router = express.Router();

router
  // authority judgment
  .use(async (request, response, next) => {
    try {
      const userInfo = request.userInfo;
      if (!userInfo) {
        response.status('401').json({code: 401, data: 'Unauthorized'});
        return;
      }
      await next();
    } catch (ex) {
      response.status('400').json({code: 400, data: ex.msg || ex.message || ex});
    }
  })
  // add record
  .post('/:project_id', async (request, response) => {
    try {
      const {project_id} = request.params;
      const userInfo = request.userInfo;
      const data = request.body;
      data.userInfo = userInfo;
      data.project_id = project_id;

      const info = await TaskService.AddTask(data);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // delete by id
  .delete('/:id', async (request, response) => {
    try {
      const {id} = request.params;
      const userInfo = request.userInfo;
      const info = await TaskService.DeleteTask(id, userInfo.id);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // update by id
  .put('/:id', async (request, response) => {
    try {
      const {id} = request.params;
      const data = request.body;
      data.id = id;
      const info = await TaskService.UpdateTask(data);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // get detail by id
  .get('/:id', async (request, response) => {
    try {
      const {id} = request.query;
      const info = await TaskService.findById(id);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // get user list
  .get('/users/list', async (request, response) => {
    try {
      const list = await UserService.find({}, {username: 1, email: 1, mobile: 1});
      response.json(UserService.success(list));
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  });

export default router;
