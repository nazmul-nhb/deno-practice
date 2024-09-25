import express, { Request, Response } from "npm:express";

const app = express();

const port = 4242;

app.get("/", function (_req: Request, res: Response) {
	res.send({ success: true, message: "Hello Deno" });
});

app.listen(port, () => {
	console.log(`Express Listening on Port: ${port}`);
});
