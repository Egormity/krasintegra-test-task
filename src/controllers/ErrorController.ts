import { Request, Response, NextFunction } from "express";

import utilSendResJson from "../utils/sendResJson";

//
export default class ErrorController {
	static readonly handler = (err: any, req: Request, res: Response, next: NextFunction) => {
		// Send general error if error is not operational in production
		if (!err.isOperational && process.env.NODE_ENV === "production") {
			utilSendResJson({ res, statusCode: 500, status: "fail", message: "Something went wrong" });
			return;
		}

		// Send valid error to production or Any Other error to development
		utilSendResJson({
			res,
			statusCode: err.statusCode || 500,
			status: err.status || "fail",
			message: err.message || "Something went wrong",
			stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // do not send the stack to production
		});
	};
}
