import express from "npm:express@4.19.2";
import {
	Application,
	NextFunction,
	Request,
	Response,
} from "npm:@types/express";

interface IErrorObject extends Error {
	status?: number;
}

const app: Application = express();

const port = 3000;

app.get("/", (_req: Request, res: Response) => {
	res.send({ success: true, message: "Hello Deno" });
});

// Error handler for 404
app.use((_req: Request, _res: Response, next: NextFunction) => {
	const error: IErrorObject = new Error("Requested URL Not Found!");
	error.status = 404;
	next(error);
});

// Final error handler
app.use(
	(
		error: IErrorObject,
		_req: Request,
		res: Response,
		_next: NextFunction,
	) => {
		console.warn(error.message);
		res.status(error.status || 500).send({
			success: false,
			message: error.message || "Internal Server Error!",
		});
	},
);

app.listen(port, () => {
	console.log(`Express Listening on Port: ${port}`);
});
