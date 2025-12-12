/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { OrderStatus, PaymentStatus } from "@prisma/client";

const initPayment = async (orderId: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      orderId
    }
  });

  if (!payment) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Payment Not found. You have not order this gift"
    );
  }

  const order = await prisma.order.findFirst({
    where: { id: payment.orderId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          address: true,
        }
      }
    }
  });

  if (!order) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Order Not found."
    );
  }

  const userName = order.user.name;
  const userEmail = order.user.email;
  const userPhone = order.user.phone;
  const userAddress = order.user.address?.address_detail

  const sslPayload: ISSLCommerz = {
    name: userName!,
    email: userEmail,
    phoneNumber: userPhone!,
    address: userAddress!,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLService.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

const successPayment = async (query: Record<string, string>) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: query.transactionId
    }
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.PAID
        }
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PREPARING
        }
      });

      return {
        success: true,
        message: "Payment completed successfully"
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const failPayment = async (query: Record<string, string>) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: query.transactionId
    }
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED
        }
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PENDING
        }
      });

      return {
        success: false, message: "Payment Failed!"
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const payment = await prisma.payment.findUnique({
    where: {
      transactionId: query.transactionId
    }
  });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.CANCELLED
        }
      });

      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.CANCEL
        }
      });

      return {
        success: false, message: "Payment Cancelled!"
      };
    });
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};


export const PaymentService = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment
};
