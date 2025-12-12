// order.interface.ts

// order.interface.ts

export interface ICreateOrder {
  // Receiver Information
  receiverName: string;
  receiverPhone: string;
  receiverAddress: {
    city: string;
    country: string;
    address_detail: string;
  };

  // Product Information
  productId: string;

  // Delivery Information
  deliveryDate: string | Date;
  deliveryTime: string | Date;

  // Payment Information
  paymentAmount: number;
  transactionId: string;
  paymentGatewayData?: Record<string, any>;
  invoiceUrl?: string;
}

// Optional: Response interface
export interface IOrderResponse {
  id: string;
  orderCode: string;
  receiverName: string;
  receiverPhone: string;
  status: string;
  deliveryDate: Date;
  deliveryTime: Date;
  orderAddress: {
    city: string;
    country: string;
    address_detail: string;
  };
  payment: {
    amount: number;
    status: string;
    transactionId: string;
    invoiceUrl: string;
  };
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}