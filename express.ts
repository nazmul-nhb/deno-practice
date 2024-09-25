import express, { Application, Request, Response } from "npm:express";

const app: Application = express();

const port = 4242;

app.get("/", (_req: Request, res: Response) => {
	res.send({ success: true, message: "Hello Deno" });
});

app.listen(port, () => {
	console.log(`Express Listening on Port: ${port}`);
});
