export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "restaurant_owner" | "admin";
  restaurantStatus?: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

export interface IRestaurant {
  _id: string;
  name: string;
  description: string;
  address: string;
  image: string;
  category: string;
  rating: number;
  deliveryTime: number;
  deliveryFee: number;
  isOpen: boolean;
  owner?: string | IUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface IFood {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
  restaurant: string | IRestaurant;
  averageRating: number;
  totalReviews: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartItem {
  _id?: string;
  food: IFood;
  quantity: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IAddress {
  _id: string;
  user: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  addressType: "HOME" | "WORK" | "OTHER";
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICoupon {
  _id: string;
  code: string;
  discountType: "flat" | "percentage";
  discountValue: number;
  minOrderAmount: number;
  expiryDate: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IOrderItem {
  _id?: string;
  food: string | IFood;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder {
  _id: string;
  user: string | IUser;
  restaurant?: string | IRestaurant;
  deliveryAddress: string | IAddress;
  items: IOrderItem[];
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  paymentMethod: "COD" | "ONLINE";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus:
    | "PLACED"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  createdAt?: string;
  updatedAt?: string;
}

export interface IPayment {
  _id: string;
  user: string | IUser;
  order: string | IOrder;
  amount: number;
  currency: "INR";
  paymentId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentMethod: "RAZORPAY";
  status: "PENDING" | "SUCCESS" | "FAILED" | "ABANDONED";
  failureReason?: string;
  verifiedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  _id: string;
  user: string | IUser;
  food: string | IFood;
  order: string | IOrder;
  rating: number;
  comment: string;
  isEdited: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IWishlist {
  _id: string;
  user: string;
  items: Array<{
    _id?: string;
    food: IFood;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
