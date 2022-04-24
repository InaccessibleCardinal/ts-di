import { Request, Response, Router } from 'express';

const signupRouter = Router();

signupRouter.post('/', tempHandleSignup);

export default signupRouter;

async function tempHandleSignup(req: Request, res: Response) {
  res.status(200).json({ message: `${req.method}${req.url}` });
}
