import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/ping", (_req: Request, res: Response) => { // _req --> it means we never use req but still we want req 
    res.json({
        message: "pong"
    })
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})