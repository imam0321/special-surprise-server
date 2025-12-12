import httpStatus from 'http-status-codes';
import { PaymentStatus, OrderStatus } from "@prisma/client";
import { isUserExist } from "../../utils/isUserExist";
import { prisma } from "../../config/db";
import { generateOrderCode } from "../../utils/generateOrderCode";
import AppError from "../../errorHelpers/AppError";
import { parse } from "date-fns";
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';

interface CreateOrderPayload {
  receiverName: string;
  receiverPhone: string;
  productId: string;
  deliveryDate: string;
  deliveryTime: string;
  amount: number;
  orderAddress: {
    city: string;
    country: string;
    address_detail: string;
  };
}

const createOrder = async (payload: CreateOrderPayload, email: string) => {
  const user = await isUserExist(email);

  const product = await prisma.product.findUnique({
    where: { id: payload.productId },
  });

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const orderCode = generateOrderCode();
  const deliveryDate = parse(payload.deliveryDate, "dd-MM-yyyy", new Date());
  const deliveryTime = parse(payload.deliveryTime, "h.mm a", new Date());

  const { city, country, address_detail } = payload.orderAddress || {};

  if (!city || !country || !address_detail) {
    throw new AppError(httpStatus.BAD_REQUEST, "Order address is required");
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create Order
    const addOrder = await tx.order.create({
      data: {
        orderCode,
        receiverName: payload.receiverName,
        receiverPhone: payload.receiverPhone,
        userId: user.id,
        productId: product.id,
        deliveryDate,
        deliveryTime,
        orderAddress: {
          create: { city, country, address_detail }
        },
      },
      include: {
        orderAddress: true,
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          }
        }
      },
    });

    // Generate unique transaction ID
    const transactionId = `TXN_${Date.now()}`;

    // Create Payment
    const payment = await tx.payment.create({
      data: {
        amount: payload.amount,
        orderId: addOrder.id,
        transactionId: transactionId,
        status: PaymentStatus.UNPAID,
      },
    });

    // Prepare SSL Commerz payload
    const sslPayload: ISSLCommerz = {
      name: user.name!,
      email: user.email!,
      phoneNumber: user.phone!,
      address: addOrder.user.address?.address_detail!,
      amount: payload.amount,
      transactionId: payment.transactionId,
    };

    // Initialize SSL Payment
    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
      paymentUrl: sslPayment.GatewayPageURL,
      order: addOrder,

    };
  });

  return result;
};

export const OrderService = { createOrder };