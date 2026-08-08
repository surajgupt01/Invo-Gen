// types/razorpay.d.ts

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  subscription_id?: string;
  name: string;
  description: string;
  prefill?: {
    email?: string;
    name?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

export interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}