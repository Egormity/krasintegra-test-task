import { Response, NextFunction, Request } from "express-serve-static-core";

//
export default (func: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
	(req: Request, res: Response, next: NextFunction) =>
		func(req, res, next).catch(next);
