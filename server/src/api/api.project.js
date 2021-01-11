import express from 'express';
import ProjectService from '../service/ProjectService';
import TaskService from '../service/TaskService';

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
      await ProjectService.UpdateProjectState(userInfo);
      await next();
    } catch (ex) {
      response.status('400').json({code: 400, data: ex.msg || ex.message || ex});
    }
  })
  // get list
  .get('/search', async (request, response) => {
    try {
      const {id: user_id} = request.userInfo;
      const {keyword, page = 1, size = 20, state} = request.query;
      const opt = {user_id};
      if (state) {
        opt.project_state = Number(state);
      }
      if (keyword) {
        opt.$or = [];
        opt.$or.push({project_name: {$regex: keyword, $options: '$i'}});
        opt.$or.push({project_describe: {$regex: keyword, $options: '$i'}});
        opt.$or.push({project_people_list: {$regex: keyword, $options: '$i'}});
      }

      await ProjectService.UpdateProjectState(request.userInfo);

      const limit = Number(size);
      const skip = (Number(page) - 1) * limit;
      const list = await ProjectService.find(opt, {create_time: 0, update_time: 0}, {limit, skip, sort: {create_time: -1}});
      const total = await ProjectService.count(opt);
      const totalPage = Math.ceil(total / Number(size));
      response.json(ProjectService.success({list, total, page: Number(page), size: Number(size), totalPage}));
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  .get('/mine/list', async (request, response) => {
    try {
      await ProjectService.UpdateProjectState(request.userInfo);

      const {userInfo} = request;
      const {keyword, page, size, state} = request.query;
      const info = await ProjectService.MineList({user_id: userInfo.id, keyword, page: Number(page), size: Number(size), state});
      response.json(info);
    } catch (ex) {
      console.log(ex);
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  .get('/:id', async (request, response) => {
    try {
      const {id} = request.params;
      const detail = await ProjectService.findById(id);
      detail.taskList = await TaskService.find({project_id: id});
      response.json(ProjectService.success(detail));
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // add
  .post('/', async (request, response) => {
    try {
      const data = request.body;
      data.userInfo = request.userInfo;
      const info = await ProjectService.AddProject(data);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // delete by id
  .delete('/:id', async (request, response) => {
    try {
      const {id} = request.params;
      if (!id) {
        ProjectService.failure('id is not empty');
      }
      const userInfo = request.userInfo;
      await ProjectService.deleteOne({_id: id, user_id: userInfo.id});
      response.json(ProjectService.success('delete success'));
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  })
  // update
  .put('/:id', async (request, response) => {
    try {
      const {id} = request.params;
      const data = request.body;
      data.userInfo = request.userInfo;
      data.id = id;
      const info = await ProjectService.UpdateProject(data);
      response.json(info);
    } catch (ex) {
      response.status(400).json({code: 400, msg: ex.msg || ex.message || ex});
    }
  });

export default router;
