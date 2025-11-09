import catchAsync from "../utils/catchAsync";
import sendResJson from "../utils/sendResJson";
import AppError from "../utils/AppError";
import prisma from "../lib/prisma";

// При расширении вынести в generic контроллер, чтобы не повторяться
export default class TaskController {
	static readonly getMany = catchAsync(async (req, res) => {
		const { completed, search, page = "1", size = "10" } = req.query;
		console.log({ completed, search, page, size });
		const data = await prisma.task.findMany({
			where: {
				completed: completed ? (completed === "true" ? true : false) : undefined,
				title: { contains: search as string | undefined },
			},
			take: +size,
			skip: (+page - 1) * +size,
		});
		sendResJson({ res, data, statusCode: 200 });
	});

	//
	static readonly getOneById = catchAsync(async (req, res, next) => {
		const id = +req.params.id;
		const data = await prisma.task.findUnique({ where: { id } });
		if (!data) {
			next(new AppError(404, `Item with id: "${id}" not found`));
			return;
		}
		sendResJson({ res, statusCode: 200 });
	});

	//
	static readonly postOne = catchAsync(async (req, res, next) => {
		if (!req.body.title) return next(new AppError(400, "Title is required"));
		const data = await prisma.task.create({ data: req.body });
		sendResJson({ res, data, statusCode: 201, message: "Task created successfully" });
	});

	//
	static readonly putOneById = catchAsync(async (req, res, next) => {
		const id = +req.params.id;
		const doesExist = await prisma.task.findUnique({ where: { id } });
		if (!doesExist) {
			next(new AppError(404, `Item with id: "${id}" not found`));
			return;
		}
		const data = await prisma.task.update({ where: { id }, data: req.body });
		sendResJson({ res, data, statusCode: 201, message: "Task updated successfully" });
	});

	//
	static readonly patchOneById = catchAsync(async (req, res, next) => {
		const id = +req.params.id;
		const doesExist = await prisma.task.findUnique({ where: { id } });
		if (!doesExist) {
			next(new AppError(404, `Item with id: "${id}" not found`));
			return;
		}
		const data = await prisma.task.update({ where: { id }, data: req.body });
		sendResJson({ res, data, statusCode: 200, message: "Task updated successfully" });
	});

	//
	static readonly deleteOneById = catchAsync(async (req, res, next) => {
		const id = +req.params.id;
		const doesExist = await prisma.task.findUnique({ where: { id } });
		if (!doesExist) {
			next(new AppError(404, `Item with id: "${id}" not found`));
			return;
		}
		await prisma.task.delete({ where: { id } });
		sendResJson({ res, statusCode: 204, message: "Task deleted successfully" });
	});
}
