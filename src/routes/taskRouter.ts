import express from "express";

import TaskController from "../controllers/TaskController";

//
const taskRouter = express.Router();

//
taskRouter.route("/").get(TaskController.getMany).post(TaskController.postOne);
taskRouter
	.route("/:id")
	.get(TaskController.getOneById)
	.put(TaskController.putOneById)
	.patch(TaskController.patchOneById)
	.delete(TaskController.deleteOneById);

//
export default taskRouter;
