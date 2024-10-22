import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import _globals from "../../config/_globals";

const ticketSchema = z.object({
  queryText: z.coerce
    .string({
      required_error: "Query Text is required",
      invalid_type_error: "Query Text must be a string",
    })
    .min(1, "Query Text is required"),
  userID: z
    .string({
      required_error: "UserID is required",
      invalid_type_error: "UserID must be a string",
    })
    .email("UserID must be a valid email"),
  deviceID: z.string({
    required_error: "DeviceID is required",
    invalid_type_error: "DeviceID must be a string",
  }),
});

const validateTicket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prisma = new PrismaClient();

  try {
    const { error } = ticketSchema.safeParse(req.body);

    if (error) {
      return res.status(400).json({
        message: "You have some errors in your request",
      });
    }

    res.locals.body = ticketSchema.parse(req.body);

    const { userID, deviceID } = res.locals.body;

    // check if a ticket was created with this userID or deviceID within last 30 min
    const ticket = await prisma.ticket.findFirst({
      where: {
        OR: [
          {
            userID,
          },
          {
            deviceID,
          },
        ],
        date: {
          gte: new Date(new Date().getTime() - _globals.HALF_HOUR),
        },
      },
    });

    if (ticket) {
      return res.status(409).json({
        message:
          "You have already placed a support ticket. Please wait at least 30 minutes before placing another one.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  } finally {
    await prisma.$disconnect();
  }
};

export default validateTicket;
