export interface CheckoutOrder {
  productName: string;
  originalPrice: number;
  salePrice: number;
  currency: string;
  quantity: number;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
}

export type PaymentProvider = "culqi" | "mercadopago" | "izipay";
