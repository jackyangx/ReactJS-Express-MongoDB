import express from 'express';
import UserService from '../service/UserService';

const router = express.Router();

router
  // signup 
  .post('/signup', async (request, response) => {
    try {
      const body = request.body;
      const info = await UserService.SignUp(body);
      response.json(info);
    } catch (ex) {
      response.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  })
  // sign in 
  .post('/signin', async (request, response) => {
    try {
      const body = request.body;
      const info = await UserService.UserSignIn(body);
      response.json(info);
    } catch (ex) {
      response.status(400).json({ code: 400, msg: ex.msg || ex.message || ex });
    }
  });

export default router;
