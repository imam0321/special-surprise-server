import httpStatus from 'http-status-codes';
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { isUserExist } from "../../utils/isUserExist";
import { prisma } from "../../config/db";
import { generateOrderCode } from "../../utils/generateOrderCode";
import AppError from "../../errorHelpers/AppError";
import { parse } from "date-fns";
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { ICreateOrder } from './order.interface';
import { QueryBuilder } from '../../utils/QueryBuilder';


const createOrder = async (payload: ICreateOrder, email: string) => {
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

    const transactionId = `TXN_${Date.now()}`;
    const payment = await tx.payment.create({
      data: {
        amount: payload.amount,
        orderId: addOrder.id,
        transactionId: transactionId,
        status: PaymentStatus.UNPAID,
      },
    });

    const sslPayload: ISSLCommerz = {
      name: user.name!,
      email: user.email!,
      phoneNumber: user.phone!,
      address: addOrder.user.address?.address_detail!,
      amount: payload.amount,
      transactionId: payment.transactionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    return {
      paymentUrl: sslPayment.GatewayPageURL,
    };
  });

  return result;
};

const getAllOrders = async (query: Record<string, any>) => {
  const qb = new QueryBuilder(prisma.order, query);

  qb.setInclude({
    user: {
      select: {
        name: true,
        email: true,
        phone: true,
      },
    },
    product: {
      select: {
        productCode: true,
      },
    },
    orderAddress: {
      select: {
        city: true,
        country: true,
        address_detail: true,
      },
    },
    payment: {
      select: {
        amount: true,
        status: true,
        transactionId: true
      },
    },
  });

  qb.options.searchFields = ["orderCode", "receiverName", "receiverPhone"];

  if (query.status) {
    const statusArray = Array.isArray(query.status) ? query.status : [query.status];
    qb.addInFilter("status", statusArray as OrderStatus[]);
  }

  qb.options.sortBy = "createdAt";
  qb.options.sortOrder = "desc";

  return await qb.exec();
};


const getMyOrders = async (userId: string, query: Record<string, any>) => {
  const qb = new QueryBuilder(prisma.order, query);

  qb.setInclude({
    product: {
      select: {
        title: true,
        productCode: true,
      },
    },
    orderAddress: {
      select: {
        city: true,
        country: true,
        address_detail: true,
      },
    },
    payment: {
      select: {
        amount: true,
        status: true,
        transactionId: true,
      },
    },
  });

  qb.addWhere({ userId });

  qb.options.sortBy = "createdAt";
  qb.options.sortOrder = "desc";

  return await qb.exec();
};

const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) {
    throw new AppError(httpStatus.NOT_FOUND, "Order not found");
  }

  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
};