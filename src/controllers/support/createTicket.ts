import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import validateTicket from "../../middleware/support/validateTicket";

const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();

  try {
    const data = res.locals.body;

    const ticket = await prisma.ticket.create({
      data,
    });

    res.status(200).json({
      message: "Ticket created successfully",
      data: {
        _id: ticket.id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default [validateTicket, createTicket];
