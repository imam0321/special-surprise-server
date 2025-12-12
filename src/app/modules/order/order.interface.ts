export interface ICreateOrder {
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