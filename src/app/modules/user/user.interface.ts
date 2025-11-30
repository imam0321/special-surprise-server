
export interface RegisterCustomerPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    city: string;
    country: string;
    address_detail: string;
  };
}