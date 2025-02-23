import express, { Request, Response } from 'express';
import videoRouter from './video.routes';

const v1Router = express.Router();

v1Router.use("/videos", videoRouter);

v1Router.get("/ping", (_req: Request, res: Response) => { // _req --> it means we never use req but still we want req 
    res.json({
        message: "pong!!!"
    })
})

export default v1Router;