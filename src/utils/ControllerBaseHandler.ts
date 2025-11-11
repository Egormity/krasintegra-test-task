import { Request, Response } from "express";

import AppError from "./AppError";
import catchAsync from "./catchAsync";
import sendResJson from "./sendResJson";
import { PrismaClient } from "../generated/prisma/client";

//
type TValidPrismaModelKeys = Exclude<keyof PrismaClient, `$${string}` | Symbol>;
type TPrismaModel = PrismaClient[TValidPrismaModelKeys];

//
export default class ControllerBaseHandler {
	static readonly getMany = ({
		prismaModel,
		usePagination = false,
		getWhere,
	}: {
		prismaModel: TPrismaModel;
		usePagination?: boolean;
		getWhere?: ({ req, res }: { req: Request; res: Response }) => any;
	}) =>
		catchAsync(async (req, res) => {
			const { page = "1", size = "10" } = req.query;
			const data = await prismaModel.findMany({
				where: getWhere?.({ req, res }),
				take: usePagination ? +size : undefined,
				skip: usePagination ? (+page - 1) * +size : undefined,
			});
			sendResJson({ res, data, statusCode: 200 });
		});

	//
	static readonly getOneById = ({
		prismaModel,
		itemName = "Item",
	}: {
		prismaModel: TPrismaModel;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const id = +req.params.id;
			const data = await prismaModel.findUnique({ where: { id } });
			if (!data) {
				next(new AppError(404, `${itemName} with id: "${id}" not found`));
				return;
			}
			sendResJson({ res, data, statusCode: 200 });
		});

	//
	static readonly postOne = ({
		prismaModel,
		itemName = "Item",
	}: {
		prismaModel: TPrismaModel;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			if (!req.body.title) return next(new AppError(400, "Title is required"));
			const data = await prismaModel.create({ data: req.body });
			sendResJson({ res, data, statusCode: 201, message: `${itemName} created successfully` });
		});

	//
	static readonly putOneById = ({
		prismaModel,
		itemName = "Item",
	}: {
		prismaModel: TPrismaModel;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const id = +req.params.id;
			const existing = await prismaModel.findUnique({ where: { id } });
			if (!existing) {
				next(new AppError(404, `${itemName} with id: "${id}" not found`));
				return;
			}
			const data = await prismaModel.update({ where: { id }, data: req.body });
			sendResJson({ res, data, statusCode: 201, message: `${itemName} updated successfully` });
		});

	//
	static readonly patchOneById = ({
		prismaModel,
		itemName = "Item",
	}: {
		prismaModel: TPrismaModel;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const id = +req.params.id;
			const existing = await prismaModel.findUnique({ where: { id } });
			if (!existing) {
				next(new AppError(404, `${itemName} with id: "${id}" not found`));
				return;
			}
			const data = await prismaModel.update({ where: { id }, data: { ...existing, ...req.body } });
			sendResJson({ res, data, statusCode: 200, message: `${itemName} updated successfully` });
		});

	//
	static readonly deleteOneById = ({
		prismaModel,
		itemName = "Item",
	}: {
		prismaModel: TPrismaModel;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const id = +req.params.id;
			const existing = await prismaModel.findUnique({ where: { id } });
			if (!existing) {
				next(new AppError(404, `${itemName} with id: "${id}" not found`));
				return;
			}
			await prismaModel.delete({ where: { id } });
			sendResJson({ res, statusCode: 204, message: `${itemName} deleted successfully` });
		});
}
