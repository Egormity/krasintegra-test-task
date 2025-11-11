import ControllerBaseHandler from "../utils/ControllerBaseHandler";

//
export default class TaskController {
	static readonly getMany = ControllerBaseHandler.getMany({
		prismaModelName: "task",
		usePagination: true,
		getWhere: ({ req }) => ({
			title: { contains: req.query.search as string | undefined },
			completed: req.query.completed ? (req.query.completed === "true" ? true : false) : undefined,
		}),
	});
	static readonly getOneById = ControllerBaseHandler.getOneById({ prismaModelName: "task" });
	static readonly postOne = ControllerBaseHandler.postOne({ prismaModelName: "task" });
	static readonly putOneById = ControllerBaseHandler.putOneById({ prismaModelName: "task" });
	static readonly patchOneById = ControllerBaseHandler.patchOneById({ prismaModelName: "task" });
	static readonly deleteOneById = ControllerBaseHandler.deleteOneById({ prismaModelName: "task" });
}
