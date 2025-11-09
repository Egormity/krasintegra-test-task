import { Response } from "express";

//
export type TUtilSendResJsonProps = {
	res: Response;
	statusCode: number;
	status?: string;
	message?: string;
	data?: unknown;
	user?: unknown;
	accessToken?: string;
	refreshToken?: string;
	stack?: string;
};

//
export default ({
	res,
	statusCode,
	status = "success",
	message,
	data,
	user,
	accessToken,
	refreshToken,
	stack,
}: TUtilSendResJsonProps) =>
	res.status(statusCode).json({
		statusCode,
		status,
		message,
		data,
		user,
		accessToken,
		refreshToken,
		stack,
	});
