import user from './api.user';
import project from './api.project';
import task from './api.task';

export default (app) => {
  app.use('/api/user', user); //
  app.use('/api/project', project); //
  app.use('/api/task', task); //
};
