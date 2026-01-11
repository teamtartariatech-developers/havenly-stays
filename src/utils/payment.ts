/**
 * Payment Gateway Utility
 * Supports both PayU Money and Instamojo payment gateways
 */

import { API_BASE_URL } from '@/config/api';

export type PaymentGateway = 'payu' | 'instamojo';

// Payment gateway configuration
export const PAYMENT_GATEWAY: PaymentGateway = 
  (import.meta.env.VITE_PAYMENT_GATEWAY as PaymentGateway) || 'payu';

export interface PaymentPayload {
  amount: string | number;
  firstname: string;
  email: string;
  phone: string;
  booking_id: number | string;
  productinfo: string;
  coupon_code?: string;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  // PayU response fields
  payu_url?: string;
  payment_data?: Record<string, any>;
  // Instamojo response fields
  instamojo_url?: string;
  payment_request_id?: string;
}

/**
 * Initiate payment with the configured gateway
 */
export async function initiatePayment(payload: PaymentPayload): Promise<PaymentResponse> {
  const endpoint = PAYMENT_GATEWAY === 'instamojo' 
    ? `${API_BASE_URL}/admin/bookings/payments/instamojo`
    : `${API_BASE_URL}/admin/bookings/payments/payu`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Failed to initiate payment');
    }

    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
}

/**
 * Handle payment redirect based on gateway type
 */
export function handlePaymentRedirect(paymentData: PaymentResponse): void {
  if (PAYMENT_GATEWAY === 'instamojo') {
    // Instamojo: Direct redirect to payment URL
    if (paymentData.instamojo_url) {
      window.location.href = paymentData.instamojo_url;
    } else {
      throw new Error('Instamojo payment URL not found');
    }
  } else {
    // PayU: Create and submit form
    if (!paymentData.payu_url || !paymentData.payment_data) {
      throw new Error('PayU payment data not found');
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = paymentData.payu_url;

    Object.entries(paymentData.payment_data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }
}
