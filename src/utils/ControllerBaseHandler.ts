import { Request, Response } from "express";

import AppError from "./AppError";
import catchAsync from "./catchAsync";
import sendResJson from "./sendResJson";
import { PrismaClient } from "../generated/prisma/client";
import prisma from "../lib/prisma";

//
type TValidPrismaModelName = Exclude<keyof PrismaClient, `$${string}` | Symbol>;

//
export default class ControllerBaseHandler {
	static readonly getMany = ({
		prismaModelName,
		usePagination = false,
		getWhere,
	}: {
		prismaModelName: TValidPrismaModelName;
		usePagination?: boolean;
		getWhere?: ({ req, res }: { req: Request; res: Response }) => any;
	}) =>
		catchAsync(async (req, res) => {
			const prismaModel = prisma[prismaModelName];
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
		prismaModelName,
		itemName = prismaModelName[0].toUpperCase() + prismaModelName.slice(1),
	}: {
		prismaModelName: TValidPrismaModelName;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const prismaModel = prisma[prismaModelName];
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
		prismaModelName,
		itemName = prismaModelName[0].toUpperCase() + prismaModelName.slice(1),
	}: {
		prismaModelName: TValidPrismaModelName;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const prismaModel = prisma[prismaModelName];
			if (!req.body.title) return next(new AppError(400, "Title is required"));
			const data = await prismaModel.create({ data: req.body });
			sendResJson({ res, data, statusCode: 201, message: `${itemName} created successfully` });
		});

	//
	static readonly putOneById = ({
		prismaModelName,
		itemName = prismaModelName[0].toUpperCase() + prismaModelName.slice(1),
	}: {
		prismaModelName: TValidPrismaModelName;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const prismaModel = prisma[prismaModelName];
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
		prismaModelName,
		itemName = prismaModelName[0].toUpperCase() + prismaModelName.slice(1),
	}: {
		prismaModelName: TValidPrismaModelName;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const prismaModel = prisma[prismaModelName];
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
		prismaModelName,
		itemName = prismaModelName[0].toUpperCase() + prismaModelName.slice(1),
	}: {
		prismaModelName: TValidPrismaModelName;
		itemName?: string;
	}) =>
		catchAsync(async (req, res, next) => {
			const prismaModel = prisma[prismaModelName];
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
