import prisma from "../lib/prisma";
import ControllerBaseHandler from "../utils/ControllerBaseHandler";

//
export default class TaskController {
	static readonly getMany = ControllerBaseHandler.getMany({
		prismaModel: prisma.task,
		usePagination: true,
		getWhere: ({ req }) => ({
			title: { contains: req.query.search as string | undefined },
			completed: req.query.completed ? (req.query.completed === "true" ? true : false) : undefined,
		}),
	});
	static readonly getOneById = ControllerBaseHandler.getOneById({
		prismaModel: prisma.task,
		itemName: "Task",
	});
	static readonly postOne = ControllerBaseHandler.postOne({ prismaModel: prisma.task, itemName: "Task" });
	static readonly putOneById = ControllerBaseHandler.putOneById({
		prismaModel: prisma.task,
		itemName: "Task",
	});
	static readonly patchOneById = ControllerBaseHandler.patchOneById({
		prismaModel: prisma.task,
		itemName: "Task",
	});
	static readonly deleteOneById = ControllerBaseHandler.deleteOneById({
		prismaModel: prisma.task,
		itemName: "Task",
	});
}
