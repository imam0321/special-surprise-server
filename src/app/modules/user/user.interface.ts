export interface IRegisterCustomerPayload {
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

export interface IRegisterModeratorPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "MODERATOR";
  nid: string;
  address: {
    city: string;
    country: string;
    address_detail: string;
  };
}
export interface IUpdateUser {
  name?: string;
  phone?: string;
  profile?: string;
  address?: {
    city?: string;
    country?: string;
    address_detail?: string;
  };
}